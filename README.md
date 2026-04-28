# Flat Earth Conceptual Model Review

A scientific critical review of the **Conceptual Flat Earth Model** by Alan Space Audits — a three.js-based interactive flat-earth cosmology with bundled JPL DE405 ephemeris, real airline flight tracks (QF27/28), and a "two-vault" projection scheme. Every load-bearing claim checked against the model's own source code.

- **Subject site:** [alanspaceaudits.github.io/conceptual_flat_earth_model](https://alanspaceaudits.github.io/conceptual_flat_earth_model/)
- **Subject repo:** [github.com/AlanSpaceAudits/conceptual_flat_earth_model](https://github.com/AlanSpaceAudits/conceptual_flat_earth_model)
- **This review (live):** [funwithscience.net/flat-earth-model-review/](https://funwithscience.net/flat-earth-model-review/)
- **Co-opted model:** [funwithscience.net/flat-earth-model-review/live/](https://funwithscience.net/flat-earth-model-review/live/) *(coming in subsequent build) — a hosted fork of the subject's site with our modifications: a unit-toggle that forces mph display, a banner that fires when a projection switch is cosmetic, AE-disc arc length shown next to central angle, the silent GeoC → DE405 fallback exposed, and AI-stacking annotations overlaid on the original UI.*

The subject is an interactive sandbox, not a predictor — so this is not a predictions audit. It is a critique of how the sandbox is built: where its physics comes from, where its internal commitments contradict each other, and where it misrepresents what the spherical-earth model actually predicts.

## Tabs

1. **The Model** — what the author built, charitably described; the core trick stated once.
2. **Globe Physics in a Disc Costume** — every load-bearing cheat in one place: the hard-coded north-pole AE under all the projection skins, the `MI_PER_DEG = 69.0936` constant that converts mph through Earth circumference and is then relabeled "central-angle deg/h", the great-circle SLERP that interpolates flight paths on a sphere, the spherical RA/Dec → Az/El identity used for every observer altitude, the `headroom = 0.12` constant tuned to make north/south arc reversal *appear*.
3. **AI Stacking** — the placeholder FE eclipse predictor, the GeoC pipeline that silently falls back to DE405, volume-as-credibility, the system-prompt voice leaking into source comments.
4. **Co-opted Demo** — a hosted modified fork that surfaces all of the above directly inside the author's own UI: unit toggle forcing mph display, banner when a projection switch is cosmetic, AE-disc arc length shown next to central angle, GeoC-fallback exposure, AI-stacking annotations.

---

## Build

```sh
npm install
npm run build      # compiles raw-text/*.md into docs/index.html
npm run serve      # local preview
npm test           # claim-verification monitor (see monitor/)
```

## Layout

```
raw-text/        markdown source, one file per tab
docs/            built site (GitHub Pages root)
data/            machine-readable claim ledger + verification fixtures
downloads/       PDF export + audit
monitor/         claim-checker — runs the assertions in raw-text/
build-scripts/   helpers
```

## License

CC BY-SA 4.0 for prose; MIT for build/test code.
