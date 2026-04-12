---
title: "feat: Personal Portfolio Website — Bhavya's Side Quests"
type: feat
status: active
date: 2026-04-11
origin: docs/brainstorms/2026-04-11-personal-portfolio-brainstorm.md
---

# Personal Portfolio Website — Bhavya's Side Quests

## Enhancement Summary

**Deepened on:** 2026-04-11
**Sections enhanced:** 8
**Research & review agents used:** TypeScript reviewer, Performance oracle, Security sentinel, Architecture strategist, Frontend races reviewer, Code simplicity reviewer, Context7 (Next.js + Framer Motion docs), Web search (dark mode best practices, Framer Motion performance)

### Key Improvements
1. **Theme corrected to light mode** — reference site is off-white (#FEFFFC), not dark. Full color system updated.
2. **Framer Motion scoped** — use CSS animations for simple effects (hovers, gradients); Framer Motion only for scroll-triggered orchestrations. Reduces bundle impact.
3. **Race condition mitigations** — smooth scroll vs Intersection Observer conflict, stagger jank prevention, mobile menu resize handling.
4. **TypeScript hardened** — `as const satisfies`, array for `links.other`, explicit `imagePath` naming, `writings.ts` data file added.

### New Considerations Discovered
- CSS `animation-timeline: view()` can replace Framer Motion for simple scroll reveals (progressive enhancement)
- Font weight limiting saves ~15-20KB per unused weight
- Security headers (CSP, X-Frame-Options) needed in `next.config.js`
- Smooth scroll triggers false Intersection Observer hits — needs programmatic scroll flag

---

## Overview

A light-themed, animation-rich single-page scrolling portfolio website showcasing 11 side projects, with individual project detail pages. Built with Next.js (App Router), Tailwind CSS, and Framer Motion. Deployed on Vercel.

The site serves as a personal brand hub — for hiring managers, collaborators, and social sharing. Visual identity is inspired by [General Intelligence Company](https://www.generalintelligencecompany.com/): light, clean, scroll-animated, with strategic dark accent sections.

## Problem Statement

Bhavya has 11 completed side projects with no unified showcase. Currently they live in a Notion database. A polished portfolio site will:
- Give recruiters/hiring managers a single link to evaluate builder credibility
- Establish a personal brand as a prolific AI-tool maker
- Provide shareable links for individual projects on social media

## Proposed Solution

Single-page scrolling site with 6 sections (Hero, Projects, About, Writing, Resume, Footer) plus dynamic `/projects/[slug]` detail pages. Static data, no CMS. Light theme matching reference site, with electric blue accent and scroll-triggered animations.

(see brainstorm: docs/brainstorms/2026-04-11-personal-portfolio-brainstorm.md)

## Technical Approach

### Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, navbar)
│   ├── page.tsx                # Home — single scroll page
│   ├── not-found.tsx           # Custom 404 page
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx        # Project detail page
│   └── globals.css             # Tailwind base + custom styles
├── components/
│   ├── sections/               # Page-level section components
│   │   ├── Hero.tsx
│   │   ├── ProjectsGrid.tsx    # Contains inline project cards
│   │   ├── About.tsx
│   │   ├── Writing.tsx
│   │   ├── Resume.tsx
│   │   └── Footer.tsx
│   └── ui/                     # Reusable UI primitives
│       ├── Navbar.tsx
│       └── ScrollReveal.tsx    # Framer Motion scroll wrapper
├── data/
│   ├── projects.ts             # Static project data (typed, const assertion)
│   └── writings.ts             # External writing links data
├── lib/
│   ├── fonts.ts                # Font configuration (Space Grotesk + Inter)
│   └── utils.ts                # Slug helpers, metadata construction
└── public/
    ├── images/
    │   ├── hero/               # Hero photo
    │   └── projects/           # Project screenshots (1 per project)
    └── resume.pdf              # Downloadable resume
```

### Research Insights: Architecture

**Component grouping** — Section components (`Hero`, `About`, etc.) and UI primitives (`Navbar`, `ScrollReveal`) live in separate directories to keep abstraction levels clean. (Architecture reviewer)

**Data layer** — `writings.ts` added alongside `projects.ts` since the Writing section links out to external articles and needs its own typed data source. (Architecture reviewer)

**Dropped:** `BackToTop.tsx` — on a single-page site with a fixed navbar, users can scroll up or click nav links. Adds complexity for minimal value. (Simplicity reviewer)

### Key Technical Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Router | App Router | Latest Next.js convention, built-in metadata API |
| Data | Static TS file with `as const satisfies` | 11 projects won't change often; compile-time type checking catches errors |
| Animations | Framer Motion (scroll orchestration) + CSS (hovers/gradients) | Scope Framer Motion to where it adds real value; CSS for compositor-thread effects |
| Fonts | `next/font/google` | Zero-layout-shift font loading, Space Grotesk + Inter |
| Images | `next/image` | Automatic optimization, lazy loading, responsive `sizes` |
| Deployment | Vercel | Zero-config for Next.js, free tier sufficient |

### Color System (Updated: Light Theme)

Matches reference site's off-white/cream aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#FEFFFC` | Main page background (off-white/cream) |
| `bg-surface` | `#F5F5F0` | Card backgrounds, elevated surfaces |
| `bg-dark-section` | `#1F1F29` | Optional dark accent sections (hero overlay) |
| `text-primary` | `#2C2C2C` | Headings, primary body text |
| `text-secondary` | `#6B7280` | Muted/secondary text |
| `accent` | `#3B82F6` | Electric blue — buttons, links, hover states |
| `border` | `#DEE2DE` | Subtle dividers and card borders |

### Research Insights: Color & Design

- **Surface elevation** — use subtle shadows and slightly darker surface colors (`#F5F5F0`) for cards instead of borders alone. Light themes use shadows for depth hierarchy, unlike dark themes which use lighter shades.
- **Accent on light** — `#3B82F6` passes WCAG AA on both `#FEFFFC` (5.2:1) and `#2C2C2C` text contrast is strong. No adjustments needed.
- **Typography on light** — `#2C2C2C` on `#FEFFFC` gives ~14:1 contrast ratio, well above WCAG AAA.

### Implementation Phases

#### Phase 1: Project Scaffold & Foundation

Set up the Next.js project with all dependencies and base configuration.

**Tasks:**
- [ ] Initialize Next.js project: `npx create-next-app@latest --typescript --tailwind --app --src-dir`
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Configure Tailwind with light theme custom colors (see Color System table above)
- [ ] Set up fonts in `lib/fonts.ts`:
  - Space Grotesk: weights 600, 700 only (headings)
  - Inter: weights 400, 500 only (body)
  - Both via `next/font/google` with `display: 'swap'`
- [ ] Create root `layout.tsx` with font classes, light background, and base metadata
- [ ] Create `globals.css` with Tailwind layers and `scroll-behavior: smooth`
- [ ] Set up `data/projects.ts` with typed project data for all 11 projects
- [ ] Set up `data/writings.ts` with typed external article links
- [ ] Create placeholder image directories (`public/images/hero/`, `public/images/projects/`)

**Data structure for `projects.ts`:**

```typescript
// data/projects.ts
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;         // Longer description for detail page
  imagePath: string;           // Path to screenshot in /public/images/projects/
  tools: string[];
  features: string[];
  links: {
    demo?: string;
    github?: string;
    other?: { label: string; url: string }[];  // Array, not single object
  };
  featured: boolean;
}

export const projects = [
  // ... all 11 projects
] as const satisfies readonly Project[];
```

**Research Insights: TypeScript**
- Use `as const satisfies` for compile-time duplicate slug detection and narrow literal types. (TypeScript reviewer)
- Renamed `image` to `imagePath` for explicit intent. (TypeScript reviewer)
- `links.other` is an array — projects may have multiple supplementary links. (TypeScript reviewer)
- Limit font weights to only what's used — each unused weight adds ~15-20KB. (Performance oracle)

**Success criteria:** `npm run dev` serves a blank light page with correct fonts loading.

#### Phase 2: Layout & Navigation

Build the fixed navbar and page skeleton.

**Tasks:**
- [ ] Build `Navbar.tsx` — fixed/sticky, light background with blur backdrop (`backdrop-blur-sm bg-white/80`)
  - Name on the left
  - Section links: Projects, About, Writing, Resume — smooth scroll to anchors
  - Active section highlighting via Intersection Observer (with programmatic scroll guard — see Race Condition notes)
  - Mobile: hamburger menu with slide-out drawer
  - Close mobile menu on `matchMedia` breakpoint change (prevent stale open state on resize)
- [ ] Add section `id` anchors to `page.tsx` for nav scroll targeting
- [ ] Build `Footer.tsx` — social icon links (GitHub, LinkedIn, X, email)
  - Icons via inline SVGs
  - External links open in new tab with `rel="noopener noreferrer"`

**Research Insights: Race Conditions**

Smooth scroll + Intersection Observer is a known timing hazard. When a user clicks a nav link, smooth scroll traverses intermediate sections, causing the observer to flicker through false "active" states. Mitigation:

```typescript
// In Navbar.tsx
const isScrollingRef = useRef(false);

const handleNavClick = (sectionId: string) => {
  isScrollingRef.current = true;
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

  // Use scrollend event (modern browsers) or fallback timeout
  const onScrollEnd = () => {
    isScrollingRef.current = false;
    window.removeEventListener('scrollend', onScrollEnd);
  };
  window.addEventListener('scrollend', onScrollEnd, { once: true });
  // Fallback for browsers without scrollend
  setTimeout(() => { isScrollingRef.current = false; }, 1000);
};

// In observer callback:
if (isScrollingRef.current) return; // Skip updates during programmatic scroll
```

(Frontend races reviewer)

**Mobile menu resize fix:** Listen for `matchMedia('(min-width: 768px)')` changes and force-close the hamburger menu on breakpoint crossing to prevent it overlaying the desktop layout. (Frontend races reviewer)

**Success criteria:** Navbar sticks on scroll, section links smooth-scroll to targets without nav flicker, mobile menu works and closes on resize.

#### Phase 3: Hero Section

Build the first thing visitors see.

**Tasks:**
- [ ] Build `Hero.tsx` — full viewport height section
  - Bhavya's photo (user-provided) with `next/image`, `priority={true}` (above fold)
  - Name in Space Grotesk, large
  - Tagline: "Side projects are how I think. These are the ones that made it out."
  - Subtle animated background via CSS `@keyframes` (gradient shift or floating shapes) — NOT Framer Motion
  - Scroll-down indicator (CSS-animated chevron)
- [ ] Ensure hero is responsive: photo scales, text reflows on mobile
- [ ] Add entrance animation via Framer Motion (fade-in + slide-up on initial mount only)

**Research Insights: Performance**
- Hero background animation must be pure CSS (`@keyframes` + `animation`) — runs on compositor thread with zero JS overhead. Framer Motion would force JS-driven animation for no benefit here. (Performance oracle)
- Hero image should use `priority={true}` and `loading="eager"` since it's above the fold. (Performance oracle)

**Success criteria:** Hero fills viewport, photo + text display correctly on desktop and mobile, CSS animation plays smoothly.

#### Phase 4: Projects Grid & Cards

The core showcase section.

**Tasks:**
- [ ] Build `ScrollReveal.tsx` — thin Framer Motion wrapper (under 15 lines)
  - Uses `whileInView` with `viewport={{ once: true, amount: 0.2 }}`
  - Fade-in + slide-up animation
  - Only animates GPU-composited properties: `opacity`, `y` (transform)
  - Respects `prefers-reduced-motion` via `useReducedMotion()` hook
- [ ] Build project cards inline within `ProjectsGrid.tsx`
  - Project image with `next/image` and responsive `sizes` prop: `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"`
  - Title (Space Grotesk) + tagline (Inter)
  - Hover: CSS-only effects — subtle scale (`hover:scale-[1.02]`), shadow lift, accent border glow via Tailwind `transition-all`
  - Featured projects: accent-colored left border or "Featured" badge
  - Links to `/projects/[slug]`
  - On mobile: no hover effects, tap-friendly sizing (min 44px touch targets)
- [ ] Grid layout in `ProjectsGrid.tsx`
  - Section heading: "Side Quests" or "Projects"
  - Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
  - Featured projects appear first (sorted by `featured` flag, then array order)
  - Use Framer Motion variants with `staggerChildren` on the container, not individual observers per card
- [ ] Handle missing images gracefully (fallback gradient card)

**Research Insights: Stagger Animation**

Do NOT give each card its own `whileInView` observer. Fast scrolling triggers all 11 simultaneously, defeating the stagger (cards animate in sequence but are already visible). Instead, use Framer Motion variants on the parent container:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Usage: single observer on container
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
>
  {projects.map(project => (
    <motion.div key={project.slug} variants={cardVariants}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

(Frontend races reviewer, Framer Motion docs via Context7)

**Research Insights: Performance**
- Hover effects must be CSS/Tailwind only — `transition-all duration-200`, `hover:shadow-lg`, `hover:scale-[1.02]`. These run on the compositor thread. (Performance oracle)
- Use `sizes` prop on `next/image` accurately to avoid serving oversized images. (Performance oracle)
- First 3-4 visible project images can use `priority={true}` if they're above the fold. (Performance oracle)

**Success criteria:** All 11 projects display in grid, CSS hover effects work on desktop, stagger animation fires cleanly on scroll, responsive layout adapts, featured projects appear first.

#### Phase 5: Project Detail Pages

Individual pages for each project.

**Tasks:**
- [ ] Build `/projects/[slug]/page.tsx` — dynamic route
  - Look up project by slug from `data/projects.ts`
  - Return 404 via `notFound()` for invalid slugs
  - Hero image (full-width or contained)
  - Title + tagline
  - Full description
  - Tech stack / tools as tags/badges
  - Key features as a list
  - Links (demo, GitHub, other) as styled buttons
  - "Back to projects" link (navigates to `/#projects` anchor)
- [ ] Generate static params with `generateStaticParams()`:
  ```typescript
  export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
  }
  ```
- [ ] Add per-page metadata with `generateMetadata()`:
  ```typescript
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find(p => p.slug === slug);
    if (!project) return {};
    return {
      title: `${project.title} — Bhavya's Side Quests`,
      description: project.tagline,
      openGraph: { images: [project.imagePath] },
    };
  }
  ```
- [ ] Page entrance animation (Framer Motion fade-in, once)

**Research Insights: Next.js**
- `params` is a Promise in Next.js 15+ App Router — must `await` it. (Context7 docs)
- With `generateStaticParams`, all 11 pages are pre-rendered at build time as static HTML. No runtime injection risk from slug parameter. (Security reviewer)
- Each page gets unique OG tags, making project links shareable on social media with rich previews. (Context7 docs)

**Success criteria:** Each project has a unique URL, displays full content, 404 works for bad slugs, metadata is set per project.

#### Phase 6: About, Writing, Resume Sections

The remaining content sections on the main page.

**Tasks:**
- [ ] Build `About.tsx`
  - Brief bio text (user-provided content)
  - Optionally a second photo or illustration
  - Wrapped in `ScrollReveal`
- [ ] Build `Writing.tsx`
  - Data sourced from `data/writings.ts`
  - 3-4 external article links as preview cards (title + short description + external link icon)
  - Links open in new tab with `rel="noopener noreferrer"`
  - Wrapped in `ScrollReveal`
- [ ] Build `Resume.tsx`
  - 2-3 career highlight bullets
  - "Download Resume" button linking to `/resume.pdf`
  - Wrapped in `ScrollReveal`

**Data structure for `writings.ts`:**

```typescript
export interface Writing {
  title: string;
  description: string;
  url: string;       // External link (Substack, Medium, etc.)
  platform: string;  // e.g., "Substack", "Medium"
}

export const writings: Writing[] = [
  // ... user-provided article links
];
```

**Success criteria:** All three sections render with content, external links work, resume downloads.

#### Phase 7: Polish, SEO & Performance

Final quality pass.

**Tasks:**
- [ ] **SEO:**
  - Root metadata in `layout.tsx` (title, description, OG image, Twitter card)
  - Sitemap: create a simple `public/sitemap.xml` manually (13 URLs total — home + 11 projects + resume)
  - `public/robots.txt` allowing all crawlers
- [ ] **Security headers** in `next.config.js`:
  ```javascript
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]
    }];
  }
  ```
  (Security reviewer)
- [ ] **Accessibility:**
  - Verify color contrast — `#2C2C2C` on `#FEFFFC` passes WCAG AAA (~14:1 ratio)
  - Add `alt` text to all images
  - Keyboard-navigable navbar and project cards
  - Respect `prefers-reduced-motion` — use `useReducedMotion()` hook to disable Framer Motion animations
  - Skip-to-content link as first focusable element
