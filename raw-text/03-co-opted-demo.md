# Co-opted Demo

This tab will host a modified fork of the subject's three.js scene, served from `flat-earth-model-review/live/`. The fork keeps the author's code as the substrate and adds an overlay layer that surfaces, inside his own UI, the issues catalogued in the **Globe Physics in a Disc Costume** and **AI Stacking** tabs.

The fork is in development. The plan and the specific modifications are documented here so the design can be reviewed before the build.

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
