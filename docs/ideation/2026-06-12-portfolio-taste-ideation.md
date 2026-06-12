---
date: 2026-06-12
topic: portfolio-taste-improvements
focus: creative, FUN, playful ideas — user rejected content-strategy optimizations; clawd mascot is the approved anchor
mode: repo-grounded
---

# Ideation v2: Make the Portfolio Fun (clawd-first)

**Steer from Bhavya:** round 1 produced content-strategy ideas (decision-led cards, ship's log, colophon, field notes). All rejected: *"I only like the clawd idea and nothing else. I want creative fun stuff, not optimizations."* Round 2 regenerated with pure fun/whimsy frames: clawd universe, game mechanics, surprise & delight, site-as-playable-demo.

## Grounding (what makes these buildable)

clawd-touchbar ships ten sprite states with a tool-aware mapping (bash → typing, write → building, read → reading, plus sleeping/waking/celebrating/error/idle poses) — his own AGPL pixel art, state machine already designed. Hero photos are the same Bangalore tabebuia street at day and twilight (`src/components/sections/Hero.tsx`). Graph-paper texture at 32px is the site's signature (`src/app/globals.css`). GSAP + Framer Motion already wired. Art carousel holds 12 of his own watercolors/photos. "Side Quests" is already the projects-grid heading. 404 currently says "This side quest doesn't exist yet" — a promise the page doesn't keep.

## Ranked Ideas

### 1. clawd, resident of the site (the spine)

**Description:** clawd lives on a thin "stage strip" pinned to the bottom of the viewport — deliberately echoing the Touch Bar proportions, drawn on the graph-paper texture. He reacts to the *visitor's* session the way the real product reacts to Claude's: reading sprite while you're in Writings, building sprite near the projects grid, drowsy after 60–90s idle then curls up asleep (tab blur = instant nap; your scroll wakes him with the "!" sprite). He's pettable (click → happy jump) and **grabbable**: drag him off his strip and he flails, falls with GSAP gravity, bounces, plays the downed sprite, then walks back with wounded dignity; do it three times and he sleeps in protest. Hover project cards and he reacts in character — headphones for Mockingbird (voice), reading for Literary Garden, and for his own clawd-touchbar card he stops, faces you, and celebrates. Layers that ride along: a **living favicon** (idle animation at 2fps; switch tabs and the favicon swaps to sleeping clawd with title "clawd is napping — Bhavya Barri"), localStorage memory ("clawd remembers you" on return visits — no guilt mechanics), and a hidden **field-guide lore page at /clawd** (click him 3 times and he leads you there: the ten states catalogued like species plates, "*Clawdus errorus* — observed after failed tool calls; approach gently", sprite sheet as museum exhibit, AGPL attribution framed as adoption papers).
**Warrant:** `direct:` the sprite vocabulary and state machine exist 1:1 in his shipped project — the port swaps the event source from Claude Code hooks to DOM events (IntersectionObserver + idle timers). `external:` Shimeji desktop pets / oneko (drag-and-toss is THE canonical pet interaction); Discord Wumpus & GitHub Mona lore pages; Animal Crossing recognition charm.
**Rationale:** The approved idea, executed as the site's nervous system rather than a static embed. A recruiter who watches a pixel crab fall asleep because *they* stopped scrolling experiences the actual shipped product without installing anything. "The PM with the little crab" is the recall hook.
**Downsides:** Needs restraint tuning (peripheral, never interrupting); reduced-motion fallback required.
**Confidence:** 90% **Complexity:** Medium **Status:** Approved (Bhavya: LOVE THIS)

### 2. The site keeps Bangalore time and weather

**Description:** Three ambient layers that make the site a *place*: (a) **clawd keeps IST** — visit during Bangalore's night and he's asleep under a tiny moon; click him and he wakes annoyed for one beat ("clawd keeps Bangalore hours, even if you don't"). (b) **Phenology engine** — during the real tabebuia window (late Dec–Feb) pink petals drift down the hero; click the hero and a handful shake loose with flutter physics, piling sweepably at the bottom edge; June–Sept, a no-key Open-Meteo check adds soft rain streaks when it's actually raining in Bangalore ("it's raining in Bangalore as you read this"). Rest of the year: nothing — the scarcity is the point. (c) **Sunset wipe** — the theme toggle becomes a two-second Bangalore dusk: radial sweep from the toggle (View Transitions clip-path), hero crossfades day-street → twilight-street through an orange-pink instant; light mode reverses it as sunrise.
**Warrant:** `direct:` both hero photos are the same street at day and twilight and the caption already names the tabebuia bloom — the assets ARE the transition narrative; sleeping/waking sprites exist. `external:` linusrogge.com's live weather widget is screenshotted precisely because "the site knows my sky" feels alive; Animal Crossing's clock-honesty charm.
**Rationale:** Quietly communicates "Bangalore" through delight instead of a location pin; restraint (effects only when true) reads as craft. Petals one month a year is a reason to come back.
**Downsides:** Seasonal features are unverifiable most of the year (mitigate via the console cheat in idea 6); weather fetch needs a silent failure path.
**Confidence:** 85% **Complexity:** Medium **Status:** Unexplored

### 3. The Quest Log and the secret sixteenth quest

**Description:** Take "Side Quests" literally as a *mechanic*, not a heading. A small Quest Log in the nav: every project page you actually visit gets a pixel wax-seal stamp pressed in with a GSAP thunk. The log shows the project slots plus one drawn in dotted outline labeled "???". Complete them all and the dotted slot ignites, unlocking a route that exists nowhere in the nav — a hidden room. Fold in the point-and-click secret: one of the twelve paintings in the art carousel has a barely-visible pixel doorknob worked into its frame; click it and the painting swings open onto The Back Room — sketches, scrapped v1s, one unlisted artwork. clawd occasionally paws at that painting if you idle near the art section.
**Warrant:** `direct:` the grid is literally named "Side Quests" and the registry has the entries; the carousel is the one section with zero interactivity today. `external:` completion mechanics are the cheapest retention device (Josh Comeau's chained widgets); the painting-conceals-a-door is canonical adventure-game grammar; secrets are the highest-retention mechanic — finders tell people.
**Rationale:** Converts skimming into completionism — a recruiter who'd read 2 case studies now has a reason to open all of them, and the person who finds the Back Room screenshots it.
**Downsides:** Needs the hidden room to actually be worth finding; localStorage only (fine).
**Confidence:** 80% **Complexity:** Medium **Status:** Liked — needs a visual prototype before commitment

### 4. Wet-brush cursor over the art

**Description:** Entering the art section, the cursor becomes a small watercolor brush. Moving across a painting leaves a translucent wet smear — pigment sampled from the pixels under the cursor, bleeding outward, then "drying" (fading) over \~4 seconds so the artwork always recovers. Fast strokes splatter tiny droplets.
**Warrant:** `direct:` the carousel renders his own watercolors — the metaphor is literal. `reasoned:` one offscreen canvas with destination-over compositing + per-frame alpha decay is a well-trodden \~100-line technique; pigment sampling via drawImage keeps it on a canvas budget.
**Rationale:** The one effect that makes someone show a colleague: "touch his paintings, they're still wet." Connects the artist and builder identities in a single gesture.
**Downsides:** Touch devices need a tap-equivalent; must respect reduced motion.
**Confidence:** 80% **Complexity:** Low–Medium **Status:** Liked

### 5. Console love letter + the `bhavya` cheat console

**Description:** Open devtools and a styled banner renders ASCII clawd plus "you opened the hood. I like you already." then hints `bhavya.help()`. Commands: `bhavya.petals()` (forces the tabebuia bloom out of season — the only way to see it in June), `bhavya.clawd('celebrate')` (puppets the mascot), `bhavya.resume()` (opens the PDF), `bhavya.hire()` (mailto with prefilled subject). Stretch: a Konami code flips a third secret theme — green-phosphor CRT "arcade mode" with the projects grid as a level-select screen.
**Warrant:** `external:` console easter eggs are an established hiring-funnel device (Google careers console pitch, Flickr, Riot); Konami tradition. `direct:` cross-wires ideas 1 and 3 — the petal-forcing command makes seasonal scarcity discoverable instead of merely missable.
**Rationale:** The exact people he wants (technical founders, eng-adjacent recruiters) are the only people who open devtools. \~2 hours of work for a disproportionate "this person gets it" signal.
**Downsides:** Invisible to non-technical visitors (that's fine — it's a handshake, not a feature).
**Confidence:** 85% **Complexity:** Low **Status:** Unexplored

### 6. The Touch Bar playground (clawd's natural habitat)

**Description:** A rendered MacBook keyboard-deck strip on the clawd-touchbar project page (or homepage footer): a tiny fake Claude Code terminal above a pixel-perfect Touch Bar where clawd lives. Visitors click or type canned commands — `run tests`, `read file`, `git push` — the terminal plays a scripted response while clawd cycles his real states: typing for bash, building for write, celebration on success, asleep if you idle. Not a video of the product — the product, re-hosted.
**Warrant:** `direct:` sprite sheet + ten-state hook mapping are shipped in his own repo; porting the state machine to canvas is a contained build. `external:` henryheffernan's fake-OS portfolio is the most-remembered portfolio mechanic of the last five years; teenage engineering product pages win by giving you one physical-feeling object to fidget with.
**Rationale:** The maximal version of the approved idea: a recruiter who plays with the Touch Bar for 20 seconds understands "this person ships real native software for fun" without reading a word.
**Downsides:** The biggest single build on the list; sequence it after ideas 1–2 prove the appetite.
**Confidence:** 75% **Complexity:** Medium–High **Status:** Unexplored

## Honorable mentions (good, not this round's spine)

* **404 = clawd's house / quest map**: pixel room where you've caught clawd off duty, "roll a d20" button teleports you to a random project. Cheap, screenshot-worthy — fold into idea 1's build when the 404 gets touched.

* **Re-rank my resume**: recruiter pastes their JD, resume bullets visibly re-sort using the real Resume Optimizer scoring (+2.0 skill match etc.), FLIP-animated. The one toy that does real work for the visitor — revisit if the job hunt wants a sharper hook.

* **Visit Garden**: dwell-tracked reading grows a Literary-Garden-style patch (seedling → bloom → pressed); at exit it offers a watercolor pull-quote postcard — the one line you lingered on longest, set on a wash sampled from his paintings, with a small "from bhavya's garden" mark. The reader walks away with their own takeaway made beautiful — a quote card, not a report card.

* **The Roast Booth**: paste one product sentence, two pixel-art experts from PRD Auditor's 279-avatar collection argue about it via a canned rules engine.

* **One Tatkal Question**: 90-second canned Mockingbird case with tension-grounded feedback.

* **Hover-to-hear in nine languages**: pre-generated Bulbul clips pronounce his name/greeting — "voices by Bulbul, I PM this at Sarvam."

* **Web Audio sound identity**: opt-in synthesized chimes (theme-toggle dusk chime, clawd purr) — zero KB, voice-PM-on-brand.

## Rejected this round

| Idea                                            | Reason                                                                                |
| :---------------------------------------------- | :------------------------------------------------------------------------------------ |
| Live wire (clawd mirrors Bhavya's real session) | Cut by Bhavya: infra overhead and hard to explain to visitors                         |
| Side Quest Gachapon (capsule machine)           | Charming but overlaps the Quest Log's discovery job; bigger build for the same payoff |
| RPG character sheet About section               | Content-shaped despite the costume; highest gimmick risk of the set                   |
| Spine Shelf (real books carousel)               | Good, but a port of existing UI rather than new delight; later                        |
| Tamagotchi visit-memory as standalone           | Folded into idea 1 (localStorage memory layer)                                        |
| Living favicon as standalone                    | Folded into idea 1                                                                    |
| Sunset wipe as standalone                       | Folded into idea 2 (Bangalore time and weather)                                       |

## Round 1 record (all rejected by user as "optimizations")

Decision-led Quest Log cards · self-updating ship's log · field notes + "Tensions I Hold" · `<Artifact>` component · colophon · museum-labeled art room. Full round-1 doc preserved in git history of this file and in `/tmp/compound-engineering/ce-ideate/3d35b30c/survivors.md`.

## Coherence note

Ideas 1, 5, and 6 share the sprite-engine system; ideas 2 and 5 share a small ambient scene/season store. Build order that compounds: **1 → 2 → 5**, then 3 (after a visual prototype) and 4, then 6 as the capstone.
