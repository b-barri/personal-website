---
title: "feat: Close the HTML-vs-image fidelity gap on the About postcard"
type: feat
status: active
date: 2026-06-16
---

# feat: Close the HTML-vs-image fidelity gap on the About postcard

## Summary

The About section (`src/components/sections/About.tsx`) is a live-HTML replica of a generated vintage-postcard image. It already matches the layout, content, and stamp structure, but the remaining gap is *material*: clean monoline icons read as digital, colored stamp ink looks pasted-on rather than printed-into the paper, and the type is generic. This plan applies four researched, low-dependency techniques — ink-on-paper blend modes, letterpress SVG ink filters, vintage display fonts, and (optionally) real public-domain engraving assets — to close most of that gap without abandoning the HTML approach.

---

## Problem Frame

We ran one explicit experiment: get the HTML as close to the generated image as possible, then decide whether HTML is good enough or we revert to shipping the static image. The HTML now wins on text/SEO/mobile/editability/page-weight, but loses on the "drawn by a person, printed on real paper" quality. That quality is exactly what makes the image feel original. If we can close it cheaply, HTML clearly wins and the decision is settled. Research surfaced concrete, free, stack-compatible techniques to do it; this plan sequences them lowest-risk-highest-leverage first so we can stop as soon as it looks right.

---

## Requirements

- R1. Stamp marks (icons, frames, stamp text) read as ink printed *into* the aged paper, not pasted on top of it.
- R2. Icons read as hand-drawn / engraved line art rather than clean digital vectors.
- R3. Stamp and header typography evokes vintage letterpress / typewriter postcard lettering.
- R4. Ink shows organic density variation — letterpress bite, slight bleed, irregular edges.
- R5. All changes preserve current guarantees: selectable text, SSR-safety under Next 16 App Router (no hydration mismatch), accessibility (`aria-hidden` on decorative SVG, labels where needed), and performance (shared filters, no per-element filter explosion).
- R6. Any externally sourced asset is license-safe for a public personal portfolio (CC0 / public domain), with source + license recorded in code.

---

## Scope Boundaries

- Not redesigning the layout, copy, or stamp structure — that work is done and approved. This is a finish-pass on *texture and type* only.
- Not touching other sections (Hero, Writing, Footer, etc.). Any new font vars are additive and must not change existing sections' rendering.
- Not introducing a canvas-based or client-only rendering pipeline as the default path (see Alternatives — Rough.js).
- The career-date content correction and portrait restoration are already done; out of scope here.

### Deferred to Follow-Up Work

- Committing the already-finished `About.tsx` rebuild and the `Writing.tsx` logo stamps: separate commits, already pending the user's green light — independent of this fidelity pass.

---

## Context & Research

### Relevant Code and Patterns

