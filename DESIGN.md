# The Postal Archive — design system

The portfolio's visual language is a personal philatelic archive. Projects are
franked stamps, case studies are postcards you open, the gift is a postcard you
keep. The thesis (from the Dia / christine røde "artifacts" thread): in a world
where full-fidelity interactive sites are cheap, **constraints are the perk**.
Designed, not over-designed. Content first. Not AI slop.

Live reference: `/style` (private, `noindex`). It renders every token and
primitive on both themes. Treat it as the source of truth alongside this file.

## Palette

Paper and ink, with **one** accent (blue) on interactive moments only. The
watercolours and illustrated project heroes are the only other saturated colour
on the site. Tokens live in `src/app/globals.css` (`:root` + `.dark`).

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--color-bg-primary` | `#FEFFFC` | `#1c1917` | page |
| `--color-bg-surface` | `#F5F5F0` | `#292524` | mats, cards |
| `--color-text-primary` | `#2C2C2C` | `#f5f3ee` | ink |
| `--color-text-secondary` | `#6B7280` | `#a8a29e` | muted ink |
| `--color-accent` | `#3B82F6` | `#60a5fa` | links, CTAs, view affordance, featured ring |
| `--color-border` | `#DEE2DE` | `#44403c` | rules, edges |
| `--color-frank` | `#A63D2F` | `#c96a59` | franking / postmark ink (not an accent) |

Stamp mats lift in dark (`--stamp-fill: #38322e`) so page-coloured perforations
still bite.

## Type (`src/lib/fonts.ts`)

| Family | Role |
|--------|------|
| Playfair Display | display, titles, the keepable quote |
| Space Grotesk | headings, buttons |
| Inter | body, long-form dispatches |
| IBM Plex Mono | catalogue metadata (`No. 04 · AI Tool`) |
| Caveat | handwriting, marginalia, the postcard |

## Textures (`globals.css`)

- `.bg-grid` / `.bg-grid-fine` — graph paper (the site signature)
- `.bg-crosshatch` — Tufte richness without colour; dividers, empty states
- `.paper-grain` — faint fibre overlay on sheets
- `.stamp-edge` — perforated postage edge (holes punch the colour behind, set `--perf-bg`)
- artifact chrome: `.photo-corner`, `.postmark`, `.loupe`, `.crop-bracket`

## Primitives (`src/components/ui/`)

- **`Stamp`** — a project as a postage stamp. Perforated edge, paper margin, a
  printed keyline frame, full-colour illustration, mono catalogue line, Playfair
  title, blue "view the dispatch". Client component; owns its interaction states (below).
- **`StampGrid`** — the album sleeve. ScrollTrigger entrance: stamps "get
  placed" with a staggered settle. Wrap a grid, mark each child `data-stamp`.
- **`Postcard`** — the keepable gift. Watercolour front + written side
  (handwritten quote, inset stamp, mono dateline, CTA slot).
- **`CatalogLabel`** — `§ 01 SELECTED WORK ----` section header.

## Interaction states (the `Stamp` contract)

| State | What the user sees |
|-------|--------------------|
| Loading | shimmer rides the mat (`.stamp-shimmer`), no blank flash |
| Loaded | illustration fades up over 500ms |
| Empty / error | "specimen pending" fallback: crosshatch mat + Playfair initial + `awaiting print`. No empty frame, no broken-image icon. |
| Hover / focus | the stamp lifts (CSS) and the title goes accent |
| Entrance | the album assembles on scroll (`StampGrid`, staggered) |

## Motion

GSAP (`gsap` + `@gsap/react` + `ScrollTrigger`), matching the `ArtShowcase`
pattern. Every motion has a **reduced-motion path**: `prefers-reduced-motion`
shows final state with no animation (guarded in `Stamp`, `StampGrid`, and the
`.stamp-shimmer` keyframe). Motion earns its place by reinforcing the postal
metaphor (placing a stamp, franking it), never decoration.

## Journey storyboard — the album

| Step | User does | Feels | Design supports |
|------|-----------|-------|-----------------|
| 1 | Lands on Selected Work | "this is a collection, not a list" | stamps assemble onto the album sleeve |
| 2 | Scans the grid | oriented in 3s | uniform stamp register, mono catalogue line, one accent |
| 3 | Hovers a stamp | playful recognition | stamp lifts, postmark cancels it |
| 4 | Opens a project | "a dispatch, not a webpage" | postcard-as-entry unfolds to long-form (A4) |
| 5 | Reaches the art / gift | wants to keep something | take-one watercolour postcard (Track B) |

## Accessibility

- Catalogue metadata is 10px mono at `text-primary/70` to clear 4.5:1; never the
  only label for an action.
- Featured ring is a 2px `accent/55` outline (visible, not faint).
- All GSAP respects `prefers-reduced-motion`.
- Decorative marks (frank, postmark) are `aria-hidden`; the whole stamp is one
  link / focus target with a visible focus ring.

## Rollout map

- **A2** — apply `Stamp` + `StampGrid` to the live `ProjectsGrid`.
- **A3** — `CatalogLabel`, crosshatch dividers across sections.
- **A4** — case studies as postcard-entry (open → long-form).
- **B** — the take-one watercolour postcard in the art section (its own states still TODO).

## Open decisions (tracked, not blocking)

- Curated `category`/`type` per project so the stamp meta reads as a series, not `tools[0]` build tags.
- Album tiering: featured = "the album", rest = "b-sides".
