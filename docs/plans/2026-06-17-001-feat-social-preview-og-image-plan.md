---
title: "feat: Social-preview (Open Graph) image for the homepage"
type: feat
status: active
date: 2026-06-17
---

# feat: Social-preview (Open Graph) image for the homepage

## Summary

Add a purpose-built 1200×630 Open Graph image so that sharing the portfolio's
root URL renders a rich postal-archive-styled card (instead of the favicon
fallback). Wire it through Next.js 16's file-based `opengraph-image` convention,
give Twitter/X a matching image, and verify the rendered tags on real scrapers.

---

## Problem Frame

When `https://bhavya-barri-portfolio.vercel.app` is shared (WhatsApp, iMessage,
LinkedIn, Slack), the preview shows the title and description correctly but no
real image — the platform falls back to `favicon.ico`, rendering as a small
black circle with a white triangle. The homepage is the URL Bhavya actually
shares in job applications and DMs, so this is the highest-visibility surface
and currently the weakest preview. Root cause: `src/app/layout.tsx` declares
`openGraph` and `twitter` metadata with title + description but **no image**,
while `twitter.card: "summary_large_image"` promises a banner that does not
exist.

---

## Requirements

- R1. Sharing the homepage URL renders a 1200×630 image preview on the major
  unfurlers (WhatsApp, iMessage, LinkedIn, Slack, X).
- R2. The image matches the site's postal-archive visual language (postcard /
  stamp / "par avion"), consistent with the Hero and About sections.
- R3. The `twitter:card` declaration is honored — a large image actually
  resolves, not a broken/empty card.
- R4. The image is served with an absolute URL and correct dimension/alt meta so
  scrapers accept it.

---

## Scope Boundaries

- Homepage / site-wide preview only. This is the URL Bhavya shares.
- No dynamic/per-page image generation (`next/og` `ImageResponse`) — the chosen
  approach is a single hand-produced static asset.
- No redesign of the existing on-page Hero/About sections.

### Deferred to Follow-Up Work

- **Project-page OG images:** `src/app/projects/[slug]/page.tsx:28` already sets
  `openGraph.images: [project.imagePath]`, but those hero images are not
  guaranteed to be 1200×630 and may crop awkwardly in unfurlers. Normalizing
  them (or moving project pages to a `next/og` template) is a separate change.

---

## Context & Research

### Relevant Code and Patterns

- `src/app/layout.tsx:10-27` — root `metadata` export. `openGraph` (L15-20) and
  `twitter` (L21-26) have title + description but **no `images`** field;
  `metadataBase` (L11) is set, so relative image URLs resolve to absolute.
- `src/app/projects/[slug]/page.tsx:17-31` — `generateMetadata` already wires
  `openGraph.images` per project (the pattern to mirror conceptually).
- `src/app/globals.css` — existing postal visual vocabulary to reuse when
  composing the card: `.stamp-edge`, `.stamp-paper`, postcard chrome, and the
  "par avion" airmail treatment. Fonts via `src/lib/fonts.ts` (Playfair,
  IBM Plex Mono, Caveat).
- `public/images/about/postcard.png` (1536×1024, 3:2) — existing illustrated
  postcard art. Reusable as source material but wrong aspect ratio for OG
  (1200×630 ≈ 1.91:1), so it should not be dropped in unmodified.
- `src/app/favicon.ico` — the current (unintended) fallback being shown.

### Institutional Learnings

- None directly applicable (`docs/solutions/` has no OG/metadata entries).

### External References

- Next.js 16 metadata file conventions live in `node_modules/next/dist/docs/`.
  Per `AGENTS.md`, confirm the exact `opengraph-image` / `twitter-image` /
  `*.alt.txt` filenames and behavior against the installed docs before wiring
  (this version is ahead of common training-data baselines).

---

## Key Technical Decisions

- **File-convention over manual `images:` array.** Use Next 16's
  `src/app/opengraph-image.<ext>` convention rather than hand-writing
  `openGraph.images` in the metadata object. Next auto-injects `og:image` plus
  `og:image:width`/`height` and the `twitter:image` tags, reducing the chance of
  a dimension/URL mismatch. Rationale: framework-native, less brittle, and the
  dimension tags are what make fussy scrapers accept the image.
- **Produce the card by rendering HTML, not by cropping `postcard.png`.**
  Recommended path: build a throwaway 1200×630 layout that reuses the existing
  postal CSS vocabulary, screenshot it (browser tooling is available in this
  environment), export the PNG, then remove the throwaway layout. This keeps the
  card on-brand and reproducible. Cropping `postcard.png` is the fallback if a
  hand-rendered card proves too costly, accepting the aspect-ratio compromise.
- **Give Twitter/X its own image file.** Add `twitter-image.png` (a copy of the
  OG image) rather than relying solely on the `og:image` fallback, so the
  `summary_large_image` card is guaranteed to resolve.

---

## Open Questions

### Resolved During Planning

- Static vs. dynamic generation: **static** (user decision, this session).
- Homepage vs. all routes: **homepage only** (user decision); project pages
  deferred.

### Deferred to Implementation

- Exact card composition (copy lines, stamp placement, light/dark treatment) —
  settled while rendering and eyeballing the screenshot, not pre-specified here.
