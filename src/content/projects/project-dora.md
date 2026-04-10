# ProjectDora

An AI writing pipeline that actually sounds like you.

Built a full content pipeline that turns real-time trend signals from 9 sources into polished, fact-checked Substack posts, written in the author's own voice, with human approval at every step. 84 commits over 18 days.

## TL;DR

**What:** A local AI-powered Substack blog generation pipeline with human approval gates at every step

**How:** 9 trend sources, two-pass Claude pipeline with tone fingerprinting, strategic framing, and automated fact-checking

**Result:** End-to-end blog posts in ~15 minutes that pass the "did I write this?" test

## Why I Built This

I write a PM/strategy newsletter on Substack. The hardest part isn't the writing itself, it's the hours before writing: scanning Hacker News, skimming Stratechery, scrolling Twitter, trying to connect dots between trends and figure out what's worth a thousand words this week.

I wanted a system that could do the research grunt work, suggest topics with real strategic framing, and then draft in my voice, while keeping me in control of every editorial decision.

## The Problem

Most AI writing tools fall into two camps:

- **ChatGPT-style "write me a blog post"** produces generic, voiceless content that reads like it was written by a committee. No awareness of what's trending, no strategic angle, no author voice.
- **Content mills** like Jasper/Copy.ai optimize for SEO volume, not editorial quality. They don't read Stratechery or understand Aggregation Theory.
- **Research tools** like Perplexity are great for answering questions but don't connect trends into narrative arcs or write in your style.

None of them solve the actual bottleneck: going from "there are 47 interesting things happening in tech right now" to "here's the one angle that's uniquely mine to write about, backed by research, in my voice."

## The Solution

ProjectDora is a 7-stage pipeline with a human approval gate between each stage:

