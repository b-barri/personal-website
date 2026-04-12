# Brainstorm: Bhavya's Personal Portfolio Website

**Date:** 2026-04-11
**Status:** Complete

## What We're Building

A dark-themed, animation-rich personal portfolio website to showcase Bhavya's 11 side projects ("Bhavya's Side Quests"). The site serves triple duty: impressing hiring managers, building personal brand as a builder/maker, and providing a shareable project gallery.

**Tagline concept:** "Side projects are how I think. These are the ones that made it out."

**Reference:** [General Intelligence Company](https://www.generalintelligencecompany.com/) — dark, scroll-animated, cinematic storytelling.

## Why This Approach

**Single-page scrolling site** with individual project detail pages.

- Delivers the cinematic, dark, animated experience matching the reference site
- Natural storytelling flow: hook visitors with the hero, showcase projects, reveal the person behind them
- 11 projects is a manageable count for a single scroll page without feeling overwhelming
- Individual detail pages give each project room to breathe with screenshots, descriptions, and links

## Site Structure

### Main Page (Single Scroll)

1. **Hero Section**
   - Dark background with animated elements
   - Photo of Bhavya + name + tagline ("Side projects are how I think...")
   - Subtle particle or motion graphics around the photo
   - Scroll indicator to invite exploration

2. **Projects Section**
   - Grid/card layout showing all 11 projects
   - Cards with project image, title, one-line description
   - Hover animations (scale, glow, or reveal effects)
   - Cards link to individual project detail pages
   - Scroll-triggered reveal animations (stagger in)

3. **About Section**
   - Brief personal bio
   - Background, what drives Bhavya
   - Possibly a photo

4. **Writing/Blog Section**
   - Links out to external writing (Substack, Medium, Project Dora output)
   - Preview cards with titles and short descriptions
   - No built-in blog — external links only

5. **Resume/Experience Section**
   - 2-3 key career highlights
   - Download link for full resume PDF

6. **Contact/Footer**
   - Social links (GitHub, LinkedIn, X, etc.)
   - Email or contact form
   - Clean footer

### Project Detail Pages (`/projects/[slug]`)

Each project gets its own page with:
- Hero image/screenshot
- Project title and description
- Tech stack / tools used
- Key features or highlights
- Links (live demo, GitHub, etc.)
- Navigation back to main page

## Projects to Showcase

| # | Project | Description | Tools |
|---|---------|-------------|-------|
| 1 | PRD Auditor | AI PRD auditor based on Lenny's newsletters | — |
| 2 | Project Dora | AI writing pipeline in your personal voice | — |
| 3 | OpenClaw | Open-source claw machine controller | — |
| 4 | ToDo List | Task management with Claude Code workflow | — |
| 5 | Resume Editor Skill v1 | Claude skill for job-ready resumes | — |
| 6 | Prosepect | AI book research assistant | — |
| 7 | Notion Cover Generator | AI cover images for Notion pages | Lovable |
| 8 | Resume Optimizer v0 | Claude agent for resume tailoring | Claude Code |
| 9 | ContentFlow | Content planning for YouTube creators | Cursor, Claude Code |
| 10 | Book Review Tool | Visual book reviews via Gamma API | — |
| 11 | News (Pull Based) | Stock movers & business news for India | — |

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (scroll-triggered reveals, parallax, hover effects)
- **Deployment:** Vercel
- **Content:** Static project data (JSON/MDX), no CMS needed for now

## Key Decisions

- **Single-page scroll** over multi-page for cinematic feel matching reference
- **Dark theme** with animations as primary visual identity
- **Next.js + Tailwind + Framer Motion** for modern React stack with animation support
- **External blog links** rather than built-in blog (keeps scope manageable)
- **Individual project detail pages** for deep dives, not modals
- **User provides all images** (hero, project screenshots)
- **Static data** — no database or CMS needed

## Visual Direction

- **Light background** (#FEFFFC off-white/cream) — matching reference site (corrected: reference is light, not dark)
- **Electric blue accent** (#3B82F6 range) — vibrant, tech-forward
- **Headings:** Space Grotesk (free Google Font, similar vibe to PP Mondwest from reference site)
- **Body:** Inter (optimized for screen readability)
- Both available via `next/font/google` — zero licensing cost
- Scroll-triggered animations: fade-in, slide-up, stagger reveals
- Subtle hover effects on project cards (blue glow, scale, parallax tilt)
- Smooth section transitions

## Resolved Questions

1. **Accent color** — Electric blue (#3B82F6 range)
2. **Hero content** — Photo + name + tagline, with animated background elements
3. **Project ordering** — Featured first (Bhavya picks top 3-4 to highlight, rest follow)
4. **Resume section** — Key highlights (2-3 bullets) + download link for full resume

## Resolved Questions (continued)

5. **Domain** — Figure out later; deploy to Vercel for now
