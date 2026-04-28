# Co-opted Demo

A 3D globe rendering and the subject model's canonical AE disc, side-by-side, both driven by his own `greatCircleArc()` function — the disc projects through his `canonicalLatLongToDisc()`, the globe places the same lat/lon points on a unit sphere. **One input, two visualizations.** Any disagreement between them is a property of his projection, not of different math.

<iframe id="coopted-demo-frame" src="live/" style="width:100%; height:1900px; border:1px solid var(--border); border-radius:6px; background:var(--bg); margin: 1rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display:block;" title="Globe vs. AE Disc — live demonstrations" loading="lazy"></iframe>

*If the embed above doesn't render, [open the live demonstrations page directly →](live/).*

The page (current build, v1.4) presents three picker-selectable scenarios. Each track has its own real-flight-time and animates accordingly; the longest flight in the active scenario takes ~18 seconds to complete, faster flights finish proportionally sooner. Floating distance balloons travel with each plane — degrees on the disc side, nautical miles on the globe side.

1. **Steelman — Lat-mirror works.** The subject's Equal Arc Mirror demo. JNB↔Sydney is real; the lat-mirror endpoints are synthetic. By sphere symmetry the central angle is identical and a real-world flight at the mirrored latitudes would take the same wall-clock time. The disc draws the southern arc longer than the northern (projection distortion — exactly what he labels it), but the globe shows them as identical mirror-image arcs. **No contradiction. We credit it.**
2. **Contradiction — Same flight time, different latitudes.** JFK↔Tashkent (Uzbekistan Airways HY101, ~12h, 143° Δlon at 41°N) vs Santiago↔Sydney (Qantas QF27/28, ~12-14h, 138° Δlon at -34°S). Both real, both ~12 hours. By "everything is degrees," Tashkent should take longer because it has more Δlon. It doesn't. The cos(lat) compression on longitudes — invisible in his rhetoric, present in his code — is what makes the numbers work.
3. **Killer — 138° of Δlon at four latitudes.** A theoretical comparison (only one of the four legs is a real flight, the others are mathematical anchors that isolate the cos(lat) effect). Real great-circle distances range from 8,280 nm at the equator down to 1,116 nm at 80°N. By his "everything is degrees" framing, all four should take ~17 hours. By his own code, they range from ~17h (equator) to ~2.5h (80°N). The disc and the globe both visually confirm this — the polar arc draws as a tiny ring near the disc center, while the equatorial arc traces nearly half the sphere. **He has solved the southern distance problem at the cost of creating a northern one.**

The numerical readout below the side-by-side views shows for each track: Δlat / Δlon, his code's central angle, the real great-circle distance (central angle × 60 nm/° or 69.0936 mi/°), the "degrees are degrees" prediction (Δlon × 60 nm) with percent error, the estimated flight time at typical cruise speed, and the actual airline operations citation. Each track carries a green `real flight` or orange `synthetic` badge so the data provenance is unambiguous.

## Architecture

Globe rendering: Three.js loaded via the same `importmap` pattern the subject uses (`https://unpkg.com/three@0.162.0/build/three.module.js`). Country outlines from `world-atlas/land-110m.json` decoded inline. Drag-to-rotate; both views animate together.

Disc rendering: SVG, projecting lat/lon points through `aeProject()` (a direct port of his `canonicalLatLongToDisc` from `js/core/canonical.js`).

Flight data: hand-extracted summary statistics for QF27/28 from his bundled `js/data/flightTracks.js` plus city coordinates from `js/data/flightRoutes.js`. All real flights cite their operator and flight number.

Earlier focused demonstrations are still available at [live/three-mini-demos.html](live/three-mini-demos.html) — equal-arc disc-length ratios, QF27/28 in mph (showing his deg/h units are mph divided by Earth circumference), and one-geometry-twenty-skins. The original SVG-recreation overlay prototype is at [live/prototype-equal-arc.html](live/prototype-equal-arc.html).

## Coming next

Demonstrations planned for v2: a side-by-side sun-altitude readout (interpolated `headroom = 0.12` value vs spherical RA/Dec → Az/El identity), a multi-pipeline ephemeris query that surfaces the silent `DE405 → GeoC → VSOP87 → Ptolemy` fallback, and an annotated source viewer pinned to the upstream commit hash so finding-citations can detect drift.

## Why this approach

The original plan was to clone his three.js scene as a substrate and inject an overlay layer that surfaced the contradictions inside his own UI. That approach hit two practical limits: cross-origin restrictions block our hosted page from reading the iframe state of his GitHub-Pages-served sim, and copying his source into our repo for hands-on modification creates licensing concerns (his repo carries no top-level LICENSE file). The "live demonstrations" page below threads both problems: every number is computed by re-running his own published functions on his own bundled data, with full attribution, and the demonstrations that need to expose his disc-projection geometry directly do so by importing his own `aeProject` / `greatCircleArc` / `centralAngleDeg` formulae verbatim from `js/core/canonical.js` and `js/data/flightRoutes.js`. There is no fork; there is a re-execution.

