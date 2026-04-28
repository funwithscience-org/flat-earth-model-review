# SESSION-CONTEXT.md

Cross-session continuity log. Newest entry on top. Each entry: date, what was done, what's next.

---

## 2026-04-28 — v1.1 (live demonstrations page)

**What landed:**

- New `docs/live/` page with three working demonstrations:
  1. **Equal Arc, Unequal Disc** — picker between two pairs (JNB↔Sydney mirror, SCL↔Sydney vs JFK↔"Persian Gulf"), renders both arcs on his AE projection and computes the disc-cartesian length ratio. Verified: JNB-mirror = 2.700×, SCL-Sydney vs JFK-Persian = 3.295×.
  2. **QF27/QF28 in mph** — reads the four bundled flight summaries, displays `deg/h` alongside `mph` for both Air Speed and Ground Speed, exposes the `MI_PER_DEG = 69.0936` conversion.
  3. **One Geometry, Twenty Skins** — same SCL↔Sydney route through four projection skins (AE, Mercator, AE-Dual, Lambert AEA polar). Demonstrates that all projections receive identical lat/lon from the same `greatCircleArc()` call — only the skin varies.

- New files:
  - `docs/live/index.html` — page chrome, three sections + "Coming next" planned demos.
  - `docs/live/demos.js` — mounts each demo. Pure ES module; uses `<script type="module">`.
  - `docs/live/projection.js` — re-implementations of the subject's own `aeProject`, `equirect`, `mercator`, `aeDual`, `laeaPolar`, `greatCircleArc`, `centralAngleDeg`, plus `discArcLength` helper.
  - `docs/live/data.js` — extracted QF27/28 summary stats, his city list (with `real: true/false` flag for synthetic anchors), the constants `MI_PER_DEG` and `SUBJECT_URL`, the pinned upstream commit hash.

- Updated tabs:
  - `01-globe-physics-in-disc-costume.md` Finding 7 — replaced the "roughly 2×" prose estimate with the verified live numbers (2.70× / 3.30×) and pointed at the live page.
  - `03-co-opted-demo.md` — replaced the "in development" placeholder with a description of the v1 live page, including a "why this approach" note explaining why a true overlay-on-his-iframe approach was abandoned (cross-origin restrictions on his Pages domain + no LICENSE file in his repo).
  - `README.md` — updated the "Co-opted model" link description and the tab 4 description.

**Approach decisions taken (record for future sessions):**

- Cross-origin restrictions made it impossible for our hosted page to read the URL hash of an iframe pointing at his sim. So we abandoned the "iframe + analysis sidebar" plan and went to "re-execute his published functions in our own page."
- His repo has no LICENSE file. Copying his JS sources verbatim into our repo is a licensing question without an obvious answer. The current page imports nothing of his — every formula in `projection.js` is an independent re-implementation of his algorithms (with his variable names preserved for clarity), and the data in `data.js` is hand-extracted summary statistics. Verbatim quotation of his code only happens in `<pre>` blocks for review purposes (fair use).
- All numbers on the live page are computed live; no hardcoded ratios or speeds. The disc-arc lengths recompute every render. If we change the projection function or the city coordinates, the page reflects it.

**Verified locally** with `python3 -m http.server`: all routes return 200, all three modules parse, the demo math matches an independent node-side computation.

**Remaining (next session):**

1. The three "Coming next" demos called out at the bottom of `live/index.html`: sun altitude interpolated vs spherical, GeoC-fallback exposure, annotated source viewer.
2. The `monitor/` claim-checker matching the dome-model-review pattern.
3. `data/` machine-readable claim ledger.
4. PDF export.

---

## 2026-04-28 — v1 (initial publish)

**Built by:** Claude (Cowork session) + steve.

**What landed:**

