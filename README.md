# Flat Earth Conceptual Model Review

A scientific critical review of the **Conceptual Flat Earth Model** by Alan Space Audits — a three.js-based interactive flat-earth cosmology with bundled JPL DE405 ephemeris, real airline flight tracks (QF27/28), and a "two-vault" projection scheme. Every load-bearing claim checked against the model's own source code.

- **Subject site:** [alanspaceaudits.github.io/conceptual_flat_earth_model](https://alanspaceaudits.github.io/conceptual_flat_earth_model/)
- **Subject repo:** [github.com/AlanSpaceAudits/conceptual_flat_earth_model](https://github.com/AlanSpaceAudits/conceptual_flat_earth_model)
- **This review (live):** [funwithscience.net/flat-earth-model-review/](https://funwithscience.net/flat-earth-model-review/)
- **Live demonstrations:** [funwithscience.net/flat-earth-model-review/live/](https://funwithscience.net/flat-earth-model-review/live/) — three live demos that re-run the subject's own functions on his bundled data. Equal-arc-but-unequal-disc (ratios 2.70× and 3.30×), QF27/28 in mph, and one-geometry-under-twenty-skins.

The subject is an interactive sandbox, not a predictor — so this is not a predictions audit. It is a critique of how the sandbox is built: where its physics comes from, where its internal commitments contradict each other, and where it misrepresents what the spherical-earth model actually predicts.

## Tabs

1. **The Model** — what the author built, charitably described; the core trick stated once.
2. **Globe Physics in a Disc Costume** — every load-bearing cheat in one place: the hard-coded north-pole AE under all the projection skins, the `MI_PER_DEG = 69.0936` constant that converts mph through Earth circumference and is then relabeled "central-angle deg/h", the great-circle SLERP that interpolates flight paths on a sphere, the spherical RA/Dec → Az/El identity used for every observer altitude, the `headroom = 0.12` constant tuned to make north/south arc reversal *appear*.
3. **AI Stacking** — the placeholder FE eclipse predictor, the GeoC pipeline that silently falls back to DE405, volume-as-credibility, the system-prompt voice leaking into source comments.
4. **Co-opted Demo** — points to the live demonstrations page, which re-runs the subject's own published functions on his bundled data to show the equal-arc-unequal-disc ratio (2.70×–3.30×), QF27/28 mph values that his model has but won't display, and the same flight route through four projection skins all driven by identical lat/lon coordinates.

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
