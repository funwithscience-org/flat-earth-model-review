# Co-opted Demo

A live page that reproduces several of the subject model's demos using his own functions and bundled data, with the exposing instrumentation built in. Each section computes its numbers in real time from his source — no paraphrasing, no estimates.

**[Open the live demonstrations page →](live/)**

The page (v1) carries three demonstrations:

1. **Equal Arc, Unequal Disc** — renders his "Equal Arc Flight (N/S)" pairs on his canonical AE projection and measures the actual disc-cartesian path length each arc gets drawn with. For Johannesburg ↔ Sydney vs its lat-mirrored northern partner the ratio is **2.70×**; for Santiago ↔ Sydney vs his JFK ↔ "Persian Gulf" same-central-angle pair it is **3.30×**. His demos drive both legs with a single normalized progress tween so they finish at the same wall-clock time, and label the result *"Equal arc → equal time, regardless of projection distortion."* If the disc is the territory, the southern plane has to fly 2.7–3.3× faster than the northern one to match.
2. **QF27/QF28 in mph** — reads the four bundled flight-track summaries from his `flightTracks.js` and shows the "deg/h" units his demo displays alongside the mph values they were computed from. Per-flight conversion through his hard-coded `MI_PER_DEG = 69.0936` constant from `js/demos/flightRoutes.js:46`. The mph numbers are the ones his model has but is configured not to display.
3. **One Geometry, Twenty Skins** — renders Santiago ↔ Sydney through four different projection skins from his `js/core/projections.js` registry (AE, Mercator, AE-Dual, Lambert AEA polar). The `(lat, lon)` coordinates feeding every dot are identical in all four panels, because per `canonical.js` his coordinate framework is hard-coded north-pole AE regardless of which "FE Map" the user has selected.

## Coming next

The page also enumerates demonstrations planned for v2: a side-by-side sun-altitude readout (interpolated `headroom = 0.12` value vs spherical RA/Dec → Az/El identity), a multi-pipeline ephemeris query that surfaces the silent `DE405 → GeoC → VSOP87 → Ptolemy` fallback, and an annotated source viewer pinned to the upstream commit hash so finding-citations can detect drift.

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