- Repo scaffold: `README.md`, `package.json`, `build.js`, `.gitignore`, `CLAUDE.md`, this file.
- Four tabs of source markdown in `raw-text/`:
  - `00-overview.md` — "The Model" tab. Charitable description; states the core trick once (globe physics in disc costume).
  - `01-globe-physics-in-disc-costume.md` — nine numbered findings with verbatim source quotes:
    1. `MI_PER_DEG = 69.0936` is the Earth's radius in disguise
    2. Flight paths are great-circle SLERP on the unit sphere
    3. `centralAngleDeg` is the spherical law of cosines
    4. Observer altitude uses the spherical RA/Dec → Az/El identity
    5. The sun's altitude is hand-tuned (`headroom = 0.12`) to match globe observation
    6. All twenty map projections share one underlying coordinate frame (north-pole AE)
    7. The QF27/QF28 demo's "ground speed" is mph in disguise
    8. The "Equal Arc" demo proves a sphere theorem and frames it as flat-earth evidence
    9. The "GeoC" pipeline doesn't work; the model silently uses the heliocentric one
  - `02-ai-stacking.md` — five tells:
    1. The system-prompt voice leaking into source comments (*"the asked not to fake this"*)
    2. Self-acknowledged failures hidden behind silent fallbacks
    3. Volume as credibility
    4. Iteration trail visible in committed artifacts (S009/S010 backups, 402 KB serial change log)
    5. Stylistic AI tells in source comments
  - `03-co-opted-demo.md` — design for the live fork; placeholder until the build lands.
- `docs/index.html` — single-page site with sticky horizontal tab nav, light/dark mode, color-coded verdict tag chips, Source Serif 4 / Inter / JetBrains Mono. Loads `sections/<file>.md` at runtime via marked.js. Patterned after the dome-model-review.
- `docs/CNAME` set to `funwithscience.net`.
- `build.js` copies `raw-text/*.md` into `docs/sections/*.md` and stamps the date/version into `index.html`.

**Verified locally** with `python3 -m http.server`: all routes return 200, all four section markdown files load, the index loads.

**Repo created:** GitHub repo `funwithscience-org/flat-earth-model-review`, Pages source = `main`/`docs`, custom domain inherits from org config.

**Next session should:**

1. **Build the live co-opted demo** (`docs/live/`). This is the major piece of work outstanding. Plan in `raw-text/03-co-opted-demo.md`. Approach: clone the subject's repo into `live/`, add an `overlays.js` ES module imported after `js/main.js`, hook into the subject's centralised `setState` pattern.
2. **Add the `monitor/` claim-checker** matching the dome-model-review pattern. Each verbatim source quote in `01-globe-physics-in-disc-costume.md` should be runtime-verified against the upstream subject repo, so if the subject changes the quoted code, the monitor flags it.
3. **Add a `data/` claim ledger.** Each numbered finding should have a JSON entry with `{ tab, finding_id, file, line_range, verbatim_quote, last_verified_commit }`.
4. **PDF export** to `downloads/`, generated from the markdown source.
5. **Optional: review-iteration personas.** The dome-model-review uses "data freak", "curmudgeon", "fair auditor" personas to do independent passes. Worth applying a couple of them here, especially the curmudgeon for the AI-Stacking tab's tells (which are the softest claims).

**Open questions:**

- Is the "missing noun" grammar in `feEclipseTrack.js` (*"The asked not to fake this"*) reproducible across the subject's git history, or was it edited at some point? Worth checking blame on that file.
- The `change_log_serials.md` is 402 KB. Reading it is not urgent for v1 but might surface additional AI-tooling tells. Defer to next session.
- The `domeCaustic.js` "ghost sun" rendering deserves its own deep dive — currently mentioned in passing in the AI-Stacking tab. If a Finding-10 emerges from that, it'd live in `01-globe-physics-in-disc-costume.md` as a new section.

**Subject upstream pinned at:** `8b0921aa1ed236802c378ca3baaab11fed79f666` (AlanSpaceAudits/conceptual_flat_earth_model, fetched 2026-04-28). All verbatim quotes in v1 are from this commit. Future sessions should compare diffs against this hash before re-verifying claims.
