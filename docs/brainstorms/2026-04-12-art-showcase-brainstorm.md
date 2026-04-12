# Brainstorm: Digital Art Showcase — Card Stack Section

**Date:** 2026-04-12
**Status:** Ready for planning

## What We're Building

A new homepage section showcasing Bhavya's digital illustrations using a GSAP-powered stacked card animation. The section displays 10–20 art pieces as a centered deck of cards that auto-cycles on a timer with a smooth flip/swipe-off animation, revealing the next piece underneath. Users can also click or tap to manually advance through the stack.

### Key Parameters

- **Content:** Digital illustrations, image-only (no titles or descriptions on cards)
- **Volume:** 10–20 pieces
- **Placement:** New numbered section on the homepage, after Writing and before Resume
- **Interaction:** Auto-play on a timer + manual click/tap to advance
- **Animation library:** GSAP (new dependency) with Flip plugin
- **Progress indicator:** Minimal — dot indicators or a counter (e.g., "3 / 15")

## Why This Approach

**Stacked Deck** was chosen over alternatives (horizontal carousel, scroll-pinned gallery) because:

1. **Closest to the reference** — matches the GSAP card-stack demo the user linked
2. **Engaging without scroll-jacking** — auto-play + click is less intrusive than scroll-pinning
3. **Works well for the volume** — 10–20 cards cycle naturally through a single stack
4. **Image-only cards shine here** — full-bleed art gets maximum visual impact in a centered deck

## Key Decisions

1. **GSAP over Framer Motion** — GSAP's Flip plugin is purpose-built for layout transitions. The rest of the site stays on Framer Motion; GSAP is scoped to this section only.
2. **Auto-play + manual interaction** — Cards auto-cycle (e.g., every 4 seconds) but pause on hover/interaction. Click/tap advances manually.
3. **Image-only cards** — Clean, full-bleed art. No text overlays. Let the illustrations speak.
4. **New homepage section** — Fits into the existing numbered section pattern (SectionLabel component). No separate /art route needed.
5. **Data pattern** — Follow existing convention: typed array in `src/data/artworks.ts` with image paths in `public/art/`.

## Design Considerations

- Cards should have slight rotation offsets in the stack for a physical "deck" feel
- Top card animates off (flip/swipe) to reveal the next card with a smooth GSAP Flip transition
- Respect `prefers-reduced-motion` — fallback to a simple fade or static grid
- Mobile: cards should be touch-friendly, possibly swipeable
- Dark/light theme: card edges or shadows should adapt to current theme
- Pause auto-play when section is not in viewport (IntersectionObserver)

## Resolved Questions

1. **Section position:** After Writing, before Resume — a visual surprise near the end of the page.
2. **Card aspect ratio:** Natural/mixed — each card matches the illustration's native ratio for a more dynamic feel.
3. **Loop behavior:** Yes, loop infinitely — seamlessly cycles back to card 1 after the last.

## Technical Notes

- GSAP + @gsap/flip need to be installed as dependencies
- GSAP is free for non-commercial use; check license for personal portfolio
- The component should be a client component (`"use client"`) since it needs DOM refs and GSAP
- Consider dynamic import to avoid loading GSAP on pages that don't use it (though this is homepage-only, so less critical)
