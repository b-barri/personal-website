# Lenny's War Room

An AI-powered PRD auditor — your strategy, stress-tested by 279 product experts.

Built in a single day with Claude Code. [Try it here](https://lenny-war-room.vercel.app/)

![Analyze mode — PRD draft on the left, expert-grounded annotations on the right](/images/projects/prd-auditor/image.png)

## TL;DR

**What:** Paste a PRD and get it scored, critiqued, and rewritten by AI grounded in insights from 279 real product experts (Shreyas Doshi, Teresa Torres, Marty Cagan, and more)

**How:** Processed 289 podcast transcripts + 349 newsletter articles into a structured knowledge base, built a Next.js app with a two-tier Claude API strategy, and shipped in one day using a compound engineering workflow

**Result:** Three distinct feedback modes (scorecard, expert debate, framework review) with a pixel-art game UI and collectible experts mechanic

## Why I Built This

After writing dozens of PRDs as a PM, I kept hitting the same wall: feedback was either nonexistent, vague, or limited to one person's perspective. I'd spend a week crafting a strategy document, share it broadly, and hear back "looks good" or "the metrics section needs work" — with zero specifics.

Meanwhile, I'd been consuming Lenny Rachitsky's podcast and newsletter for years. Every episode featured a product leader sharing specific, named frameworks for thinking about strategy, metrics, growth, and execution. The knowledge was incredible — but it lived in 289 transcripts and 349 articles that nobody had time to cross-reference against their actual work.

The question I couldn't shake: what if you could make that expert knowledge operational? Not content to passively read, but a tool that applies those frameworks directly to your PRD.

## The Problem

PRD feedback today is broken in three specific ways:

1. **No feedback** — everyone's too busy to read your 8-page doc
2. **Vague feedback** — "the metrics section needs work" with no specifics
3. **One person's opinion** — which may not represent how a seasoned product leader would think

Existing alternatives don't solve this well:

- **Peer review** is slow and calendar-dependent. You wait days for feedback that may never come.
- **ChatGPT with a generic prompt** gives surface-level advice with no grounding in real expert thinking — it doesn't know that Shreyas Doshi's LNO Framework exists, or how Teresa Torres would critique your opportunity space.
- **PM tools** (Notion AI, Coda AI) help you write docs but don't critique them at the level a senior product leader would.

## The Solution: Three Modes of Expert Feedback

| Mode | What It Does | What Makes It Different |
|------|-------------|------------------------|
| Analyze PRD | Scores 9 sections (1-10), highlights weak phrases, suggests one-click rewrites | Each annotation teaches an expert's framework first, then applies it to your text |
| Red Team | 2-5 experts matched to your PRD's topics debate your strategy | Experts reference and challenge each other's arguments — not parallel monologues |
| Expert Review | One expert reviews your entire PRD through their specific frameworks | Organized by the expert's own thinking tools (LNO, DHM, Continuous Discovery), not generic categories |

## See It In Action

A user pastes a PRD for a new notifications feature. The Analyze mode returns a heatmap scorecard: Problem Statement scores 8/10 (strong), but North Star Metric scores 3/10 (critical). The inline annotation highlights the phrase "increase DAU" and explains:

> "Shreyas Doshi's LNO Framework classifies metrics as Leverage, Neutral, or Overhead. DAU is Neutral — it describes activity but doesn't predict outcomes. A Leverage metric would be notification-driven task completions, which directly connects user engagement to the feature's value proposition."

One click accepts the suggested rewrite. The PRD updates instantly. After two rewrites, a nudge appears: "RE-ANALYZE to see your score improve."

![Red Team Council — experts matched to the PRD's topics, ready to debate](/images/projects/prd-auditor/image2.png)

![Red Team Debate — experts reference and challenge each other's arguments](/images/projects/prd-auditor/image1.png)

![Lenny's Verdict — debate distilled into Area / Issue / Action](/images/projects/prd-auditor/image3.png)

## The Data Pipeline

The foundation is a knowledge base built from Lenny's content (sourced as a paid subscriber, processed locally):

- 289 podcast transcripts → `build-corpus.ts` → guest-index.json (279 guests), search-corpus.json (inverted index), debate-pairs.json
- 349 newsletter articles → `enrich-newsletter.mjs` (Haiku) → newsletter-enrichment.json
- 119 frameworks extracted
- 194 articles mapped to guests

**Pipeline cost: ~$0.40 in API calls.** Haiku extracted guest mentions, named frameworks, and key insights from each of the 349 newsletter articles in about 10 minutes.

## Technical Architecture

**Stack:** Next.js 16 (App Router, TypeScript) | React 19 + Zustand 5 | Anthropic Claude API | Tailwind CSS v4 | GSAP | Zod 4 | Vercel

![System architecture — frontend modes, Zustand store, Next.js API routes, Anthropic Claude API](/images/projects/prd-auditor/tech_architecture.png)

### Two-Tier LLM Strategy

Heavy reasoning tasks (analysis, debates, reviews) use Claude Sonnet 4. Fast classification tasks (expert matchmaking, API key validation) use Claude Haiku 4.5. This isn't arbitrary — matchmaking needs speed and costs pennies, while a framework-organized expert review needs the reasoning depth that only Sonnet provides.

### Key Technical Decisions

**BYOK (Bring Your Own Key) vs. server-side key management:** The app needs to call the Anthropic API on behalf of users. I chose BYOK — the key lives in a secure httpOnly cookie, never logged, never stored on any server. I gave up easy onboarding (users need their own API key) but gained zero backend auth infrastructure, no API cost exposure, and public deployment without abuse concerns.

**"Teach Then Apply" vs. direct critique:** Annotations could just say "your metric is bad." Instead, each one explains the expert's framework generically, then shows how it applies to the specific PRD text. I gave up brevity but gained something more valuable: PMs learn a reusable framework, not just a one-time fix.

**Fake streaming vs. real NDJSON streaming:** The debate feature shows typing indicators and word-by-word reveal, but generates the entire conversation in one API call. A client-side state machine handles the animation. A code review flagged real streaming as high complexity, low value — the fake version already felt great.

**Index-based splicing vs. String.replace():** When a user accepts a rewrite, JavaScript's replace() interprets $ in replacement strings as special patterns — a rewrite containing "$50M ARR" would produce garbage. The fix: indexOf() + slice() instead. A correctness bug caught by an AI code review before it shipped.

**Regex JSON fixer vs. structured output mode:** Claude frequently produces literal newlines inside JSON string values, breaking JSON.parse(). Every API route includes a fallback regex parser that finds string values and escapes literal newlines before re-parsing. Ugly but reliable.

## The Design: Pixel Art Meets Product Rigor

Product work is serious enough — the tool that critiques your PRD doesn't have to be.

The entire UI is built around a retro game aesthetic: Press Start 2P pixel font for headers, 279 AI-generated pixel-art avatar sprites, pixel shadow buttons, RPG-style score badges, and "War Room" / "Red Team" / "Expert Arena" metaphors throughout.

The gamification hook: Every expert you encounter through analyses, debates, and reviews gets added to your Guest Collection — 279 to collect, tracked by a pixel-art treasure chest in the header.

## The Build Story: One Day, Seven Iterations

Every feature followed the same compound engineering loop:

`/ce:brainstorm → /ce:plan → /ce:review → /ce:work → Ship`

This loop ran seven times in a single day:

1. Annotation workflow (accept/dismiss/rewrite)
2. Guest collection tracking
3. Expanded 9-section scorecard
4. Verdict table for debates
5. Expert review mode
6. Newsletter enrichment pipeline
7. Design polish (animations, loading states)

**The pivot that mattered:** The verdict table was originally planned as a structured TypeScript object with new Zod schemas and dedicated types. The simplicity reviewer pushed back — "just improve the prompt and render the string as markdown." I resisted, then tried it. The simple version worked perfectly. That one review saved hours of unnecessary schema work.

**Key insight:** The brainstorm and review phases saved more time than they cost. Every feature that skipped review had bugs. Every feature that went through the full loop shipped clean.

## Outcomes and What I Learned

**Speed:** The tool generates expert-level PRD feedback in ~30 seconds — versus the days (or silence) of a traditional review cycle.

Three meta-insights from the build:

1. **Prompt engineering is the new product design.** 80% of the work wasn't code — it was getting the prompts right. The difference between generic advice and a grounded, framework-specific critique is entirely in the prompt.
2. **AI code reviews catch real bugs.** Multi-agent reviews (architecture, security, performance, simplicity in parallel) caught the String.replace injection bug, flagged an oversized JSON file, and recommended deferring the streaming feature.
3. **Ship the simple version.** Almost every feature started more complex than what shipped. The simplicity reviewer repeatedly argued for less — and was right every time.

## What I'd Do Differently

- **Real-time streaming for analysis:** The fake streaming works for debates, but the initial analysis has a long wait. Streaming partial results would improve perceived performance.
- **Persistent session state:** Currently, refreshing the page loses all analysis results. Adding localStorage persistence would let users return to previous sessions.
- **Collaborative mode:** PMs often review PRDs together. A shared session where multiple people see and discuss the same annotations would extend this from a solo tool to a team workflow.

## Project Stats

| Metric | Value |
|--------|-------|
| Build time | 1 day |
| Product experts indexed | 279 |
| Podcast transcripts processed | 289 |
| Newsletter articles processed | 349 |
| Named frameworks extracted | 119 |
| AI-generated pixel-art sprites | 279 |
| Data pipeline cost | ~$0.40 |
| Development iterations | 7 (brainstorm-to-ship cycles) |

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| State | Zustand 5 |
| Styling | Tailwind CSS v4, GSAP, Press Start 2P |
| AI | Claude Sonnet 4 + Haiku 4.5 |
| Validation | Zod 4 |
| Deployment | Vercel |
| Auth | BYOK (httpOnly cookie) |

Built with Claude Code. Pixel-art sprites generated with AI image tools. Data sourced from Lenny's Podcast and Newsletter as a paid subscriber.
