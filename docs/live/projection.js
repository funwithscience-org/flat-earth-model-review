// Projection helpers — these are direct re-implementations of the subject
// model's own functions. We use them so the live demonstrations operate
// on his geometry exactly, not a paraphrase.

const DEG = Math.PI / 180;

// His canonical projection (js/core/canonical.js). Hard-coded north-pole
// AE; this is what every coordinate operation in his sim actually uses,
// regardless of which "map skin" the user has selected in the UI.
export function aeProject(latDeg, lonDeg, feRadius = 1) {
  const r  = feRadius * (90 - latDeg) / 180;
  const lo = lonDeg * DEG;
  return [r * Math.cos(lo), r * Math.sin(lo)];
}

// Other projections from js/core/projections.js — used to demonstrate
// that picking a different map skin doesn't change his underlying math.
export function equirect(latDeg, lonDeg, feRadius = 1) {
  return [feRadius * lonDeg / 180, feRadius * latDeg / 180];
}

export function mercator(latDeg, lonDeg, feRadius = 1) {
  const phi = Math.max(-85, Math.min(85, latDeg)) * DEG;
  const y = Math.log(Math.tan(Math.PI / 4 + phi / 2));
  return [feRadius * lonDeg / 180, feRadius * y / 3.131];
}

export function aeDual(latDeg, lonDeg, feRadius = 1) {
  const phi = latDeg * DEG, lam = lonDeg * DEG;
  const cosC = Math.cos(phi) * Math.cos(lam);
  const c = Math.acos(Math.max(-1, Math.min(1, cosC)));
  if (c < 1e-9) return [0, 0];
  const k = (c / Math.PI) / Math.sin(c);
  return [feRadius * k * Math.cos(phi) * Math.sin(lam),
          feRadius * k * Math.sin(phi)];
}

export function laeaPolar(latDeg, lonDeg, feRadius = 1) {
  const r  = feRadius * Math.sin((90 - latDeg) * Math.PI / 360);
  const lo = lonDeg * DEG;
  return [r * Math.cos(lo), r * Math.sin(lo)];
}

// His great-circle SLERP (js/data/flightRoutes.js). Cities to unit-sphere
// xyz, spherical-linear interpolation, back to lat/lon. Sphere math.
export function greatCircleArc(latA, lonA, latB, lonB, n = 192) {
  const φa = latA * DEG, λa = lonA * DEG;
  const φb = latB * DEG, λb = lonB * DEG;
  const a = [Math.cos(φa) * Math.cos(λa), Math.cos(φa) * Math.sin(λa), Math.sin(φa)];
  const b = [Math.cos(φb) * Math.cos(λb), Math.cos(φb) * Math.sin(λb), Math.sin(φb)];
  const dot = a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const ω = Math.acos(Math.max(-1, Math.min(1, dot)));
  const sinω = Math.sin(ω);
  const out = new Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const t  = i / n;
    const sa = Math.sin((1 - t) * ω) / sinω;
    const sb = Math.sin(t * ω) / sinω;
    const cx = sa*a[0] + sb*b[0];
    const cy = sa*a[1] + sb*b[1];
    const cz = sa*a[2] + sb*b[2];
    out[i] = [
      Math.asin(cz) * 180 / Math.PI,
      Math.atan2(cy, cx) * 180 / Math.PI,
    ];
  }
  return out;
}

// His central-angle function (js/data/flightRoutes.js).
// His own comment: "Equal to great-circle distance / Earth radius."
export function centralAngleDeg(latA, lonA, latB, lonB) {
  const φa = latA * DEG, λa = lonA * DEG;
  const φb = latB * DEG, λb = lonB * DEG;
  const dot = Math.sin(φa) * Math.sin(φb)
            + Math.cos(φa) * Math.cos(φb) * Math.cos(λa - λb);
  return Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI;
}

// Cartesian distance between two projected points (in disc units).
// Used to measure actual disc-arc length against central-angle "arc length."
export function discArcLength(arcLatLonPoints, projectFn) {
  let total = 0;
  let prev = projectFn(arcLatLonPoints[0][0], arcLatLonPoints[0][1]);
  for (let i = 1; i < arcLatLonPoints.length; i++) {
    const cur = projectFn(arcLatLonPoints[i][0], arcLatLonPoints[i][1]);
    total += Math.hypot(cur[0] - prev[0], cur[1] - prev[1]);
    prev = cur;
  }
  return total;
}
