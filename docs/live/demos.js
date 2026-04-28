// Three live demonstrations of findings from the review. Each one
// computes the result from the subject model's own functions and data
// — no paraphrasing, no fabricated numbers.

import {
  aeProject, equirect, mercator, aeDual, laeaPolar,
  greatCircleArc, centralAngleDeg, discArcLength,
} from './projection.js';
import { QF_TRACKS, CITIES, MI_PER_DEG, SUBJECT_URL } from './data.js';

// ------------------------------------------------------------------
// Demo 1 — Equal Arc Disc-Length
// ------------------------------------------------------------------
//
// Renders his Sydney↔Santiago southern leg and the lat-mirrored
// northern partner on his canonical AE projection. Measures the
// actual cartesian path length of each arc *as he draws it*.
// Reports the ratio.
//
// On his page, the "Equal Arc Flight (N/S) (Mirror lat)" demo
// shows these two arcs side-by-side, drives both with a single
// `FlightRoutesProgress` tween, and labels the conclusion as
// "Equal arc → equal time, regardless of projection distortion."
// On his disc, the southern arc is drawn ~2.7× longer than its
// lat-mirrored northern counterpart. Equal arc means "equal central
// angle on a sphere," not "equal cartesian path on the disc."

const PAIRS = [
  {
    id: 'jnb-syd-mirror',
    name: 'JNB ↔ Sydney (south, real) vs lat-mirror (north, synthetic)',
    south: { a: CITIES.jnb, b: CITIES.syd, label: 'Johannesburg ↔ Sydney' },
    north: { a: CITIES.nm_jnb, b: CITIES.nm_syd, label: 'Synthetic mirror "≈ Egypt" ↔ "≈ Pacific"' },
    note:  'This is his "Equal Arc Flight (N/S) (Mirror lat)" demo. Both legs have identical central angle by construction (sphere lat-mirror is an isometry). On his disc the south leg is drawn about 2.7× longer than the north.',
  },
  {
    id: 'scl-syd-vs-jfk-persian',
    name: 'Santiago ↔ Sydney (south, real) vs JFK ↔ "Persian Gulf" (north, synthetic)',
    south: { a: CITIES.scl, b: CITIES.syd, label: 'Santiago ↔ Sydney' },
    north: { a: CITIES.jfk, b: CITIES.persian_n, label: 'JFK ↔ "Persian Gulf"' },
    note:  'This is his "Equal Arc Flight (N/S)" demo. Both legs have a 102° central angle. The "Persian Gulf" anchor is open water in the Arabian Sea, hundreds of km east of Oman — there is no airline route corresponding to it.',
  },
];

function svgPath(points, project, cx, cy, scale) {
  const projected = points.map(([lat, lon]) => project(lat, lon));
  let d = '';
  for (let i = 0; i < projected.length; i++) {
    const [x, y] = projected[i];
    const px = cx + x * scale;
    const py = cy - y * scale;
    d += (i === 0 ? 'M' : 'L') + px.toFixed(2) + ',' + py.toFixed(2);
  }
  return d;
}