- `src/components/sections/About.tsx` — the target. Already defines a single shared SVG filter `#stampRough` (feTurbulence + feDisplacementMap) referenced by `url(#stampRough)` from every `RoughFrame`, `Eng` icon, and postmark. This is exactly the shared-filter pattern the research recommends for performance; new filters follow the same approach (define once in the section's hidden `<svg>`, reference by id).
- `Eng` component + `ENG` registry in `About.tsx` — monoline icons, `stroke="currentColor"`, already pushed through `#stampRough`. The natural insertion point for additional ink filters and blend modes.
- `Stamp` / `RoughFrame` in `About.tsx` — nested-border stamp frames; candidates for the multiply blend + ink filter.
- `src/lib/fonts.ts` — all fonts declared via `next/font/google` and exported; current set: Space Grotesk, Inter, Playfair Display, IBM Plex Mono, Caveat. New vintage fonts get added here following the identical pattern (subset, weight, `variable`, `display: "swap"`).
- `src/app/layout.tsx:49` — every font `.variable` is concatenated onto `<html className>`. New fonts must be added to both the import and this className or the CSS var won't exist.
- `src/app/globals.css` `@theme inline` block (around line 33-48) — where `--font-*` vars are registered for Tailwind v4. New fonts wire in here as `--font-stamp` / `--font-letterpress`.
- `src/app/globals.css` — existing postal utilities `.stamp-edge` (perforation via `--perf-bg`), `.paper-grain`, `.photo-corner`, `.postmark`. Pattern to mirror for any new texture utility.
- `public/images/about/paper-bg.png` — the real scanned-paper background already in place; the multiply blend in U1 blends ink against this.

### Institutional Learnings

- From this session: Turbopack can serve stale CSS chunks after edits; verify visual changes with a hard reload (Cmd+Shift+R) and avoid running `npm run build` against a live dev server (it can re-poison `.next`). Use `npx tsc --noEmit` for typechecks during iteration.
- The card is intentionally paper-toned in *both* light and dark themes (a real postcard doesn't go dark), so blend-mode/contrast tuning only needs to hold against the tan paper, not against a dark variant.
- `style={{ ["--perf-bg" as string]: PAPER }}` is the established cast pattern for setting CSS custom properties inline without TypeScript complaints.

### External References

(Full digest from `ce-web-researcher`, 2026-06-16. Highest-leverage moves ranked.)

- **mix-blend-mode: multiply + isolation** — the single highest-leverage move. `multiply` makes a dark mark behave like ink (darkens over paper, vanishes over white), turning "pasted-on" into "printed-in." Requires `isolation: isolate` on the card container so ink blends against the paper, not the dark page body. [MDN mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode)
- **Ink-bleed / letterpress SVG filter** — `feMorphology dilate` → `feGaussianBlur` → `feComponentTransfer` discrete alpha threshold gives letterpress edge bite without replacing assets. [Andy Jakubowski — Ink bleed with SVG filters](https://andyjakubowski.com/tutorial/ink-bleed-effect-with-svg-filters)
- **Turbulence-driven ink density** — `feTurbulence` + `feDisplacementMap` + `feComponentTransfer` (feFuncA slope > 1) erodes ink unevenly like paper absorption. [Codrops — feTurbulence texture](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/)
- **Vintage fonts via next/font** — `Special Elite` (worn typewriter; best for POST CARD / AIR MAIL / stamp labels), `IM Fell English` (17th-c letterpress; postcard body/italic), `Cinzel` (inscription caps; passport headings). All Google Fonts, zero self-hosting. [Special Elite](https://fonts.google.com/specimen/Special+Elite) · [IM Fell English](https://fonts.google.com/specimen/IM+Fell+English)
- **CC0 vintage engraving assets** — [rawpixel public-domain etching](https://www.rawpixel.com/search/public%20domain%20etching) (CC0), [Old Book Illustrations](https://www.oldbookillustrations.com/) (filter by Wood Engraving; Science & Buildings categories), [Public Domain Vectors — vintage engraving](https://publicdomainvectors.org/en/vintage-engraving-free-vector) (SVG, unlimited commercial). Colorize a black engraving to stamp ink via CSS `filter`.
- **Pure-CSS grunge** — inline `feTurbulence` + `feColorMatrix` desaturate + `feBlend multiply` overlay gives ink-distress with zero network cost (preferred over downloaded PNG packs).
- **Caveats** — keep `numOctaves ≤ 3`; reuse one shared `<filter>` id across all icons (browser reuses the compositing layer); Rough.js/svg2roughjs are client-only (`document` access) and need `"use client"` + post-mount append to avoid hydration mismatch, and they strip semantic SVG (accessibility cost).

---

## Key Technical Decisions

- **Sequence by leverage, stop when it looks right.** U1 (blend) and U2 (ink filters) are zero-dependency and reversible; do them first and re-evaluate against the image before spending on assets (U4). The plan is explicitly "stop-early friendly."
- **Keep the existing shared-filter architecture.** New filters (`#inkbleed`, `#inkpress`) are defined once in the section's hidden `<svg>` and referenced by `url(#id)`, exactly like `#stampRough`. No per-icon filter instances.
- **Default to simulated engraving (filters on existing monoline SVG), not real raster assets.** Track A (U1-U2) keeps everything as crisp, themeable, accessible vector. Track B (U4) selectively swaps in 2-3 *hero* engravings only if A+U3 don't close the gap — bounded, not wholesale.
- **Reject Rough.js as the default path** (see Alternatives). It buys sketchiness at the cost of client-only rendering, hydration complexity, bundle weight, and lost SVG semantics — disproportionate for icon-sized art.
- **Fonts are additive.** New `--font-stamp` / `--font-letterpress` vars are registered alongside existing ones; existing sections keep their current fonts. Applied in About only.
- **Tune blend opacity per layer, verify legibility.** `multiply` darkens colored ink against tan paper and can shift hue; stamp ink colors (green/red/blue/purple/brown) must stay legible. Treat this as the primary risk to validate visually.

---

## Open Questions

### Resolved During Planning

- *Which technique closes the most gap fastest?* → `mix-blend-mode: multiply` + `isolation` (research-ranked #1), so it's U1.
- *Canvas lib or SVG filters for the hand-drawn look?* → SVG filters; canvas/Rough.js deferred to Alternatives for SSR/accessibility reasons.
- *Where do new fonts wire in?* → `src/lib/fonts.ts` (declare) + `src/app/layout.tsx:49` (className) + `globals.css @theme` (register var).

### Deferred to Implementation

- Exact filter parameters (`stdDeviation`, `feFuncA` slope, `feMorphology` radius, displacement `scale`) — these are dial-by-eye against the live render; the recipes give starting values, final numbers come from visual iteration.
- Whether U4 (real engraving assets) and U5 (grunge overlay) are needed at all — decided only after U1-U3 are evaluated against the image.
- Which 2-3 icons (if any) become hero engravings in U4 — pick the highest-visibility, worst-looking monoline ones after U1-U2.

---

## Implementation Units

- U1. **Ink-on-paper blend pass**

**Goal:** Make stamp ink (icons, frames, stamp text) read as printed *into* the paper via `mix-blend-mode: multiply`, the single highest-leverage change. Zero new dependencies.

**Requirements:** R1, R5

**Dependencies:** None

**Files:**
- Modify: `src/components/sections/About.tsx`

**Approach:**
- Add `isolation: isolate` to the postcard `<article>` (or its inner padded `<div>`) so blending is contained to the paper card and never blends against the dark page body.
- Apply `mix-blend-mode: multiply` + a tuned `opacity` (~0.82-0.9) to the ink layers: `RoughFrame` borders, `Eng` icons, and the stamp label text. Start by applying at the `Stamp`/`RoughFrame`/`Eng` component level so it's centralized, not sprinkled per-call.
- Verify each stamp ink color (green/red/blue/purple/brown/navy) stays legible against tan paper after multiply; adjust per-color opacity only if a color muddies.

**Patterns to follow:**
- Existing inline-style + CSS-var-cast pattern in `About.tsx` (`style={{ ["--x" as string]: v }}`).
- Keep decorative spans `aria-hidden` as they already are.

**Test scenarios:**
- Test expectation: none -- pure visual styling, no behavioral change.

**Verification:**
- Stamps visually read as printed-on-paper (ink darkens over paper grain, picks up texture) on hard reload.
- No ink blends against the dark page background (isolation works) — check the card edges.
- All six ink colors remain distinguishable and legible; small stamp text still readable.
- `npx tsc --noEmit` clean; no new console warnings.

---

- U2. **Letterpress ink filters (`#inkbleed`, `#inkpress`)**

**Goal:** Give icons, frames, and stamp text organic edge bite and density variation so ink looks letterpress-printed, not vector-crisp.

**Requirements:** R2, R4, R5

**Dependencies:** U1 (evaluate combined effect)

**Files:**
- Modify: `src/components/sections/About.tsx`

**Approach:**
- Add two shared filters to the section's existing hidden `<svg>` defs (next to `#stampRough`):
  - `#inkbleed`: `feMorphology operator="dilate"` (radius ~0.6-0.9) → `feGaussianBlur` (stdDeviation ~0.8-1.2) → `feComponentTransfer`/`feFuncA type="discrete"` threshold — letterpress bite.
  - `#inkpress`: `feTurbulence fractalNoise` (baseFrequency ~0.6, numOctaves 3) → `feDisplacementMap` (scale ~2-3) → `feComponentTransfer`/`feFuncA type="linear" slope>1` — uneven absorption.
- Apply via `filter:` on icons/frames. Filters can chain with the existing transform; keep `numOctaves ≤ 3`.
- Be conservative on *small stamp text* — heavy bleed harms legibility. Prefer ink filters on icons/frames and the large display words (POST CARD, WHAT ACTUALLY ENDURES), keeping fine print crisp or lightly filtered.

**Patterns to follow:**
- The existing `#stampRough` filter definition and `url(#...)` referencing in `About.tsx` — same shared-filter approach.

**Test scenarios:**
- Test expectation: none -- pure visual styling.

**Verification:**
- Icon/frame edges show irregular, ink-like density (not uniform stroke) on hard reload.
- Small stamp text remains legible; no "smeared" unreadable labels.
- Only the new shared filter ids are added; no per-element filter instances. Render stays smooth on scroll (no jank).
- `npx tsc --noEmit` clean.

---

- U3. **Vintage display fonts**

**Goal:** Replace generic stamp/header lettering with letterpress/typewriter type so even simple marks read as "vintage postcard."

**Requirements:** R3, R5

**Dependencies:** None (parallelizable with U1/U2)

**Files:**
- Modify: `src/lib/fonts.ts` (declare `Special_Elite`, `IM_Fell_English` via `next/font/google`)
- Modify: `src/app/layout.tsx` (add new `.variable`s to the `<html>` className)
- Modify: `src/app/globals.css` (register `--font-stamp`, `--font-letterpress` in the `@theme inline` block)
- Modify: `src/components/sections/About.tsx` (apply to POST CARD heading, AIR MAIL box, stamp labels; consider IM Fell italic for handwritten-adjacent body)

**Approach:**
- Declare `Special Elite` (weight 400) as `--font-stamp` and `IM Fell English` (400, normal + italic) as `--font-letterpress`, mirroring the exact `next/font` export pattern already in `fonts.ts` (`subsets`, `weight`, `variable`, `display: "swap"`).
- Wire both `.variable`s into `layout.tsx:49` and register the CSS vars in the `@theme inline` block so Tailwind v4 sees them.
- In About only: use `--font-stamp` for stamp authority labels and the AIR MAIL/POST CARD chrome; evaluate `--font-letterpress` italic for the thesis line. Keep Caveat for the true handwritten margin notes.
- Confirm no other section regresses (fonts are additive; nothing existing is reassigned).

**Patterns to follow:**
- `src/lib/fonts.ts` existing exports (e.g., `ibmPlexMono`, `caveat`) — copy the shape exactly.
- `globals.css @theme inline` existing `--font-*` registrations.

**Test scenarios:**
- Test expectation: none -- styling/config; verify via render + build.

**Verification:**
- POST CARD / AIR MAIL / stamp labels render in the new vintage faces on hard reload; no FOUT beyond the normal `swap`.
- No layout shift or overflow in stamps from the new metrics; tighten sizes if a label wraps.
- Other sections (Hero, Writing, Footer) render unchanged.
- `npm run build` succeeds (next/font fetches at build); `npx tsc --noEmit` clean.

---

- U4. **(Optional) Hero engraving assets** — *only if U1-U3 don't close the gap*

**Goal:** Swap the 2-3 highest-visibility, worst-looking monoline icons for real CC0 vintage engravings, colorized to stamp ink.

**Requirements:** R2, R6

**Dependencies:** U1, U2, U3 (decide need only after evaluating them)

**Files:**
- Create: `public/images/about/engravings/*.svg` or `*.png` (sourced assets)
- Modify: `src/components/sections/About.tsx` (render chosen hero icons as `<img>`/inline SVG, colorized)

**Approach:**
- Pick 2-3 hero icons after U1-U2 (likely the most detailed: e.g., the routing robot row, the teapot, the capitol). Source matching engravings from rawpixel CC0 etching search or Old Book Illustrations (Science/Buildings).
- Colorize a black engraving to the stamp's ink color via CSS `filter` (or recolor the SVG fill), and run it through the same `multiply` + ink-filter treatment so it sits in the same ink layer.
- Record source URL + license (CC0 / public domain) in a code comment next to each asset and/or a short `public/images/about/engravings/CREDITS.md`.

**Patterns to follow:**
- Existing `next/image`/`<img>` usage in About (the portrait stamp) for raster; existing `Eng` treatment for blend/filter parity.

**Test scenarios:**
- Test expectation: none -- visual asset swap. (If a reusable colorize helper is introduced, add a render check that it applies the ink color.)

**Verification:**
- Hero engravings visually match the image's hand-drawn richness and sit in the same ink layer (blend/filter parity with surrounding marks).
- Each asset has a recorded CC0/public-domain source + license (R6).
- `aria-hidden` on decorative engravings; alt text only where an icon conveys meaning.
- Page weight increase is modest (engravings are small; prefer SVG or optimized PNG).

---

- U5. **(Optional) Pure-CSS grunge/distress overlay** — *only if still needed after U1-U4*

**Goal:** Add a final ink-distress pass to stamp text/edges with zero network cost.

**Requirements:** R4, R5

**Dependencies:** U1, U2

**Files:**
- Modify: `src/components/sections/About.tsx` (and/or `src/app/globals.css` for a reusable distress utility)

**Approach:**
- Use an inline `feTurbulence` + `feColorMatrix` (desaturate) + `feBlend multiply` overlay masked to the ink, rather than a downloaded PNG pack (license-safe, no asset).
- Apply sparingly; over-distress harms small-text legibility.

**Patterns to follow:**
- `.paper-grain` in `globals.css` (existing turbulence-style overlay utility) as the structural model.

**Test scenarios:**
- Test expectation: none -- pure visual styling.

**Verification:**
- Adds visible ink-distress without making any label unreadable.
- No measurable network cost (no new asset request).
- `npx tsc --noEmit` clean; render stays smooth.

---

## System-Wide Impact

- **Interaction graph:** Changes are confined to `About.tsx` plus additive font wiring in `fonts.ts` / `layout.tsx` / `globals.css`. The font vars are global but additive — no existing var is reassigned.
- **State lifecycle / SSR:** All techniques are pure CSS/SVG (server-renderable). No client-only rendering is introduced, so there is no hydration-mismatch surface (the explicit reason Rough.js is rejected).
- **API surface parity:** None — no shared components change signatures. `Stamp`/`RoughFrame`/`Eng` stay internal to About.
- **Unchanged invariants:** Layout, copy, stamp structure, career dates, and the restored portrait are all unchanged. Other sections' typography is unchanged. Text stays selectable; decorative SVG stays `aria-hidden`.
- **Performance:** New filters follow the shared-`url(#id)` pattern (one compositing layer reused), `numOctaves ≤ 3`. `mix-blend-mode` adds compositing cost on the card only. next/font self-hosts the two new faces at build (no runtime request, minimal bundle add).

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `multiply` darkens/desaturates colored stamp ink against tan paper, hurting legibility or shifting hue | Tune per-layer `opacity`; verify all six ink colors stay legible (U1 verification gate before proceeding) |
| Heavy ink filters smear small stamp text into unreadability | Apply bleed/turbulence to icons, frames, and large display words; keep fine print crisp or lightly filtered (U2 approach note) |
| Many `url(#filter)` references cause repaint/jank | Reuse 2-3 shared filter ids only; `numOctaves ≤ 3`; check scroll smoothness |
| New fonts cause layout shift / label wrap in tight stamps | Verify against live render; tighten font-size/tracking per stamp; `display: "swap"` already set |
| Sourced engraving asset has unclear license | Restrict to CC0 / public-domain sources only; record source + license per asset (R6); skip U4 entirely if unsure |
| Turbopack serves stale CSS after edits | Hard reload (Cmd+Shift+R); don't run `npm run build` against the live dev server |

---

## Alternative Approaches Considered

- **Rough.js / svg2roughjs (sketchy-render the icons).** Genuinely produces hand-drawn line art and `svg2roughjs` could re-render existing icons without rewriting paths. Rejected as the default: both are client-only (`document` access), forcing `"use client"` + post-mount append to avoid hydration mismatch on this currently-server-rendered section; they add ~9-120 kB; and Rough output strips semantic SVG (accessibility regression needing `role`/`aria` patching). Disproportionate for icon-sized art when SVG filters + blend modes get most of the way. Reconsider only if U1-U4 visibly fall short.
- **Ship the static image instead of HTML.** The fallback if this plan fails. Costs: ~2.9 MB PNG, no selectable text (SEO/ATS blind spot on a job-search site), no mobile reflow, frozen content. This plan exists to make HTML decisively win so we don't take those costs.
- **Downloaded grunge PNG texture packs.** Workable but adds network weight and per-pack license checks. Preferred the pure-CSS turbulence overlay (U5) instead — license-safe, zero request.

---

## Sources & References

- Research digest: `ce-web-researcher`, 2026-06-16 (in-session) — ranked techniques, asset sources, font list, SSR/perf caveats.
- Target component: `src/components/sections/About.tsx`
- Font wiring: `src/lib/fonts.ts`, `src/app/layout.tsx`, `src/app/globals.css` (`@theme inline`)
- Background asset: `public/images/about/paper-bg.png`
- Key external links: [MDN mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode) · [Ink bleed SVG filters](https://andyjakubowski.com/tutorial/ink-bleed-effect-with-svg-filters) · [Codrops feTurbulence](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) · [Special Elite](https://fonts.google.com/specimen/Special+Elite) · [IM Fell English](https://fonts.google.com/specimen/IM+Fell+English) · [rawpixel CC0 etchings](https://www.rawpixel.com/search/public%20domain%20etching) · [Old Book Illustrations](https://www.oldbookillustrations.com/)
