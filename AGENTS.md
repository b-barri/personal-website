<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack
Next.js **16.2.3** (App Router), React **19.2.4**, TypeScript, Tailwind **v4**, Framer Motion + GSAP for animation. Deployed to Vercel; analytics + speed-insights wired via `@vercel/*` packages.

All four of those are ahead of typical training-data baselines — when in doubt, read `node_modules/next/dist/docs/` or the Tailwind v4 / React 19 release notes before introducing a pattern.

## Commands
- `npm run dev` — local server on http://localhost:3000
- `npm run build` — production build (run before claiming a change works)
- `npm run start` — serve the production build locally
- `npm run lint` — ESLint via `eslint-config-next`

## Directory map
- `src/app/` — App Router routes. `src/app/projects/` is the projects subroute.
- `src/components/ui/` — primitives. `src/components/sections/` — page-level sections.
- `src/content/projects/` — long-form project content (markdown).
- `src/data/{artworks,projects,writings}.ts` — typed registries (short metadata, ordering, links). Pairs with `content/` markdown for long-form.
- `src/lib/content.ts` — markdown/content loader. `src/lib/fonts.ts` — font config.
- `docs/solutions/` — shared, cross-project store of documented solutions and institutional learnings (dated markdown, YAML frontmatter: `tags`, `type`/`problem_type`). Symlinked; written by `/ce-compound`, read by `/ce-plan`. Relevant when implementing or debugging in documented areas.

## Conventions
- Typed registry first: when adding a project/artwork/writing, update `src/data/*.ts` first, then add the markdown body in `src/content/projects/` if it has long-form content. Don't put copy in `.ts` files.
- Sections live in `components/sections/`; primitives in `components/ui/`. Don't mix.
- Use `next/font` via `src/lib/fonts.ts`; don't import Google Fonts directly.
- Tailwind v4 — `@theme` config in CSS, not `tailwind.config.js`. Verify before adding utility plugins.

## Quirks
- `.vercel/` is committed metadata for the linked Vercel project; don't delete it.
- `next-env.d.ts` is generated — never hand-edit.
- The site is the public portfolio at https://bhavya-barri-portfolio.vercel.app/ and feeds the "builder-PM" angle used in job applications; treat copy changes with care.