- Whether `opengraph-image.png` alone satisfies X or a distinct
  `twitter-image.png` is needed — confirm against installed Next 16 docs during U2.

---

## Implementation Units

- U1. **Produce the 1200×630 postal-archive OG image**

**Goal:** Create a polished 1200×630 PNG that reads as a postcard/stamp card and
carries the name + tagline, legible at thumbnail size.

**Requirements:** R1, R2

**Dependencies:** None

**Files:**
- Create: `src/app/opengraph-image.png` (final asset; exact location confirmed in U2)
- Create (temporary, removed after export): a throwaway 1200×630 render surface
  (e.g., a scratch route or HTML file) reusing existing postal CSS

**Approach:**
- Compose a 1200×630 card: "par avion / the postal archive" airmail edge,
  "Bhavya Barri — Side Quests" in Playfair, the tagline "Side projects are how I
  think.", and a stamp motif drawn from `.stamp-edge`/`.stamp-paper`.
- Render at exactly 1200×630 and screenshot; confirm text stays legible when the
  preview is shrunk to a chat thumbnail (test by viewing at ~30% size).
- Keep file size reasonable (target well under ~1MB) so unfurlers fetch it fast.

**Patterns to follow:**
- Postal CSS in `src/app/globals.css` (`.stamp-edge`, `.stamp-paper`, postcard
  chrome); fonts from `src/lib/fonts.ts`; tone of the Hero section.

**Test scenarios:**
- Test expectation: none — static visual asset. Verification is by eye (U3),
  including a thumbnail-legibility check.

**Verification:**
- A 1200×630 PNG exists, on-brand, with the name and tagline readable at
  thumbnail scale.

---

- U2. **Wire the image via Next 16 file convention and reconcile metadata**

**Goal:** The homepage emits valid `og:image` and `twitter:image` tags (absolute
URL, correct dimensions, alt text) pointing at the new asset.

**Requirements:** R1, R3, R4

**Dependencies:** U1

**Files:**
- Create: `src/app/opengraph-image.png` (place per confirmed convention)
- Create: `src/app/twitter-image.png` (copy of the OG image)
- Create: `src/app/opengraph-image.alt.txt` (descriptive alt text)
- Modify: `src/app/layout.tsx` — remove any now-redundant manual image wiring;
  keep `twitter.card: "summary_large_image"`; ensure no conflicting hand-written
  `openGraph.images` shadows the file convention.

**Approach:**
- Confirm the exact file-convention filenames/behavior in
  `node_modules/next/dist/docs/` (per `AGENTS.md`) before placing files.
- Rely on `metadataBase` (`src/app/layout.tsx:11`) to produce absolute image URLs.
- Decide via the docs whether `twitter-image.png` is required or `og:image`
  fallback suffices; prefer the explicit file for reliability.

**Patterns to follow:**
- The per-project `openGraph.images` wiring in
  `src/app/projects/[slug]/page.tsx:25-29` as a conceptual reference.

**Test scenarios:**
- Happy path: production build succeeds; the rendered homepage `<head>` contains
  `og:image` with an absolute URL and `og:image:width=1200` / `height=630`.
- Happy path: `<head>` contains `twitter:card=summary_large_image` and a
  resolving `twitter:image`.
- Edge case: `og:image:alt` (or the `.alt.txt`-derived tag) is present and
  non-empty.

**Verification:**
- `npm run build` passes and the generated homepage HTML carries the image,
  dimension, and alt meta tags described above.

---

- U3. **Verify the preview on real scrapers and handle caching**

**Goal:** Confirm the unfurled preview actually renders the new card on live
infrastructure, and account for aggressive platform caching.

**Requirements:** R1, R3

**Dependencies:** U2

**Files:**
- None (verification only)

**Approach:**
- After deploy, fetch the homepage and inspect the OG/Twitter tags (curl + grep
  or an OG validator such as opengraph.xyz).
- Re-scrape on at least one real platform (e.g., LinkedIn Post Inspector) to bust
  the cache, since WhatsApp/LinkedIn cache `og:image` for long periods and will
  keep showing the old favicon until re-fetched.
- Spot-check the thumbnail rendering in an actual WhatsApp/iMessage share.

**Test scenarios:**
- Happy path: live homepage returns the new `og:image` URL and the image loads
  (HTTP 200, correct content-type).
- Edge case: document that existing shares may show the cached favicon until the
  platform re-scrapes; note the re-scrape step rather than treating it as a bug.

**Verification:**
- A real share (or validator preview) shows the 1200×630 postal card, not the
  favicon.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Platforms cache the old favicon preview, so the fix looks "not working" | U3 re-scrapes via a platform inspector to bust the cache; document the caching behavior |
| Text in the card is illegible at thumbnail size | U1 includes an explicit shrink-to-thumbnail legibility check before export |
| Next 16 file-convention naming differs from assumptions | U2 confirms exact filenames against `node_modules/next/dist/docs/` per `AGENTS.md` before wiring |
| Large PNG slows unfurl fetches | U1 targets a modest file size (well under ~1MB) |

---

## Sources & References

- Related code: `src/app/layout.tsx:10-27`, `src/app/projects/[slug]/page.tsx:17-31`, `src/app/globals.css`
- Framework docs: `node_modules/next/dist/docs/` (Next.js 16 metadata file conventions)
- Reusable art: `public/images/about/postcard.png`
