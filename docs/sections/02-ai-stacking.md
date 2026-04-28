# AI Stacking

The Conceptual Flat Earth Model is, by any reasonable inference from its source code, a substantially AI-assisted project. It is also a useful case study in a specific failure mode of AI-assisted content production: **stacking** — the production of large quantities of plausible-looking technical material, much of which is decorative, scaffolded, or self-acknowledged-broken-with-fallbacks, in service of overwhelming a reader's ability to evaluate the claim.

This tab catalogues the tells. None of them is conclusive on its own. Together they describe a recognisable pattern.

## Tell 1 — The system-prompt voice leaking into source comments

> **AI-STACK**
> File: `js/demos/feEclipseTrack.js`

The "FE Eclipse Predictions" tab in the Demos panel is a placeholder. The source file that backs it begins:

```js
// FE eclipse-prediction demo track (PLACEHOLDER).
//
// Intent:
//   A second, structurally separate demo track that predicts eclipses
//   via flat-earth / cycle-harmonic methods (Shane St. Pierre's resource
//   pack; Fred-style Saros/Metonic/synodic-anomalistic-nodal harmonics;
//   Dimbleby's historical eclipse catalogue as validation).
//
// Status at :
//   **PLACEHOLDER** — not yet implemented. The asked
//   not to fake this with the astropixels table. This file provides the
//   structural entry point so future serials can drop in the real
//   prediction logic without disturbing the astropixels-based solar /
//   lunar demo tracks.
```

Two phrases in this comment block deserve attention.

First: *"The asked not to fake this with the astropixels table."* The grammar here is fragmented — there is a missing noun before "asked." That missing noun is, inferable from context, the role-name of an unseen person ("the operator", "the user", "the ", "the human") that the AI assistant editing this file would have referenced. This is the kind of artefact that appears when a model is told *"<role> asked not to do X"* and the role name later becomes an empty template field. The author committed the file with the missing noun intact.

Second: *"The asked not to fake this..."* is a stance from outside the project. It is not the author writing about the project's design; it is a system or operator instructing an AI not to fabricate content. The author is, in this moment, being directed not to fake the FE eclipse predictor by feeding it the heliocentric ephemeris table (`astropixels`). The placeholder file exists because the operator could not produce a real flat-earth eclipse algorithm, and the AI was instructed not to fake one, and the resulting compromise was a structural entry point that does nothing.

The compromise is then advertised in the UI. The Demos panel shows a section called "FE Eclipse Predictions." A user clicking on the demo sees:

> "FE eclipse-prediction track is a structural placeholder. Shane/Fred resource pack pending; real cycle-harmonic predictor will drop in via this same entry point without disturbing the astropixels-based solar/lunar demos."

The user has been given the *appearance* of an FE eclipse predictor. There is a tab. There is a demo entry. There is a future-tense promise. There is no predictor. The demo does nothing.

