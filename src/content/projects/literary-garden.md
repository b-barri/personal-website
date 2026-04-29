# Literary Garden

**A digitized intellectual orbit — Kindle highlights and vocabulary, grown as a private garden.**

Built in a weekend with Claude Code. Open sourced as a template. [github.com/b-barri/literary-garden](https://github.com/b-barri/literary-garden)

---

![Literary Garden — scrapbook walkthrough](/videos/projects/literary-garden/scrapbook_recording.mp4)

## TL;DR

- **What**: A static-site "garden" for your own Kindle reading — a spaced-repetition flashcard bed for vocabulary you looked up, and a scrapbook of passages you highlighted, surfaced as shareable postcards.
- **How**: Astro + Svelte + Tailwind, reading directly from Kindle's on-device `vocab.db` (SQLite) and `My Clippings.txt`. Vibe-coded over a weekend with Claude Code, following a brainstorm → plan → execute loop.
- **Result**: A daily five-minute ritual I actually use, and an open-source template anyone with a Kindle can clone. Private by construction — nothing leaves your laptop unless you choose to deploy it.

---

![Literary Garden — phone demo](/videos/projects/literary-garden/demo.mp4#phone)

## Why I Built This

There's an ineffable torpor that settles in months after you close a good book — every gorgeous word you once underlined quietly dissipates into the banality of the next chapter. You look up *equipoise* for the third time, crestfallen, and accept with quiet cynicism that your vocabulary retention sits somewhere between facile and non-existent.

Here's the thing: Kindle has been quietly hoarding all of it, right on the device, the whole time. Every word you tap goes into a small SQLite file (`vocab.db`). Every passage you highlight lands in a plain text file sitting next to it (`My Clippings.txt`). Years of reading, sitting there — no way to practice the words, no surface where yesterday's discoveries meet today.

I wanted an honest object for that. Not a reading tracker, not a Goodreads-adjacent profile. A garden: words you looked up start as seedlings, bloom while you're actively learning them, and press after twenty-one days of proven memory.

---

## The Problem

Existing tools all miss the middle: a reader's actual reading history *plus* their vocabulary growth, in a private, aesthetic surface.

| Tool | What's missing |
|---|---|
| Goodreads / StoryGraph | Track *what* you read. No vocabulary. No passage revisiting. Public-by-design. |
| Anki / other SRS apps | Flashcards, yes — but you're entering words by hand. Disconnected from the book. Zero aesthetic. |
| Readwise | Connects to Kindle highlights, but is a subscription SaaS. Your reading life lives on their server. |
| Kindle Vocabulary Builder itself | The data is there, but the UX is an unsorted flashcard deck on a 2011-era e-ink screen. No context, no retention design. |

I wanted the intersection: my actual Kindle data, spaced-repetition retention, an aesthetic that makes me want to open it, and **local-first** — my reading history is exactly that, mine.

---

## The Solution

Two beds, unified by aesthetic, separated by function.

| Bed | Purpose | Key move |
|---|---|---|
| 🌱 **Words bed** (`/practice`) | Daily vocabulary ritual | Each word you looked up becomes a flashcard with the Kindle sentence it came from on the back. Five new words a day. State-as-aesthetic: seedling → bloom → pressed. |
| 📖 **Scrapbook** (`/scrapbook`) | Wander and share | Horizontal spine carousel of every book you highlighted. Click a spine, the book opens on a 3D hinge; its passages fan out below. Any quote exports as a watercolor share card. |

**Before**: my Kindle's `vocab.db`, a locked SQLite file I couldn't see. Years of highlights in `My Clippings.txt`, unsearchable except via Ctrl-F on plain text.

**After**: a static site I open every morning, pull up five words, swipe through five recalls, close. Sometimes browse the scrapbook if I'm in the mood to send a passage to a friend.

![The words bed — cards in seedling, bloom, and pressed states](/images/projects/literary-garden/words-bed.webp)

![The scrapbook — spine carousel of highlighted books with the focused one bloomed open](/images/projects/literary-garden/scrapbook.webp)

---

## Technical Architecture

Static site. Two-tier: offline import pipeline, browser-side garden.

**Tech stack:** Astro 6 + Svelte 5 + Tailwind + better-sqlite3 + sharp + ts-fsrs + html-to-image. **Two runtime dependencies.**

```
┌─────────────────────────────────────────────────────────────┐
│  IMPORT PIPELINE (Node, offline, your laptop only)          │
│                                                             │
│  data/raw/vocab.db            ──┐                           │
│  data/raw/My Clippings.txt    ──┼→ scripts/import.ts        │
│  data/raw/*-overrides.json    ──┘   ├ parse Kindle formats  │
│                                     ├ reconcile duplicates  │
│                                     ├ fetch definitions     │
│                                     ├ resolve covers        │
│                                     └ extract spine colors  │
│                                                             │
│                    ↓                                        │
│  data/processed/*.json (gitignored)                         │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  ASTRO BUILD (static)                                       │
│                                                             │
│  Content collections load processed JSON →                  │
│  Svelte islands hydrate (client:only) →                     │
│  Words bed · Scrapbook · Share modal → dist/                │
└─────────────────────────────────────────────────────────────┘
                    ↓
           Vercel (optional, prebuilt upload)
```

**Why this shape**: the reader's data never leaves the laptop unless they choose to deploy. `data/raw/` and `data/processed/` are gitignored; the repo is a shareable template, not a snapshot of my library.

---

## Key Technical Decisions

**Static-first, not a web app.**
A full app would have spent energy on auth, storage, and hosting instead of aesthetics. Astro + Svelte islands costs about fifteen minutes to run locally; deploying is opt-in. I gave up cross-device sync (localStorage-only SRS state) but gained zero server cost, zero account creation, and a surface that stays working for a decade.

**FSRS, not SM-2.**
Anki's SM-2 is the well-known default but is known to underperform on new learners. FSRS (via `ts-fsrs`) adapts to your actual recall patterns. The three card states — seedling, bloom, pressed — are just a cosmetic projection of the FSRS difficulty/stability pair. I gave up familiarity but gained recall accuracy that matches modern research.

**State-as-aesthetic, not a progress bar.**
Most SRS apps render progress as a gamified bar. I made the card's *appearance* be its state: pale ink outline when new (seedling), full botanical illustration once in rotation (bloom), pressed-flower album once it's proven. I gave up "percent complete" affordances but gained a screen that rewards you without a single number on it.

**3D hinge carousel, not a flat cover grid.**
The scrapbook's spine carousel opens on a hinge — the focused book's cover rotates 28° out from its binding while the spine rotates −58° behind it. Inspired by adammaj.com's shelf. A grid would be more information-dense. I gave up density but gained a daily surface that feels like walking past a shelf rather than scrolling a feed.

**Manual overrides, not heuristic guessing.**
Both cover resolution (`cover-overrides.json`) and definitions (`definition-overrides.json`) fall through to a user-supplied JSON file when APIs fail. For sideloaded books Open Library doesn't index, or for words like "Dorchester" (the London hotel, per Rachel Cusk's *Outline*) no dictionary covers, the user gets a tiny escape hatch. I gave up "zero config" but gained: every book has a real cover, every word has a real meaning.

---

## The Design

![The share modal — watercolor share card with the book's spine color, the passage, and a personal wax-seal stamp](/images/projects/literary-garden/share-modal.webp)

The guiding principle is **function differs, form unifies.** Words and quotes share one visual language — warm cream paper, sage and sepia ink, faint watercolor washes, italic display type — while living in structurally different beds.

Three decisions shape that language:

1. **Paper, not screens.** The background is a layered radial-gradient plus SVG turbulence noise — the same ingredients used in print design, tuned to feel like a heavy cream cartridge paper. No bitmap images behind it, so it ships fast and stays crisp on retina.
2. **Spine color from the cover.** Every book cover is run through `sharp`'s histogram to extract the dominant color bucket. That color drives the spine in the carousel, the accent on its scrapbook detail page, and the border of its share card. The cover paints its own chrome.
3. **Watercolor share cards.** Any passage exports as a 1080×1350 PNG — rendered via `html-to-image` inside a hidden DOM node, sized for Instagram and WhatsApp, stamped with a personal wax seal. The passage, the book, the stamp — nothing else. The caption is deliberately warm: *"i thought this would resonate with you."*

---

## The Build Story

**Process: brainstorm → plan → phase → execute, each step witnessed by Claude Code.**

I built this over a weekend using a workflow that leans hard on AI judgement where it helps and human judgement where it matters.

| Phase | What came out |
|---|---|
| **Brainstorm** | A markdown doc capturing vision, scope, and key decisions before a single line of code. "State-as-aesthetic" and "function differs, form unifies" were both decided here. |
| **Plan** | One plan doc per milestone — words bed, scrapbook, share, BYOK template, cloner polish. Each plan names the files it'll touch and the risks. |
| **Phased execution** | One coherent feature per cycle, reviewed before the next starts. |

Total so far: 39 commits, ~11k lines of TypeScript + Svelte + Astro, 2 runtime dependencies.

**The failure story worth telling: the jitter.**

The scrapbook's spine carousel had a subtle bug I chased for hours. Clicking a book toward the right side would scroll, but the book would land visibly off-center, drift for a moment, then snap — a tiny visual hiccup that felt wrong.

I first assumed it was a scroll-snap issue. Tried three different CSS fixes. Nothing. Then I traced it properly: `scrollIntoView` reads the book's position at *t=0*, but the previously-focused book was CSS-transitioning its width from 210px to 42px over 620ms — shifting every book after it by 168px during the animation. The scroll aimed at a stale target.

The fix was: compute the scroll target from CSS tokens against the *resting* layout, not the live rect; suspend `scroll-snap-type` for the duration of the scroll; restore on `scrollend`. Three lines of insight, a day of debugging.

**The meta-lesson.** AI is great at executing plans quickly. It is not good at telling you a plan is wrong. That is still the human's job — and the places it's wrong usually look like hours of "why won't this work."

---

## Outcomes and What I Learned

No external users yet; proxy metrics:

- **Five-minute daily ritual.** Five new words plus due reviews. Opens fast enough to fit into the gap between coffee and a meeting.
- **166 words in rotation** from 22 of my own books. 154 definitions resolved directly via a public dictionary API, 9 rescued by a suffix-strip fallback I wrote when the Kindle's stemmer left forms like `penumbral` unlanded, 3 filled in by manual override for proper nouns no dictionary will ever index.
- **Roughly a weekend from blank repo to deployed**, plus polish nights.

Three meta-insights from the build:

1. **Vibe coding scales when you have an aesthetic brief.** Most AI code reviews get abstract. "Warm cream paper, watercolor wash, italic display type" is concrete. The AI can work against that brief, and I can tell when it's drifting.
2. **Private-by-default is a design choice, not just a security one.** The moment I made this local-first, every downstream decision got easier. No auth. No privacy policy. No user-data TOS. The feature set writes itself when the blast radius is "my laptop."
3. **Reading is a surface worth designing for.** There's no shortage of apps for tracking what you read. There are almost none for *what the reading did to you* — the vocabulary growth, the sentences you underlined, the shape of your thought. That's the space I want to keep pushing into.

---

## What I'd Do Differently

1. **Optional sync, carefully.** localStorage-only SRS state means losing your streak if you clear browser data. A small Vercel KV binding would fix it without compromising the local-first default. Scoped for v2.
2. **Seasonal views.** v2+ idea already scoped: monthly gardens with Midjourney-rendered backdrops, rendered through the month you first looked each word up. Deferred because v1 needed to ship.
3. **A better answer for sideloaded books.** Open Library plus Google Books covers about 85% of titles. The rest needs a `cover-overrides.json` entry by hand. A Goodreads lookup, or a local vision-model identify-book-from-filename pass, could close the gap.

---

## Try It Yourself

The repo is a clonable template. If you have a Kindle with Vocabulary Builder enabled:

```bash
git clone https://github.com/b-barri/literary-garden
cd literary-garden
pnpm install
# copy your Kindle's vocab.db + My Clippings.txt into data/raw/
pnpm seed
pnpm dev
```

Full walkthrough, including how to pull `vocab.db` off the Kindle itself, lives in the [README](https://github.com/b-barri/literary-garden#readme).

---

## Project Stats

| Metric | Value |
|---|---|
| Build time | ~1 weekend + polish nights |
| Commits | 39 |
| Runtime dependencies | 2 (`html-to-image`, `ts-fsrs`) |
| Lines of TypeScript / Svelte / Astro | 11,135 |
| Words in my garden | 166 |
| Books in my scrapbook | 23 |
| Highlights preserved | 213 |
| Hosting cost | $0 (Vercel free tier, optional) |

| Layer | Stack |
|---|---|
| Site framework | Astro 6 (static output) |
| UI islands | Svelte 5 (runes) |
| Styling | Tailwind + hand-written CSS tokens |
| Import pipeline | Node + `better-sqlite3` + `sharp` |
| Spaced repetition | `ts-fsrs` |
| Share-card render | `html-to-image` + SVG foreignObject |
| Deploy | Vercel (optional, `--prebuilt` upload) |