If a future session prefers the deeper "overlay inside his UI" approach, [the original design plan is preserved below](#the-original-overlay-design).

---

## The original overlay design

The seven planned overlays remain a useful reference for v2.

## Design principles

- **Use his code, not a parallel rebuild.** Cloning his three.js scene and layering onto it is more honest than building a debunk-from-scratch site that strawmans his work. If a finding holds up against his actual code, it survives the fairest possible test.
- **Additive, not destructive.** Modifications appear as overlays, banners, and toggles. Nothing he wrote is removed. A user can switch the overlays off and see his original site in our hosting if they want to.
- **Direct surface of the source.** Where his code contains a comment or constant that is part of the finding, the overlay quotes it inline with a link to the source line. The reader should not have to take our word for any of it.
- **Reversible.** Every overlay has an off-switch. The point is to show the contradictions, not to vandalize the source material.

## Planned overlays

### Overlay 1 — Unit Toggle (mph display)

A new button in the bottom bar: **`mph`** / **`° per h`**. When set to mph, every "central-angle deg/h" readout in the model multiplies through `MI_PER_DEG = 69.0936` (his own constant) and displays in statute miles per hour. The QF27/28 demo's "Air Speed (avg)" and "Ground Speed (calc)" readouts will then display approximately `499 mph` and `499 mph`, which is what the bundled airline data says they are. The point: his "central-angle deg/h" units are mph in disguise; revealing the disguise is a one-line change.

### Overlay 2 — Projection Skin Banner

Whenever the user changes the FE Map dropdown to anything other than `ae` (north-pole AE), a top-of-screen banner appears: **"This map skin is decorative. Underlying coordinate math is unchanged from north-pole AE."** The banner cites `js/core/canonical.js` and explains what `canonicalLatLongToDisc` is doing. The banner can be dismissed but recurs each session until the user reads the explanation linked from it.

### Overlay 3 — Disc Arc Length Display

In every Flight Routes demo, alongside the existing **Central Angle: 102°** readout, a new readout appears: **"AE-disc arc length: 1.645 disc-units (south leg) vs 0.747 disc-units (north mirror) — ratio 2.20×"**. The numbers are computed at runtime from his own great-circle arc samples projected through `canonicalLatLongToDisc`. This makes visible, in his own units, what the AE projection is actually doing to "equal-arc" routes.

### Overlay 4 — Sun Altitude Source Display

In the Time tab, a new readout: **"Sun height on vault: linear interpolation across declination, headroom = 0.12. Sphere-observer altitude (cf. `transforms.js raDecToAzEl`): [computed in real time]."** The two values are displayed side by side. The point: the model's sun-altitude visualization is a tuned interpolation; the model's actual altitude *computation* uses the spherical-trig identity. The overlay shows both numbers, and their ratio, in real time.

### Overlay 5 — Ephemeris Fallback Trace

A small ephemeris HUD addition: when the active pipeline (e.g. GeoC) is silently falling back to DE405 for a body or date, a tag **"falling back to DE405"** appears next to the body's RA/Dec readout. The fallback chain is visible to the user instead of hidden by the dispatcher.

### Overlay 6 — Source-Line Annotations

A toggle in the Show panel: **`AI-stacking annotations`**. When on, hovering over any UI control or readout that this review has flagged shows a footnote popup with the relevant verbatim source comment and a citation back to the appropriate section in the review. The "FE Eclipse Predictions" tab in particular gets an annotation that quotes the placeholder comment directly: *"the asked not to fake this with the astropixels table"* — with the missing-noun grammar artifact preserved.

### Overlay 7 — A different "About" panel

The author's About panel asserts:

> "All distances are unitless. `FE_RADIUS = 1`. No earth radius, no AU, no kilometres, no great-circle trigonometry."

Our overlay adds, beneath it:

> *Co-opted demo note: this assertion is contradicted by `js/data/flightRoutes.js` (great-circle SLERP), `js/demos/flightRoutes.js` line 46 (`MI_PER_DEG = 69.0936` — Earth's circumference per degree), and `js/core/transforms.js raDecToAzEl` (spherical-trig identity for observer altitude). See [Globe Physics in a Disc Costume](#tab-globe-physics) for line numbers and verbatim source. — funwithscience.net*

## Implementation notes

The overlay layer is implemented as a single ES module imported after the original `js/main.js`. It hooks into the existing state-store pattern (the model uses a centralized `setState` mutation function visible in the demo definitions) and intercepts state changes to apply our overlays. No fork of the original source files is required; the overlay layer reads them in their published form.

The hosting pattern matches the dome-model-review monitor pattern: the live site at `flat-earth-model-review/live/` is a build artifact that snapshots the upstream commit hash and applies our overlay module on top. When the upstream changes, our build can re-pin or re-apply.

## Status

In development. This tab will update with screenshots and a working link as overlays land.
