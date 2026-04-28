# CLAUDE.md — Flat Earth Conceptual Model Review

Per-project memory for future AI sessions on this repo. Read before acting.

## Project

Critical review of [Alan Space Audits' Conceptual Flat Earth Model](https://github.com/AlanSpaceAudits/conceptual_flat_earth_model) — a three.js-rendered FE sandbox that uses globe physics with the labels filed off. Sibling project to the [Dome Model Review](https://github.com/funwithscience-org/dome-model-review).

## Hosting

- **Live URL:** `https://funwithscience.net/flat-earth-model-review/` (canonical)
- **Repo:** `https://github.com/funwithscience-org/flat-earth-model-review`
- **Pages source:** `main` branch, `/docs` folder
- **CNAME:** `funwithscience.net` (org-wide custom domain; project lives as a subpath)
- **Sitemap canonical** uses `funwithscience.net` URLs, not `*.github.io`.

## Layout

```
README.md
package.json            # build/serve/test wrappers
build.js                # raw-text/*.md → docs/sections/*.md + stamp
.gitignore
CLAUDE.md               # this file
SESSION-CONTEXT.md      # cross-session continuity log
raw-text/               # editable markdown source, one file per tab
  00-overview.md           ("The Model" tab)
  01-globe-physics-in-disc-costume.md
  02-ai-stacking.md
  03-co-opted-demo.md      (placeholder until live fork lands)
docs/                   # GitHub Pages root
  index.html               # SPA chrome — fetches sections/*.md via marked.js
  sections/                # built copy of raw-text — DO NOT edit directly
  CNAME
  live/                    # (planned) hosted modified fork of subject's three.js scene
data/                   # machine-readable claim ledger (planned)
downloads/              # PDF export + audit (planned)
monitor/                # claim-checker (planned — mirror dome-model-review/monitor)
build-scripts/          # helpers (empty until needed)
```

## Build / publish workflow

```sh
npm run build      # copy raw-text → docs/sections, stamp index.html
npm run serve      # local preview at :3000
npm test           # planned — claim-verification monitor
```

The Pages deployment uses the `main`/`docs` source. `npm run build` must be run before commit when raw-text changes — there is currently no CI build step (the GitHub Action just publishes the docs/ folder as-is).

**Critical:** when editing tab content, edit `raw-text/*.md` and run `npm run build`. Never edit `docs/sections/*.md` directly — they are build artifacts.

## Tab structure

Four tabs, sticky horizontal nav at top:

1. **The Model** (`raw-text/00-overview.md`) — what the author built, charitably; the core trick stated once.
2. **Globe Physics in a Disc Costume** (`raw-text/01-globe-physics-in-disc-costume.md`) — every load-bearing cheat in one tab. Nine numbered findings with verbatim source quotes.
3. **AI Stacking** (`raw-text/02-ai-stacking.md`) — the meta layer. Five tells + the system-prompt voice leak.
4. **Co-opted Demo** (`raw-text/03-co-opted-demo.md`) — placeholder for the live fork (planned).

## Verdict tag system

Markdown blockquotes whose first paragraph is purely `**TAG**` (or `**TAG · TAG2**`) get rewritten by the runtime tagify pass into colored chips. Allowed tags:

- `STD MODEL` (green) — globe physics, relabeled
- `SELF-CON` (blue) — internal self-contradiction
- `MISLEADING` (orange) — misrepresents the globe model
- `AI-STACK` (purple) — AI-content-stacking pattern
- `STEELMAN` (grey) — most charitable framing acknowledged

Pattern in source markdown:

```markdown
> **STD MODEL · MISLEADING**
> File: `js/demos/flightRoutes.js`, line 46

[regular prose follows]
```

Multi-tag chips work; separate with `·`.

## Critical rules for editing

- **Quote source verbatim.** Every finding cites a file path and ideally line numbers. Use ``` blocks. If you paraphrase code, you weaken the review.
- **Update SESSION-CONTEXT.md** at the end of any meaningful work session — what you changed, what you concluded, what the next session should pick up.
- **Run `npm run build` before commit** if raw-text changed.
- **Don't move the canonical URL.** Sitemap, CNAME, and meta tags all use `funwithscience.net`.
- **Don't strip the missing-noun grammar artifact** in the AI-Stacking tab quote *"the asked not to fake this"* — that artifact is the evidence.

## Subject site

- Live: `https://alanspaceaudits.github.io/conceptual_flat_earth_model/`
- Source: `https://github.com/AlanSpaceAudits/conceptual_flat_earth_model`
- The subject is GitHub-Pages-served from the same `main`/`docs` pattern. We can clone freshly any time.
- Subject's About page is at `about.md` — useful primary source for stated claims.

## Co-opted live demo (planned)

Under `docs/live/`. Will be a fork of the subject's three.js scene + an additive overlay layer:

1. Unit toggle (mph display) — multiplies through `MI_PER_DEG = 69.0936`.
2. Projection skin banner — fires when user picks anything other than `ae`.
3. AE-disc arc length display alongside central-angle readouts.
4. Sun altitude source comparison panel.
5. Ephemeris fallback trace HUD.
6. AI-stacking annotation toggle.
7. Counter-About panel.

Implementation is additive — we hook into the subject's centralised `setState` pattern. No fork of his source files is required; the overlay layer reads them in published form. See `raw-text/03-co-opted-demo.md` for the full design.

## Style guide

- Voice: prose-heavy, formal-academic, dry but pointed. Restrained sarcasm. "Credit where due" steelmanning before any teardown.
- Em dashes are fine. Bullet lists are sparing. Tables for comparison.
- Inline code with backticks. Block code with fenced ``` blocks. Quote source verbatim — preserve original whitespace and comments.
- Don't use bold for emphasis as a default; reserve it for the verdict-tag pattern.
- Match the dome-model-review tone, not the kells-analysis tone (this is a code review, not a measurement audit).