- [ ] **Performance:**
  - Verify `next/image` optimization is working (WebP/AVIF, lazy loading)
  - Only load Inter 400/500 and Space Grotesk 600/700 weights — skip others
  - Ensure CSS animations for hovers and gradients (not Framer Motion)
  - Test Lighthouse score — target 90+ on all categories
- [ ] **Responsive QA:**
  - Test on mobile (375px), tablet (768px), desktop (1280px+)
  - Verify touch targets are 44px+ on mobile
  - Test hamburger menu functionality + resize close behavior
- [ ] **404 page:** Custom styled `not-found.tsx` matching the light theme
- [ ] **Favicon:** Add favicon and apple-touch-icon
- [ ] **Resume PDF:** Scrub metadata with `exiftool` before committing (remove local file paths, author metadata)

**Research Insights: Performance Budget**
- Set hard constraints before building: max bundle size increase from Framer Motion ≤ 50KB gzipped, minimum 55+ FPS on scroll animations, CLS impact ≤ 0.05. (Performance oracle)
- `next/image` `sizes` prop must be accurate — incorrect sizes serve oversized images on mobile. (Performance oracle)

**Success criteria:** Lighthouse 90+ all categories, WCAG AA compliant, fully responsive, security headers set, proper meta tags.

#### Phase 8: Deploy