| Stage | What happens | Human decision |
|-------|-------------|----------------|
| Ingest | Scrapes 9 sources (Stratechery, Every.to, Lenny's, Twitter, HN, TechCrunch, The Verge, Reddit, Google Trends) | - |
| Suggest | Two-pass topic generation: Claude Sonnet generates raw ideas, Claude Haiku applies strategic frameworks | Approve or reject each topic |
| Research | Web search + source synthesis into a structured brief | Review research brief |
| Outline | Section-by-section outline with key points and image placements | Edit or approve outline |
| Write | Section-by-section drafting in author's voice with style guide enforcement | Review full draft |
| Fact-check | Claim extraction + source verification with citation links | Toggle individual claims |
| Image | Midjourney-style prompts with physical-world metaphors, logo compositing | Download and publish |

**Before:** 3-4 hours of trend scanning, researching, outlining, and writing before a draft exists.

**After:** Approve a topic suggestion, review an outline, and have a publish-ready draft with citations and hero image in about 15 minutes.

## The Data Pipeline

```
9 Trend Sources (RSS, APIs, scraping)
        |
        v
Slot-Based Aggregation (72 items, weighted by source quality)
        |
        v
Pass 1: Claude Sonnet (raw topic suggestions, calibrated by approve/reject history)
        |
        v
Pass 2: Claude Haiku (strategic framework overlay: Aggregation Theory, Disruption, JTBD...)
        |
        v
Post-processing (Jaccard dedup at 0.4, type diversity cap at 3 per category)
        |
        v
7 Ranked Topic Suggestions --> Human Approval Gate
        |
        v
DuckDuckGo Search + Page Extraction --> Claude Research Brief
        |
        v
Section-by-Section Writing (tone profile + style guide + few-shot exemplars)
        |
        v
Editorial Review Pass (voice consistency scoring, auto-patching weak sections)
        |
        v
Fact-Check Pass (claim extraction, source cross-reference, citation injection)
```

The slot-based priority system allocates fixed slots per source rather than scoring everything equally. Stratechery and Every.to get 15 slots each; Twitter gets 8 with a one-per-author cap to prevent prolific posters from dominating the feed.

## Technical Architecture

**Stack:** Python 3.9+ / FastAPI / SQLAlchemy 2.0 async / SQLite (WAL) / Jinja2 / Claude Sonnet + Haiku / DALL-E 3

The architecture is a layered monolith with six pipeline modules, each independently callable. Background tasks run via FastAPI's built-in BackgroundTasks, each opening their own async DB session to avoid sharing request-scoped connections.

### Key Technical Decisions

**SQLite with WAL mode over PostgreSQL.** A local-only tool doesn't need a database server. WAL mode + a 10-second busy timeout handles the actual concurrency pattern (web requests reading while background tasks write) cleanly.

**Two-pass topic generation over single-prompt.** Pass 1 (Claude Sonnet) generates raw suggestions grounded in trends. Pass 2 (Claude Haiku) applies strategic frameworks (Aggregation Theory, Disruption, JTBD). The creative generation step doesn't compete with the analytical framing step, and each can be tuned independently. Haiku is also 10x cheaper for the framework overlay.

**Calibration pairs over blacklists (the Pink Elephant Problem).** The style guide uses pairs of GENERIC vs. IN-VOICE examples rather than listing things to avoid. Research shows LLMs are more likely to produce forbidden patterns when you name them explicitly. Showing the right answer works better.

**Programmatic em dash removal as a defense layer.** Despite explicit prompt instructions, Claude produces em dashes. Rather than fighting this in the prompt (which makes it worse), I added a str.replace pass that converts em dashes to commas. Sometimes the right engineering solution to an AI problem is a one-liner in Python.

**Feedback loop from approve/reject history.** The last 20 approved and 30 rejected topics are injected into future suggestion prompts. After a few rounds of rejections, the suggestions visibly shift toward the author's editorial preferences.

**Server-rendered Jinja2 over React/Next.js.** This is a local tool for one user. Server-rendered HTML with vanilla CSS and JSON polling over a JavaScript framework. Zero build step, zero JavaScript dependencies.

## The Build Story

Built over 18 days (March 7-25, 2026), entirely AI-assisted with Claude Code. The development followed a milestone-based approach with 7 brainstorm documents and 16 feature plans.

**Phase 1 (Days 1-5): Core pipeline.** Trend scraping, basic topic suggestion, outline generation, blog writing. The first drafts were technically correct but sounded like a different person wrote them.

**Phase 2 (Days 6-10): Voice fidelity.** Built the tone analyzer, scraped my Medium posts, extracted a writing fingerprint. Added few-shot exemplars alongside the abstract tone descriptors. This was the turning point: drafts started passing the "did I write this?" test.

**Phase 3 (Days 11-14): Editorial quality.** Integrated the Every.to style guide as a YAML config. Added the two-pass topic pipeline with strategic frameworks. Built the fact-checking system with indexed source lookup.

**Phase 4 (Days 15-18): Polish.** Hero image pipeline with physical-world metaphors, logo compositing, the feedback loop from approve/reject history, and the "ideas from link" feature.

**The failure that mattered:** Early versions used a blacklist approach for style enforcement ("don't use em dashes", "avoid clickbait titles"). This made the output worse. Claude would produce more em dashes when told not to. The fix was counterintuitive: switch to calibration pairs showing good vs. bad examples, and add a programmatic cleanup pass. The lesson applies broadly to LLM engineering: negative instructions are anti-patterns.

## Outcomes and What I Learned

Proxy metrics (no public users, this is a personal tool):
- **Topic-to-draft pipeline:** ~15 minutes vs. 3-4 hours manual
- **Voice consistency:** drafts require light editing, not rewrites
- **Fact accuracy:** automated source cross-referencing catches hallucinated claims before they reach the draft

What surprised me:

1. **Tone fingerprinting is undersold.** The combination of abstract descriptors + real paragraph exemplars produces dramatically better voice matching than either approach alone.
2. **Two-pass generation is worth the latency.** Separating creative generation from analytical framing produces better results than one sophisticated prompt.
3. **The feedback loop compounds fast.** After ~30 approve/reject decisions, topic suggestions shifted noticeably toward my actual editorial preferences.

## What I'd Do Differently

- **Alembic migrations from day one.** The inline ALTER TABLE approach works for a local tool but creates anxiety every time the schema changes.
- **Streaming writes.** The section-by-section writing approach was designed for streaming, but the current UI polls for completion. Real-time streaming would make the 3-5 minute writing step feel much faster.
- **A/B voice testing.** A feedback mechanism where the author rates voice fidelity per-section would allow continuous calibration.

## Project Stats

| Metric | Value |
|--------|-------|
| Build time | 18 days |
| Commits | 84 |
| Python source | ~10,700 lines |
| Trend sources | 9 |
| Pipeline stages | 7 |
| AI models used | Claude Sonnet, Claude Haiku, DALL-E 3 |
| Test files | 11 |
| Brainstorm docs | 7 |
| Feature plans | 16 |

| Layer | Technology |
|-------|-----------|
| Web framework | FastAPI + Jinja2 |
| Database | SQLAlchemy 2.0 async + SQLite (WAL) |
| AI / Writing | Anthropic Claude (Sonnet + Haiku) |
| AI / Images | OpenAI DALL-E 3 |
| Scraping | Playwright, feedparser, httpx, BeautifulSoup |
| Social APIs | Twitter/X v2, Reddit (PRAW), pytrends |
| Server | Uvicorn (localhost only) |