The 111 working eclipse demos in the same panel — 44 solar, 67 lunar, 2021–2040 — all use the heliocentric DE405 ephemeris (Espenak's published JPL tables) to predict their eclipse times. The flat-earth model does not predict eclipses. The display promises that it does.

## Tell 2 — Self-acknowledged failures hidden behind silent fallbacks

> **AI-STACK · SELF-CON**
> File: `js/core/ephemerisGeo.js`

The "GeoC" pipeline is the only one of the five that is structurally geocentric (Earth-at-focus Kepler orbits per planet, no Sun-around-Earth stage). Its module header acknowledges:

> "inner planets (Mercury, Venus) do not librate about the Sun in this model, and no planet exhibits retrograde motion. RA/Dec values diverge from real ephemeris positions by large amounts. The trade is deliberate: this pipeline is *structurally* geocentric at every stage."

This is honest. It is also followed, in `ephemeris.js`, by a fallback chain:

> `DE405 → GeoC → VSOP87 → Ptolemy`

A user who selects GeoC and asks about Uranus, Neptune, or a date past the GeoC support window has DE405 (the heliocentric default) silently substituted. A user who selects GeoC and renders normally for the bodies and dates GeoC *does* cover sees a model that gets the planets badly wrong, and (correctly) infers that the structurally geocentric pipeline doesn't work — which is the honest answer. But for the substituted bodies and dates, the user sees DE405-quality output and (incorrectly) infers that the geocentric model is mostly working. The interface conceals the substitution.

This is the AI-content stacking move: produce a structurally honest pipeline, name it visibly, *and* configure the dispatcher to silently route around it whenever the honest answer would be embarrassing. The honest acknowledgement and the silent workaround coexist.

## Tell 3 — Volume as credibility

> **AI-STACK**

The model bundles:

- **Five ephemeris pipelines** (DE405, VSOP87, Meeus, GeoC, Ptolemy). Four of them either do not drive the rendering by default or do not produce correct output without falling back to DE405. The comparison panel exists primarily to display how badly the non-default pipelines diverge.
- **Twenty map projections** (AE, AE-Dual, Mercator, Mollweide, Robinson, Winkel Tripel, Hammer, Aitoff, Equal Earth, Eckert IV, Sinusoidal, Hellerick, Proportional AE, Orthographic, Lambert AEA, Gleason's, plus several HQ raster variants). All twenty share a single underlying coordinate framework — north-pole AE — so changing the projection in the dropdown does not change what the simulator is computing. The projection layer is decorative.
- **Eighteen UI languages** including right-to-left Arabic and Hebrew with full document-direction flipping. The translation surface includes tab labels, group titles, row labels, button labels, info-bar slots, autoplay chrome, transport tooltips, header text, status readouts, and Live-panel headers. Localisation is a substantial engineering undertaking; producing it for a sandbox sim that has unresolved core physics questions is a particular allocation of effort.
- **Catalogues**: 60+ Cel Nav stars, 11 black holes, 19 quasars, 20 galaxies, 12 satellites with two-body Kepler propagation. None of these catalogues are flat-earth; they are observational data (HYG, OpenNGC, VizieR, CelesTrak) ported in.
- **Forty-four solar eclipse demos and sixty-seven lunar eclipse demos**, 2021–2040, all sourced from Espenak's catalogues. None predicted by a flat-earth method.
- **Five-latitude analemma demos** for sun, moon, and sun+moon.
- **A dome caustic ray-tracer** in `js/render/domeCaustic.js` that treats the heavenly vault as a specular reflector and computes "ghost sun" positions from caustic peaks. The author notes:

```js
// A strict ">135° antipodal" filter produced nothing for hemispherical
// reflectors (which retro-focus to the sun side), so the picker
// here always returns the best-available candidate
```

The filter was relaxed because the math didn't produce what the demo wanted. A real optical caustic from a hemispherical specular reflector retro-focuses to the side of the source, not to the antipode, which is the opposite of what a flat-earth "ghost sun far from the real sun" demonstration would need. The code resolves this by always returning *some* candidate.

The total content surface is impressive. Almost none of it is doing flat-earth physics. It is observational data, globe-derived ephemerides, multilingual UI plumbing, and a ray-tracer whose intended outcome the math wouldn't produce. The volume produces an impression of rigor without supplying its substance.

## Tell 4 — Iteration trail visible in committed artifacts

> **AI-STACK**

The repo includes, checked into version control:

- `js/core/ephemeris.S009.backup.js` (20 745 bytes)
- `js/core/ephemeris.S010.backup.js` (19 049 bytes)
- `js/core/ephemeris.reframe.backup.js` (23 189 bytes)
- `change_log_serials.md` (402 785 bytes — a 400 KB markdown file)

The "S009"/"S010" naming pattern, the `reframe.backup` artifact, and the four-hundred-kilobyte serial change log are characteristic of long-running AI-assisted iteration. They suggest a workflow in which a working file is repeatedly rewritten by an assistant, with periodic snapshots committed as backup files because reverting a multi-turn AI edit is painful otherwise.

This is not by itself evidence of dishonesty; it is evidence of an AI-assisted authorship workflow. It is named here because it is a strong tell, and because — combined with Tells 1, 2, and 3 — it informs how the project should be read. The model is not a writer's careful expression of a coherent flat-earth physics. It is the artifact of an iterative process in which a series of plausible-looking pieces accumulated under direction, with some honest acknowledgements and some silent compromises, and shipped as a unit.

## Tell 5 — Stylistic AI tells in source comments

> **AI-STACK**

A subjective tell, included for completeness. The prose style of the comments — both source comments and the About page — has recognisable AI-assistant patterns: heavy philosophical framing, "stated honestly:" disclaimers, elaborate justifications for tuning constants, an even tone of voice throughout disparate modules, and a tendency to explain *why* a piece of code is being written in addition to *what* it does. Examples:

- *"Unit discipline. All distances are unitless. `FE_RADIUS = 1`."*
- *"Two layers, one observer."*
- *"Consequence (stated honestly): inner planets (Mercury, Venus) do not librate about the Sun in this model..."*
- *"The trade is deliberate: this pipeline is *structurally* geocentric at every stage."*
- *"I split this code out of the former monolithic `ephemeris.js` into its own module so the router can pick it as the `'geocentric'` pipeline alongside Helio and Ptolemy."*

A human author may write this way. An AI assistant invariably does. The presence of this register across hundreds of source files and across the user-facing About text, in unbroken stylistic uniformity, is consistent with a workflow in which an assistant writes the prose layer.

## What this means for the model

None of these tells refute the model on technical grounds. The technical refutation is in the previous tab. What they refute is the *implicit framing*: that this is a serious flat-earth physics project that has happened to use globe-derived data sources for inputs.

The implicit framing is the inverse of the actual situation. The project has a polished UI, a multilingual surface, a comparison-panel of pipelines, and a dome caustic ray-tracer because those are the kinds of artifacts an AI assistant is good at producing in volume. It does not have a flat-earth physics because that is the kind of artifact that requires the operator to actually have one, and when prompted to produce it (the FE Eclipse Predictor), the AI was correctly told not to fake it. The placeholder is the most honest line in the entire project — and it is the line that gives the game away.

## A note for readers evaluating other AI-stacked content

The pattern recognisable here generalises. When evaluating an interactive scientific-claim site that *looks* polished, check:

1. **Is there a tab that promises a forward-looking prediction or test, but that — when you click into it — turns out to be a placeholder, a "coming soon", or a "future serials will drop in the real logic"?** If yes, that tab is the load-bearing one and the rest is decoration.
2. **Are there multiple competing "modes" or "pipelines" that all silently fall back to one canonical implementation?** If yes, the canonical implementation is the actual model and the others are window-dressing.
3. **Are the input data, calibration constants, and observational catalogues sourced from the orthodox model the site claims to refute?** If yes, the orthodox model is doing the work and the site is rebadging the output.
4. **Does the source code carry comments addressed to or about an absent operator/role/?** *("the asked not to fake this", "the operator preferred we...")* Those leaks reveal the actual chain of authorship.
5. **Is the iteration trail (backup files, multi-hundred-K change logs, serial-numbered checkpoints) preserved in the repo?** Long iterative AI-assisted authorship leaves recognisable archaeology.

The Conceptual Flat Earth Model exhibits all five.