Ship it.

**Tasks:**
- [ ] Initialize git repo and make initial commit
- [ ] Push to GitHub
- [ ] Connect to Vercel and deploy
- [ ] Lock down `next.config.js` `images.remotePatterns` to only domains you use (or empty if all images are local)
- [ ] Verify production build works
- [ ] Test all pages and links on production URL

**Success criteria:** Site is live on Vercel, all sections and project pages work in production.

## Content Bhavya Needs to Provide

Before or during implementation, the following content is needed:

| Content | Used In | Format |
|---------|---------|--------|
| Photo of yourself | Hero section | JPG/PNG, high-res |
| Project screenshots (x11) | Project cards + detail pages | JPG/PNG, 16:9 or similar. Download cover images from Notion database manually and save to `public/images/projects/{slug}.jpg` |
| Short bio (2-3 paragraphs) | About section | Text |
| Career highlights (2-3 bullets) | Resume section | Text |
| Resume PDF | Resume download | PDF file (scrub metadata before committing) |
| Writing links (3-4 articles) | Writing section | URLs + titles + descriptions |
| Social links | Footer | GitHub, LinkedIn, X URLs |
| Project descriptions (long) | Project detail pages | Text per project |
| Featured projects selection | Project ordering | Pick your top 3-4 |

## Acceptance Criteria