function mountEqualArcDemo(root) {
  let activePairId = PAIRS[0].id;

  function render() {
    const pair = PAIRS.find(p => p.id === activePairId);
    const W = 720, H = 360;
    const cx = W * 0.5, cy = H * 0.5;
    const scale = (H * 0.45);  // disc radius = 1.0, fit within H/2
    const arcN = 256;

    const southArc = greatCircleArc(pair.south.a.lat, pair.south.a.lon,
                                    pair.south.b.lat, pair.south.b.lon, arcN);
    const northArc = greatCircleArc(pair.north.a.lat, pair.north.a.lon,
                                    pair.north.b.lat, pair.north.b.lon, arcN);

    const southAngle = centralAngleDeg(pair.south.a.lat, pair.south.a.lon, pair.south.b.lat, pair.south.b.lon);
    const northAngle = centralAngleDeg(pair.north.a.lat, pair.north.a.lon, pair.north.b.lat, pair.north.b.lon);
    const southDisc = discArcLength(southArc, aeProject);
    const northDisc = discArcLength(northArc, aeProject);
    const ratio = southDisc / northDisc;

    const pa = aeProject(pair.south.a.lat, pair.south.a.lon);
    const pb = aeProject(pair.south.b.lat, pair.south.b.lon);
    const pc = aeProject(pair.north.a.lat, pair.north.a.lon);
    const pd = aeProject(pair.north.b.lat, pair.north.b.lon);

    const pickerHtml = PAIRS.map(p => `
      <button data-pid="${p.id}" class="${p.id === activePairId ? 'active' : ''}">${p.name}</button>
    `).join('');

    root.innerHTML = `
      <div class="demo-picker">${pickerHtml}</div>
      <div class="demo-stage">
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AE disc with two great-circle arcs">
          <defs>
            <pattern id="grid-${pair.id}" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="var(--rule)" stroke-width="0.5" opacity="0.5"/>
            </pattern>
          </defs>
          <!-- AE disc outline -->
          <circle cx="${cx}" cy="${cy}" r="${scale}" fill="none" stroke="var(--border)" stroke-width="1" opacity="0.7"/>
          <circle cx="${cx}" cy="${cy}" r="${scale * 0.5}" fill="none" stroke="var(--border)" stroke-width="0.5" opacity="0.5" stroke-dasharray="3 3"/>
          <text x="${cx + scale*0.5 + 6}" y="${cy + 4}" font-size="11" fill="var(--muted)" font-family="var(--mono)">equator (r=0.5)</text>
          <text x="${cx + 6}" y="${cy - 4}" font-size="11" fill="var(--muted)" font-family="var(--mono)">N pole</text>
          <text x="${cx - scale - 50}" y="${cy + 4}" font-size="11" fill="var(--muted)" font-family="var(--mono)">south edge</text>

          <!-- Southern arc -->
          <path d="${svgPath(southArc, aeProject, cx, cy, scale)}"
                fill="none" stroke="#ff8040" stroke-width="2.5"/>
          <circle cx="${cx + pa[0]*scale}" cy="${cy - pa[1]*scale}" r="3.5" fill="#ff8040"/>
          <circle cx="${cx + pb[0]*scale}" cy="${cy - pb[1]*scale}" r="3.5" fill="#ff8040"/>

          <!-- Northern arc -->
          <path d="${svgPath(northArc, aeProject, cx, cy, scale)}"
                fill="none" stroke="#66c8ff" stroke-width="2.5"/>
          <circle cx="${cx + pc[0]*scale}" cy="${cy - pc[1]*scale}" r="3.5" fill="#66c8ff"/>
          <circle cx="${cx + pd[0]*scale}" cy="${cy - pd[1]*scale}" r="3.5" fill="#66c8ff"/>
        </svg>
      </div>
      <div class="demo-readout">
        <div class="demo-readout-row">
          <div>
            <span class="legend-dot" style="background:#ff8040"></span>
            <strong>${pair.south.label}</strong>
            ${pair.south.a.real === false || pair.south.b.real === false ? '<span class="badge synthetic">synthetic</span>' : '<span class="badge real">real</span>'}
          </div>
          <div class="demo-stat">central angle: <code>${southAngle.toFixed(2)}°</code></div>
          <div class="demo-stat">disc-arc length: <code>${southDisc.toFixed(3)} units</code></div>
        </div>
        <div class="demo-readout-row">
          <div>
            <span class="legend-dot" style="background:#66c8ff"></span>
            <strong>${pair.north.label}</strong>
            ${pair.north.a.real === false || pair.north.b.real === false ? '<span class="badge synthetic">synthetic</span>' : '<span class="badge real">real</span>'}
          </div>
          <div class="demo-stat">central angle: <code>${northAngle.toFixed(2)}°</code></div>
          <div class="demo-stat">disc-arc length: <code>${northDisc.toFixed(3)} units</code></div>
        </div>
        <div class="demo-readout-row demo-conclusion">
          <strong>Ratio (south ÷ north disc-arc):</strong>
          <code class="big">${ratio.toFixed(3)}×</code>
        </div>
        <p class="demo-note">${pair.note}</p>
        <p class="demo-note">
          The two arcs have the <em>same central angle</em> on a sphere.
          On his disc they have <em>${ratio.toFixed(2)}×</em> different cartesian path lengths.
          His "Equal Arc → Equal Time" demo runs them with a single
          progress tween so both planes complete in the same wall-clock
          time. If the disc were the territory, the southern plane
          would have to fly ${ratio.toFixed(1)}× faster than the
          northern one. The actual airline data
          (<a href="${SUBJECT_URL}">subject site</a>'s bundled QF27/28 KMZ)
          shows both legs at the same airspeed.
        </p>
      </div>
    `;

    root.querySelectorAll('button[data-pid]').forEach(b => {
      b.addEventListener('click', () => { activePairId = b.dataset.pid; render(); });
    });
  }
  render();
}

