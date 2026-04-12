---
title: "feat: Add digital art showcase with GSAP card-stack animation"
type: feat
status: completed
date: 2026-04-12
origin: docs/brainstorms/2026-04-12-art-showcase-brainstorm.md
---

# feat: Add Digital Art Showcase with GSAP Card-Stack Animation

## Overview

Add a new homepage section showcasing Bhavya's digital illustrations as a GSAP-powered stacked card deck. Cards auto-cycle on a 4-second timer and can be manually advanced via click/tap or keyboard. The section slots between Writing and Resume, following the site's existing numbered-section pattern.

## Problem Statement / Motivation

The portfolio currently highlights projects and writing but has no space for visual/creative work. Digital illustrations deserve a dedicated, visually engaging showcase — not just a flat image grid. The GSAP card-stack interaction (see [reference demo](https://demos.gsap.com/demo/card-stack/)) creates a tactile, playful feel that matches the "Side Quests" brand.

## Proposed Solution

A `"use client"` React component (`ArtShowcase`) rendered as section `04` on the homepage. It uses GSAP core + Flip plugin for card-stack animations, with `@gsap/react`'s `useGSAP` hook for lifecycle management. Data lives in `src/data/artworks.ts`, images in `public/images/artworks/`.

Key behaviors (see brainstorm: `docs/brainstorms/2026-04-12-art-showcase-brainstorm.md`):
- **Auto-play** at ~4s intervals, pauses on hover/focus/interaction, resumes after 6s idle
- **Manual advance** via click, tap, arrow keys, or swipe
- **Backward navigation** via left arrow / swipe-right (addresses SpecFlow gap)
- **Infinite loop** — seamlessly wraps from last card to first
- **Image-only cards** — no text overlays, natural/mixed aspect ratios
- **Compact counter** ("3 / 15") as progress indicator — dots are too cluttered for 10-20 items
- **Reduced motion** — disables auto-play and animation; shows manual-only with instant transitions

## Technical Considerations

### Architecture

This introduces GSAP as a second animation library alongside Framer Motion. GSAP is scoped exclusively to this section — the rest of the site stays on Framer Motion. This is acceptable because GSAP's Flip plugin is purpose-built for layout transitions that Framer Motion doesn't handle as cleanly.

**New dependencies:**
- `gsap` (~30KB gzipped) — core + Flip plugin (Flip is bundled, not a separate package)
- `@gsap/react` (~2KB) — provides `useGSAP` hook with auto-cleanup

**License:** GSAP's "no charge" license covers personal portfolio sites. No paid license needed.

### Component State Machine

```
LOADING → IDLE → AUTO_PLAYING ⇄ PAUSED_HOVER
                      ↕               ↕
               PAUSED_INTERACTION ← PAUSED_FOCUS
```

| State | Entry Condition | Exit Condition |
|---|---|---|
| LOADING | Mount, images not ready | First 2 images loaded → IDLE |
| IDLE | Section off-screen | IntersectionObserver (50%) enters viewport → AUTO_PLAYING |
| AUTO_PLAYING | Viewport visible, no interaction | Hover → PAUSED_HOVER; Click/key → PAUSED_INTERACTION; Scroll out → IDLE |
| PAUSED_HOVER | Mouse enters card area | Mouse leaves → AUTO_PLAYING (reset timer) |
| PAUSED_INTERACTION | Click/tap/key advance | 6s idle → AUTO_PLAYING |
| PAUSED_FOCUS | Keyboard focus on component | Blur → AUTO_PLAYING (reset timer) |

Under `prefers-reduced-motion`: skip LOADING/IDLE/AUTO_PLAYING — render static with manual-only navigation (instant transitions, no animation).

### Image Loading Strategy

- Use `next/image` for all artwork cards
- Card 1: `priority={true}` (eager load, no lazy)
- Cards 2-3: `loading="eager"` (preload next couple)
- Cards 4+: `loading="lazy"` (load on demand)
- Format: WebP preferred (matches existing `/images/projects/*.webp` convention)
- Placeholder: `blurDataURL` generated at build time or a CSS shimmer skeleton
- Container: fixed `max-width` (e.g., `max-w-lg` / 32rem) and `max-height` (e.g., 28rem) with `object-fit: contain` so mixed aspect ratios don't cause layout shift
- Error: skip failed images silently (filter from deck)

### Accessibility (WAI-ARIA Carousel Pattern)

- `role="region"` + `aria-roledescription="carousel"` + `aria-label="Digital art showcase"` on the section container
- Each card: `role="group"` + `aria-roledescription="slide"` + `aria-label` with descriptive alt text
- `aria-live="polite"` region announcing "Showing artwork 3 of 15" on card change
- Keyboard: `ArrowRight` / `ArrowLeft` to advance/go back, `Space`/`Enter` to pause/resume
- Focus-based pause: auto-play pauses when component receives keyboard focus
- Alt text: stored in `artworks.ts` data — even though cards are image-only visually, each `Artwork` has an `alt` field

### Performance

- IntersectionObserver: start/stop GSAP timer when section enters/leaves viewport (50% threshold)
- GSAP animations use only `transform` + `opacity` (GPU-composited, no layout thrash)
- `Flip.from()` with `absolute: true` to prevent reflow during transitions
- DOM: render all cards but only decode visible + adjacent images (browser handles via lazy loading)
- Cleanup: `useGSAP` auto-reverts all animations on unmount — prevents memory leaks on route navigation
- Rapid clicking: ignore clicks while animation is in-progress (check `tween.isActive()`)

### Mobile Touch

- Swipe left = advance, swipe right = go back
- Minimum swipe threshold: ~50px horizontal, with <30px vertical drift (to avoid conflicting with page scroll)
- Sub-threshold swipe: card snaps back to original position
- Tap (no drag) = advance to next card
- Pointer events API (not touch events) for unified mouse/touch handling

### Edge Cases

| Case | Behavior |
|---|---|
| Single image | Hide progress indicator, disable auto-play and navigation |
| Two images | Normal behavior, loops between two |
| Rapid clicking | Debounce — ignore while animation active |
| Browser resize | Recalculate container on `resize` event (debounced) |
| Theme switch mid-animation | Card shadows/borders use CSS custom properties — transition smoothly via CSS |
| JS disabled / GSAP fails to load | Cards render as a static image (first artwork only, `<noscript>` friendly) |

## Implementation Phases

### Phase 1: Data & Static Foundation

**Tasks:**
- [x] Install `gsap` and `@gsap/react` — `npm install gsap @gsap/react`
- [x] Create `src/data/artworks.ts` with `Artwork` interface and placeholder data

```ts
// src/data/artworks.ts
export interface Artwork {
  id: string;
  imagePath: string;
  alt: string;        // accessibility — descriptive alt text
  width: number;      // natural width for next/image
  height: number;     // natural height for next/image
}

export const artworks: Artwork[] = [
  { id: "piece-1", imagePath: "/images/artworks/piece-1.webp", alt: "...", width: 800, height: 1000 },
  // ... 10-20 entries
];
```

- [x] Create `public/images/artworks/` directory with placeholder images for development
- [x] Verify build passes

**Success criteria:** Data file compiles, images resolve, no build errors.

### Phase 2: Section Shell & Layout

**Tasks:**
- [x] Create `src/components/sections/ArtShowcase.tsx` as a `"use client"` component
- [x] Follow existing section pattern: outer `<section>`, inner `max-w-6xl px-6`, `ScrollReveal` wrapper, `SectionLabel`
- [x] Use `<SectionLabel number="04" label="Art" />`
- [x] Add the component to `src/app/page.tsx` between `<Writing />` and `<Resume />`
- [x] Bump Resume's section number from `04` to `05` in its `SectionLabel`
- [x] Render a static first-card image (no animation yet) to verify layout and positioning
- [x] Style the card container: `max-w-lg mx-auto`, fixed max-height, `rounded-2xl overflow-hidden`, theme-aware shadow

**Files modified:**
- `src/components/sections/ArtShowcase.tsx` (new)
- `src/app/page.tsx` (add import + render)
- `src/components/sections/Resume.tsx` (bump section number)

**Success criteria:** New section visible on homepage in correct position, static image renders correctly in both themes.

### Phase 3: GSAP Card-Stack Animation

**Tasks:**
- [x] Register GSAP plugins at module scope: `gsap.registerPlugin(Flip, useGSAP)`
- [x] Build the stacked deck layout: all cards absolutely positioned, stacked with slight rotation offsets (±2-3°) and translate offsets for depth
- [x] Implement the core Flip animation: top card animates off-screen (rotate + translateX + opacity fade), next card becomes active
- [x] Implement `useGSAP` with `scope: containerRef` for automatic cleanup
- [x] Wire up `contextSafe` click handler for manual advance
- [x] Add backward navigation (previous card animates back in from off-screen)
- [x] Add compact counter UI: `"3 / 15"` styled in secondary text, positioned below the deck

**Success criteria:** Click/tap advances through all cards with smooth animation, backward navigation works, counter updates correctly, infinite loop wraps seamlessly.

### Phase 4: Auto-Play & Interaction States

**Tasks:**
- [x] Implement auto-play timer (4s interval) using `gsap.delayedCall()` or `setInterval`
- [x] IntersectionObserver: start auto-play when section is ≥50% in viewport, pause when out
- [x] Pause on hover (`onMouseEnter` / `onMouseLeave`)
- [x] Pause on keyboard focus (`onFocus` / `onBlur` on the section)
- [x] After manual interaction, pause for 6s then resume auto-play
- [x] Rapid-click debounce: check `tween.isActive()` before starting new animation

**Success criteria:** Auto-play runs when visible, pauses on all interaction types, resumes correctly. No animations run when section is off-screen.

### Phase 5: Accessibility & Reduced Motion

**Tasks:**
- [x] Add ARIA attributes: `role="region"`, `aria-roledescription="carousel"`, `aria-label`
- [x] Each card: `role="group"`, `aria-roledescription="slide"`, `aria-label` from `alt` field
- [x] Add `aria-live="polite"` region for card-change announcements
- [x] Keyboard: `ArrowRight`/`ArrowLeft` to navigate, `Space`/`Enter` to toggle pause
- [x] `useReducedMotion()` check (or `matchMedia('(prefers-reduced-motion: reduce)')`)
  - Disable auto-play entirely
  - Instant transitions (no GSAP animation, just swap active card)
  - Keep manual navigation working
- [x] Verify with VoiceOver on macOS

**Success criteria:** Fully keyboard navigable, screen reader announces card changes, reduced motion shows no animation but retains interactivity.

### Phase 6: Mobile Touch & Polish

**Tasks:**
- [x] Implement swipe detection via Pointer Events API
  - Track `pointerdown` → `pointermove` → `pointerup`
  - Swipe left (>50px horizontal, <30px vertical) = next card
  - Swipe right = previous card
  - Sub-threshold: snap card back
- [x] Test on mobile viewport widths (375px, 390px, 428px)
- [x] Ensure no gesture conflict with browser back-swipe (Safari)
- [x] Responsive card sizing: smaller max-width on mobile (`max-w-xs` on `sm:`)
- [x] Final visual polish: rotation offsets, shadow depth, transition easing
- [x] Test theme switching mid-animation
- [x] Verify GSAP cleanup on route navigation (no memory leaks)

**Success criteria:** Smooth swipe on mobile, no scroll conflicts, responsive sizing, clean theme transitions.

## Acceptance Criteria

### Functional Requirements

- [x] New "Art" section visible on homepage between Writing and Resume
- [x] Displays 10-20 artwork images as a stacked card deck
- [x] Cards auto-cycle every ~4 seconds when section is in viewport
- [x] Auto-play pauses on hover, focus, and manual interaction
- [x] Click/tap advances to next card
- [x] Left arrow / swipe-right navigates to previous card
- [x] Infinite loop — wraps from last to first and vice versa
- [x] Compact counter ("3 / 15") shows current position
- [x] Cards have slight rotation offsets for physical deck feel

### Non-Functional Requirements

- [x] `prefers-reduced-motion` disables all animation, keeps manual navigation
- [x] WAI-ARIA carousel pattern with keyboard controls (arrows, space, enter)
- [x] Screen reader announces card changes via `aria-live` region
- [x] First image loads eagerly, rest lazy-loaded
- [x] No layout shift from mixed aspect ratios (fixed container + `object-fit: contain`)
- [x] GSAP animations cleaned up on unmount (no memory leaks)
- [x] Works on mobile (375px+), tablet, and desktop
- [x] Adapts to dark and light themes via CSS custom properties

## Dependencies & Risks

| Dependency / Risk | Mitigation |
|---|---|
| GSAP is a new dependency (~30KB) | Scoped to one component; acceptable for the animation quality it enables |
| Two animation libraries (GSAP + Framer Motion) | Clearly separated — Framer Motion for scroll reveals, GSAP for card-stack only |
| Mixed aspect ratios causing layout shift | Fixed container with `object-fit: contain` |
| 10-20 images hurting page load | Lazy loading + `next/image` optimization; only first 2-3 loaded eagerly |
| Touch gesture conflicts on mobile Safari | Swipe threshold + vertical drift guard; test on iOS Safari specifically |
| GSAP Flip plugin complexity | `useGSAP` + `contextSafe` handle cleanup; follow GSAP's official React patterns |

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-04-12-art-showcase-brainstorm.md](../brainstorms/2026-04-12-art-showcase-brainstorm.md) — Key decisions carried forward: GSAP over Framer Motion, stacked deck approach, auto-play + manual interaction, image-only cards, homepage section placement.

### Internal References

- Section pattern: `src/components/sections/Writing.tsx`
- Data pattern: `src/data/projects.ts`
- ScrollReveal: `src/components/ui/ScrollReveal.tsx`
- SectionLabel: `src/components/ui/SectionLabel.tsx`
- Image pattern: `public/images/projects/*.webp`
- Theme variables: `src/app/globals.css:5-28`
- Homepage layout: `src/app/page.tsx`

### External References

- GSAP React guide: https://gsap.com/resources/React/
- GSAP Flip plugin docs: https://gsap.com/docs/v3/Plugins/Flip/
- `@gsap/react` useGSAP hook: https://www.npmjs.com/package/@gsap/react
- WAI-ARIA carousel pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- Reference demo: https://demos.gsap.com/demo/card-stack/