### Functional Requirements

- [ ] Single-page scroll with 6 sections: Hero, Projects, About, Writing, Resume, Footer
- [ ] Fixed/sticky navbar with smooth-scroll section links (no flicker during scroll)
- [ ] 11 project cards in responsive grid (3/2/1 columns by breakpoint)
- [ ] Featured projects (top 3-4) appear first with visual distinction
- [ ] Each project has a detail page at `/projects/[slug]` with full content
- [ ] Invalid project slugs return styled 404
- [ ] External writing links open in new tabs
- [ ] Resume PDF downloads on click
- [ ] Social links in footer (GitHub, LinkedIn, X)

### Non-Functional Requirements

- [ ] Light theme (#FEFFFC bg, #3B82F6 accent, #2C2C2C text)
- [ ] Space Grotesk headings, Inter body text
- [ ] Scroll-triggered animations via Framer Motion (respecting `prefers-reduced-motion`)
- [ ] Hover effects via CSS only (no Framer Motion for hovers)
- [ ] Responsive: mobile (375px+), tablet (768px+), desktop (1280px+)
- [ ] WCAG AA color contrast compliance
- [ ] Lighthouse 90+ across all categories
- [ ] Proper SEO metadata + OG tags on all pages
- [ ] Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- [ ] Deployed and functional on Vercel

## Alternative Approaches Considered

| Approach | Why Rejected |
|----------|-------------|
| Multi-page traditional site | Less cinematic — doesn't match reference site's feel (see brainstorm) |
| Hybrid scroll + separate projects page | Splits attention, adds complexity for 11 projects (see brainstorm) |
| Astro | User preferred Next.js for React ecosystem + Framer Motion (see brainstorm) |
| Plain HTML/CSS/JS | Would require manual animation work; Next.js gives image optimization, routing for free (see brainstorm) |
| Built-in blog | Scope creep — external links keep initial build lean (see brainstorm) |
| Modal project details | Less shareable — no unique URLs for projects (see brainstorm) |
| Pure CSS animations (no Framer Motion) | Considered by simplicity reviewer. CSS `animation-timeline: view()` is powerful but has limited browser support (~75%). Framer Motion adds orchestration (stagger, variants) that CSS can't match cleanly. Compromise: CSS for simple effects, Framer Motion for scroll orchestrations only. |

## Dependencies & Prerequisites

- Node.js 18+ installed
- User-provided images (hero photo, 11 project screenshots)
- User-provided content (bio, career highlights, project descriptions, writing links)
- Vercel account for deployment

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing images delay launch | Medium | Medium | Use placeholder gradients until images arrive; site works without them |
| Animation performance on mobile | Low | Medium | CSS for simple effects, `viewport={{ once: true }}` for Framer Motion, respect `prefers-reduced-motion` |
| Content not ready | Medium | High | Scaffold with lorem ipsum; swap in real content later |
| Smooth scroll + observer flicker | Medium | Low | Programmatic scroll flag pattern (see Phase 2 research insights) |
| Framer Motion bundle size | Low | Low | Scoped usage + tree-shaking; CSS handles hovers/gradients |

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-04-11-personal-portfolio-brainstorm.md](../brainstorms/2026-04-11-personal-portfolio-brainstorm.md) — Key decisions carried forward: single-page scroll approach, light theme (corrected from brainstorm's initial dark), Next.js + Tailwind + Framer Motion stack, featured-first project ordering, external blog links, social-links-only contact.

### External References

- [Next.js App Router docs](https://nextjs.org/docs/app) — metadata API, generateStaticParams, next/image, next/font
- [Framer Motion docs](https://www.framer.com/motion/) — whileInView, variants, staggerChildren, useReducedMotion
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Space Grotesk on Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- [Reference site: General Intelligence Company](https://www.generalintelligencecompany.com/)
- [Framer Motion Performance Patterns](https://dev.to/whoffagents/framer-motion-animations-that-dont-kill-performance-patterns-and-pitfalls-5cki)
- [Dark Mode Best Practices (applicable light mode contrast insights)](https://natebal.com/best-practices-for-dark-mode/)