// ------------------------------------------------------------------
// Demo 2 — QF27/QF28 in mph
// ------------------------------------------------------------------
//
// Reads each bundled flight track summary, computes the "ground speed"
// his demo shows (central angle ÷ flight time, formatted as deg/h)
// and the equivalent mph (multiplying through MI_PER_DEG = 69.0936).
// Shows both side-by-side. The mph value is what the airline operates
// at; the deg/h value is that mph divided by Earth circumference per
// degree, formatted with units that hide the dependency.

function fmtDmsPerHour(degPerH) {
  const d = Math.floor(degPerH);
  const mFloat = (degPerH - d) * 60;
  const m = Math.floor(mFloat);
  const s = (mFloat - m) * 60;
  return `${d}° ${String(m).padStart(2,'0')}' ${s.toFixed(1).padStart(4,'0')}"/h`;
}

function fmtHMS(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function mountMphDemo(root) {
  const cards = QF_TRACKS.map(track => {
    const gsDegPerH = track.centralAngleDeg / (track.actualSec / 3600);
    const gsMph     = gsDegPerH * MI_PER_DEG;
    const aspMphAvg = track.meanAirSpeedMph;
    const aspDegPerH = aspMphAvg / MI_PER_DEG;
    return `
      <div class="qf-card">
        <h3>${track.label}</h3>
        <table class="qf-table">
          <thead>
            <tr>
              <th></th>
              <th>His display (deg/h)</th>
              <th>What it actually is (mph)</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Air Speed (avg)</strong></td>
              <td><code>${fmtDmsPerHour(aspDegPerH)}</code></td>
              <td><code>${aspMphAvg.toFixed(1)} mph</code></td>
              <td class="muted">mph ÷ ${MI_PER_DEG}</td>
            </tr>
            <tr>
              <td><strong>Ground Speed (calc)</strong></td>
              <td><code>${fmtDmsPerHour(gsDegPerH)}</code></td>
              <td><code>${gsMph.toFixed(1)} mph</code></td>
              <td class="muted">central angle ÷ flight hours, then × ${MI_PER_DEG}</td>
            </tr>
            <tr>
              <td><strong>Central angle</strong></td>
              <td colspan="3"><code>${track.centralAngleDeg.toFixed(3)}°</code> · "great-circle distance / Earth radius" — author's own comment in <code>flightRoutes.js</code></td>
            </tr>
            <tr>
              <td><strong>Flight time (actual / predicted)</strong></td>
              <td colspan="3"><code>${fmtHMS(track.actualSec)} / ${fmtHMS(track.predictedSec)}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }).join('');

  root.innerHTML = `
    <div class="qf-grid">${cards}</div>
    <p class="demo-note">
      Every "deg/h" reading on the subject's page is a real-world
      airline mph reading divided by the constant
      <code>MI_PER_DEG = 69.0936</code> from
      <code>js/demos/flightRoutes.js:46</code>. That constant is the
      Earth's mean great-circle circumference (≈ 24 873 statute miles)
      divided by 360°. The author's About page declares
      <em>"no earth radius, no kilometres, no great-circle
      trigonometry"</em> — and then the working module hard-codes the
      Earth's radius as miles per degree, uses it on every flight
      stat, and labels the result with units that obscure the
      dependency. The model also explicitly refuses to format the
      output back into mph: <em>"this project stays in central-angle
      + time units and never reports linear distance / speed."</em>
      The mph values shown above are the values the model has, but
      will not display.
    </p>
  `;
}

// ------------------------------------------------------------------
// Demo 3 — One Geometry, Twenty Skins
// ------------------------------------------------------------------
//
// Renders the same flight route through four different projection
// skins from his js/core/projections.js registry. The (lat, lon)
// values driving every dot are identical in all four panels —
// taken straight from his bundled great-circle SLERP arc. The
// underlying coordinate framework, per his own canonical.js, is
// always north-pole AE no matter which skin is selected.

const SKINS = [
  { id: 'ae',       name: 'AE (north-pole, his canonical)', fn: aeProject, scale: 0.45 },
  { id: 'mercator', name: 'Mercator',                       fn: mercator,  scale: 0.45 },
  { id: 'ae_dual',  name: 'AE-Dual',                        fn: aeDual,    scale: 0.45 },
  { id: 'laea',     name: 'Lambert AEA polar (Hellerick)',  fn: laeaPolar, scale: 0.65 },
];

function mountSkinsDemo(root) {
  const a = CITIES.scl, b = CITIES.syd;
  const arc = greatCircleArc(a.lat, a.lon, b.lat, b.lon, 256);
  const W = 320, H = 200;

  const panels = SKINS.map(skin => {
    const cx = W * 0.5, cy = H * 0.5;
    const scale = H * skin.scale;
    const pa = skin.fn(a.lat, a.lon);
    const pb = skin.fn(b.lat, b.lon);
    return `
      <div class="skin-panel">
        <h3>${skin.name}</h3>
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="${W}" height="${H}" fill="var(--card-bg)" stroke="var(--border)"/>
          <path d="${svgPath(arc, skin.fn, cx, cy, scale)}"
                fill="none" stroke="#ff8040" stroke-width="2"/>
          <circle cx="${cx + pa[0]*scale}" cy="${cy - pa[1]*scale}" r="3" fill="#ff8040"/>
          <circle cx="${cx + pb[0]*scale}" cy="${cy - pb[1]*scale}" r="3" fill="#ff8040"/>
          <text x="${cx + pa[0]*scale + 6}" y="${cy - pa[1]*scale + 4}" font-size="10" fill="var(--text)" font-family="var(--mono)">SCL</text>
          <text x="${cx + pb[0]*scale + 6}" y="${cy - pb[1]*scale + 4}" font-size="10" fill="var(--text)" font-family="var(--mono)">SYD</text>
        </svg>
      </div>
    `;
  }).join('');

  root.innerHTML = `
    <div class="skins-grid">${panels}</div>
    <p class="demo-note">
      Each panel shows Santiago ↔ Sydney through a different projection
      from his <code>js/core/projections.js</code> registry. The
      <code>(lat, lon)</code> coordinates feeding every dot are
      identical — they come straight from
      <code>greatCircleArc()</code>, which interpolates on the unit
      sphere. Per <code>js/core/canonical.js</code>:
    </p>
    <pre><code>// Hard-coded north-pole azimuthal-equidistant; the FE grid,
// observer placement, and every above-disc anchor share this single
// coordinate framework regardless of the loaded map art / projection.</code></pre>
    <p class="demo-note">
      So in his sim, when a user selects Mercator or AE-Dual or
      Hellerick from the FE Map dropdown, all that changes is the
      painted background image. The geometry layer keeps using
      north-pole AE. The "twenty projections" dropdown is decorative;
      the simulation is committed to one specific projection
      throughout.
    </p>
  `;
}

// ------------------------------------------------------------------
// Mount everything
// ------------------------------------------------------------------

const eq = document.getElementById('demo-equal-arc');
if (eq) mountEqualArcDemo(eq);

const mph = document.getElementById('demo-mph');
if (mph) mountMphDemo(mph);

const skins = document.getElementById('demo-skins');
if (skins) mountSkinsDemo(skins);
