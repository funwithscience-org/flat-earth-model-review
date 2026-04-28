# The Model

The Conceptual Flat Earth Model is a three.js-rendered interactive scene built by Alan Space Audits, hosted at [alanspaceaudits.github.io/conceptual_flat_earth_model](https://alanspaceaudits.github.io/conceptual_flat_earth_model/). Its source is published at [github.com/AlanSpaceAudits/conceptual_flat_earth_model](https://github.com/AlanSpaceAudits/conceptual_flat_earth_model).

## What the author built

A flat disc with two domes over it. The "heavenly vault" is a flattened cap on which the sun, moon, planets, and starfield are placed at lat/long-derived positions. The "optical vault" is a smaller cap centred on a single observer that defines the limit of vision — the surface onto which sky objects project for the first-person view. The disc itself is rendered with one of twenty selectable map skins (north-pole azimuthal-equidistant, Mercator, Mollweide, Robinson, Winkel Tripel, Hammer, Aitoff, Equal Earth, Eckert IV, Sinusoidal, Gleason's, Lambert AEA, AE-Dual, Orthographic, plus high-resolution NASA imagery variants).

Five astronomical ephemeris pipelines are bundled and run side-by-side in a comparison view: JPL DE405 (via Fred Espenak's published daily tables), VSOP87 (Bretagnon & Francou 1988), Meeus's *Astronomical Algorithms* routines, a Schlyter Earth-focus single-Kepler calculator, and a Ptolemaic deferent-plus-epicycle pipeline ported from the Almagest Ephemeris Calculator. Real airline operational data — 241-waypoint actual flight tracks for Qantas QF27/QF28 with per-waypoint air speed, ground speed, heading, and wind — is bundled and replayable. The UI is localized into eighteen languages including right-to-left Arabic and Hebrew. There are forty-four solar eclipse demos, sixty-seven lunar eclipse demos, analemma figure-eights at five latitudes, polar-day and polar-night sun demonstrations, and tracking HUDs for sixty-plus stars, eleven black holes, nineteen quasars, twenty galaxies, and twelve satellites.

It is by a wide margin the most production-polished flat-earth artifact this review has examined. **(STEELMAN)** The author has shipped real working code, documented his sources, written explicit philosophical-stance language, and in places (the GeoC pipeline failure note, the FE eclipse predictor placeholder) made admissions a less honest project would have hidden.

## What the model actually is

A globe-physics renderer with a flat-disc skin.

Every load-bearing computation in the source — the lat/long-to-disc map, the ground-track of every flight route, every observer's view of every star, every eclipse timing, every planet's right-ascension and declination — runs through formulas that are exact identities on a sphere. The flat-earth disc enters at render time, as the surface onto which the globe-correct answer is finally drawn. Where the model produces output that matches reality, it does so because globe physics produced the answer and the disc was a paint job.

The author's own commits document this. Three quotations from his source, verbatim:

In `js/data/flightRoutes.js`:

```js
// Central angle between two (lat, lon) points in degrees. Equal to
// great-circle distance / Earth radius — used for the central-angle
// demo overlay
```

In `js/demos/flightRoutes.js`:

```js
const MI_PER_DEG = 69.0936;
const mphToDegPerHour = (mph) => (mph == null || !isFinite(mph)) ? null : mph / MI_PER_DEG;
```

(`69.0936` is the Earth's mean great-circle circumference in statute miles divided by 360°. The constant is the Earth's radius, expressed in different units.)

In `js/core/canonical.js`:

```js
// Canonical (lat, lon) → disc position. Hard-coded north-pole
// azimuthal-equidistant; the FE grid, observer placement, and every
// above-disc anchor share this single coordinate framework regardless
// of the loaded map art / projection.
```

This last one is the hinge of the entire model: every coordinate operation routes through one specific projection (north-pole AE), and the twenty map skins offered in the UI are decorative — none of them change what the geometry layer is doing. A user who selects "Mercator" or "Gleason's" or "AE-Dual" still has every line of code in the simulator using north-pole-AE coordinates underneath. The map dropdown is, in the most precise sense, a cosmetic choice.

## Stance

The remaining tabs are organized around three categories of finding:

- **Globe Physics in a Disc Costume** — the cheats themselves: the hard-coded `MI_PER_DEG`, the great-circle SLERP for flight paths, the spherical RA/Dec → Az/El identity, the hand-tuned `headroom = 0.12` constant.
- **AI Stacking** — the meta layer: the FE eclipse predictor that's a literal placeholder, the GeoC pipeline that admits it gets the sky wrong and silently falls back to the heliocentric default, the system-prompt voice leaking into source comments, the volume-as-credibility pattern.
- **Co-opted Demo** — a hosted, modified fork of the author's own site, surfacing each finding directly inside his UI.

The model is not a flat-earth physics. It is a flat-earth visual surface laid over globe physics. That is interesting — as a coding project it is impressive, and as a teaching aid it could be turned to the question of why globe physics is what produces correct answers. It is not, however, the thing it presents itself as.
