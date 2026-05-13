# Mockingbird

**A senior PM interviewer that lives in your laptop — voice-first, tension-aware, built in a weekend.**

[github.com/b-barri/mockingbird](https://github.com/b-barri/mockingbird) · 14 commits · 187 tests · 13 docs · one shipped feature pivot

---

![Mockingbird — landing](/images/projects/mockingbird/hero.png)

## TL;DR

- **What** — A voice-based PM interview practice tool. You pick a case, Alex (the AI interviewer) reads it, you talk through your answer, and afterward you get the kind of feedback a real senior PM would give: anchored to specific moments, tension-grounded, no checklist grading.
- **How** — Next.js + Anthropic Claude + a swappable voice provider layer (Sarvam Bulbul / Saaras + Cartesia Sonic). Built end-to-end with Claude Code as a collaborator across brainstorm → plan → ship → dogfood → iterate loops.
- **Result** — A working product, 30 Product Design cases (most India-context), and a decision history you can read as a PR — including the time the AI doc-review caught me shipping a half-true architectural claim.

---

## Why I built this

There's a kind of PM interview prep that's expensive: $200 an hour for a coach who used to work at Stripe. There's a kind that's free: question banks on Reddit, Exponent's free tier, a friend who's willing. And then there's the kind that doesn't exist yet — a senior PM in your laptop, who listens, probes, and afterward tells you what you actually missed.

The fastest way to demonstrate I think like a PM was not to write a deck about thinking like a PM. So I built the thing.

---

## The problem

Existing PM interview prep falls into three buckets:

1. **Human coaches.** Best quality. Expensive. Scheduling friction. Indian PM candidates often can't access US-based senior PMs at all.
2. **Practice partners.** Cheap. Inconsistent. A friend can run a case at you, but they can't probe like an interviewer who's done 200 of these.
3. **AI tools.** Cheap, available, but the existing ones read like resume-bot adjacent — generic feedback ("good structure"), checklist scoring, no sense of *what* you specifically just said.

The gap: a voice-first practice tool that gives feedback like a senior PM, not like a graded test.

![Onboarding — paste your Anthropic key, optionally a Sarvam or Cartesia key for voice](/images/projects/mockingbird/onboarding_1.png)

![Onboarding step two — pick your interviewer mode and voice provider](/images/projects/mockingbird/onboaridng_2.png)

---

## The solution

Mockingbird is built around one product opinion: **the eval rubric should be the case's tensions, not a generic framework checklist.**

Every case in the bank is authored with named tensions — the real trade-offs the case is testing. "Design Instagram for teen mental wellbeing" tests engagement vs harm. "Design a UPI feature for small merchants" tests reconciliation vs settlement vs trust. The post-session feedback grades how well you engaged each side of that case's specific tension, not whether you hit some abstract "step 4 of CIRCLES."

![The case bank — 30 cases, ~70% India-context](/images/projects/mockingbird/choose_case.png)

![A live session with Alex — voice-first, transcript on the right](/images/projects/mockingbird/interview.png)

A concrete example. After a 30-minute session where the candidate engaged engagement-side features deeply but never mentioned harm:

```
Customer focus    [STRONG]     Named teens 14-17 sharply, anchored the rest.
Structure         [STRONG]     Moved user → needs → solutions cleanly.
Engagement side   [STRONG]     Named multiple specific levers with rationale.
Harm side         [MISSING]    Comparison anxiety, body image, sleep — never reached.

What worked
In framing the customer, you sharply named teens 14-17 as your target — that
anchored the rest of your answer. Your prioritization of engagement levers
was concrete and actionable.

What was missed and could have been better
You missed the harm side of the case's engagement-vs-harm tension entirely.
A stronger answer would have led with 'who could this hurt and how' before
optimizing engagement levers.
```

The candidate sees their actual session reflected back at them with judgment they can act on. No score. No grade. Just: here's what worked, here's what a stronger PM would have done.

![Post-session feedback — dimension cards above tension-grounded prose](/images/projects/mockingbird/feedback1.png)

![Feedback continued — what worked, what was missed, with concrete moments cited](/images/projects/mockingbird/feedback2.png)

The case bank is 30 cases deep, ~70% India-context (UPI, Swiggy, Blinkit, IRCTC tatkal, Zerodha onboarding, Indian joint-family Netflix). The voice layer is provider-pluggable so the same product can run on Sarvam Bulbul + Saaras *or* Cartesia Sonic + Ink-Whisper, which doubles as an empirical testbed for which is better at Indic-native voice.

---

## The build story

I'll be honest about the workflow because it's the actual interesting part. This was built with Claude Code (Anthropic's CLI agent) as a collaborator. The pattern that worked:

**Brainstorm first.** Before touching code, I'd brainstorm scope and product decisions with an agent acting as a thinking partner — questioning premises, surfacing the smallest version that delivers value, recording the decisions in a requirements doc. The brainstorm for the tension-grounded feedback model walked through three real options (silent framework scaffolding, case-specific tensions, pure transcript observation) and locked in the choice before any code was written.

**Plan separately.** Implementation planning is its own phase. The plan doc names units of work, file paths, test scenarios, key technical decisions with rationale. When the plan was reviewed by agent-personas (coherence, feasibility, product-lens, adversarial), two of them cross-confirmed the same finding: one of my "decoupling" claims was performative — the doc said the framework library was decoupled, but the code still injected it into the interviewer prompt every session. That review caught it before I wrote a single line.

**Ship in atomic commits.** Each implementation unit was one focused commit with passing tests. Four units shipped the core feature: a case-eval-rubric field on every case, the prompt threading, the LLM output rewrite, the framework library decoupling. 9 commits, ~600 lines, 187 tests green.

**Dogfood, then iterate.** The build wasn't done after shipping. Three real bugs surfaced during dogfood:

- **The input-mode coercion.** If you'd given a voice key at onboarding, you couldn't switch to text mid-session. There was no UI for it. I'd missed this in the spec — surfaced when I tried to dogfood with my mic off. Fix: a segmented "🎤 Voice / ⌨ Text" pill at the top of the session stage. Real product evolution from real use.

- **The stale README.** After decoupling the framework library, the README still claimed "framework-aware probes" as a feature. The product had changed; the front-door description hadn't. Caught when I noticed I was about to push to a public-ish repo with a tagline that lied about what the product did.

- **Two Embers at once.** When I added a sleeping Ember mascot to the pre-start view, the existing blinking-Ember mascot in the viewport corner didn't go away. Two of the same character on screen at once. Subtle, but the kind of thing that signals "this product was shipped fast and nobody re-looked." Fix: unify the mascot into one state-aware component that transitions through frames as the session state changes (sleeping → blinking → reacting). One character, three poses, smooth transitions. The mascot art (and most of the in-product imagery) was generated in Midjourney against a tight brand brief — warm sepia palette, hand-drawn linework, a single recurring character with consistent silhouette across states.

![Ember — one mascot, three state-driven poses](/images/projects/mockingbird/ember_intro.png)

The pattern across all three: the AI shipped what I asked. I caught what I didn't ask for. The combination is what made this fast.

---

## Key decisions

**Case-specific tensions over universal PM craft dimensions as the eval spine.** I considered three alternatives (silent framework scaffolding, universal craft dimensions, pure observation). Case tensions are more concrete and harder for the LLM to fake, but they make the case `brief` field load-bearing — every case needs a richly-authored eval rubric. Gave up: lower authoring overhead for new cases. Gained: feedback that names the specific tension a candidate is being tested on.

**Realistic interviewer over active coach.** Alex never steers candidates toward missed tensions during the session — even when he knows. Two interpretations of the product live in this choice: "simulation-grade interview rehearsal" (what I picked) versus "live-coaching during a mock case" (the path I rejected). Gave up: learning per session for less-experienced candidates. Gained: fidelity, and the cleaner post-session feedback texture that comes from one-shot evaluation rather than mid-session contamination.

**Dimension cards + tension prose, after starting with prose-only.** The original spec excluded scorecards explicitly — they'd re-introduce the checklist-feel I was trying to escape. Then I dogfooded the prose-only output and realized: substantively right, but visually flat. A candidate scanning the summary couldn't quickly see *which* dimensions were strong. So I reversed: added 4 dimension cards (verdict words only, no numbers) above the prose. Documented the reversal as a formal amendment to the requirements doc — the kind of decision history a PM should be able to defend later. Gave up: scope purity. Gained: scannability without going numeric.

**Two voice providers behind one abstraction.** Sarvam (Indic-native) and Cartesia (latency-optimized, English-first) both wired in from day one. Gave up: shipping speed (could have shipped with one and added the other later). Gained: empirical comparison — a write-up I'm publishing alongside this case study compares them on Indic naturalness, code-switching, and cost. The architecture is the testbed.

**BYO API keys (candidate brings their own).** No server-side cost, no rate-limit math, no PII storage. Onboarding takes 90 seconds to paste two keys. Gave up: frictionless first-run. Gained: zero ops cost and a credible privacy story.

---

## What I'd do differently

- **Real users earlier.** I dogfooded against myself but didn't put this in front of five PM candidates before iterating. Sample size of one is a dangerous baseline.
- **Voice provider bakeoff first.** I built both voice providers but haven't run the structured comparison yet. The right order was probably: empirical comparison → pick primary → ship. I shipped first because momentum was the constraint, but in retrospect I'm sitting on data I could have gathered for the decision.
- **Smaller initial case bank.** I authored 30 cases before validating the eval-rubric format. When the rubric format shifted post-dogfood, I had to retrofit. The 80/20 was 3 cases, ship the feedback, iterate on rubric shape, then backfill.

---

## What I learned

Three things, ordered by how surprised I was.

**The AI catches what you write down, not what you mean.** The performative-decoupling finding I mentioned above — the framework library "decoupling" that wasn't real — was caught because I'd written the requirement down precisely enough for an agent reviewer to grade the code against it. If I'd kept the requirement in my head, the gap would have shipped.

**Dogfooding is the only test that matters.** Three real bugs (input coercion, README drift, mascot duplication) surfaced during use that no test would have caught. Tests prove code correctness. Dogfooding proves product correctness. They are not the same.

**Speed is a function of when you stop and think, not how fast you type.** The fastest part of this build was the typing — agents are quick. The slowest and most valuable part was the brainstorm phase, where I forced myself to write down what success looks like before naming files. Every minute spent in brainstorm saved an hour of iteration.

---

## Try it yourself

```bash
git clone https://github.com/b-barri/mockingbird
cd mockingbird
pnpm install
pnpm dev
```

Open http://localhost:3000, paste an Anthropic API key (optionally a Sarvam or Cartesia key for voice), pick a case. The first session takes ~30 minutes; the feedback at the end takes ~10 seconds to generate.

The PR with the most interesting commit history is here: [github.com/b-barri/mockingbird/pull/1](https://github.com/b-barri/mockingbird/pull/1) — reading it top-to-bottom is the version of this case study a technical PM would actually want.

---

## Project stats

| Metric | Value |
|---|---|
| Build time | One weekend (~25 hours) |
| Commits on the feature branch | 14 |
| Tests | 187 (all passing) |
| Cases authored | 30 (70% India-context) |
| Implementation units | 9 (per the plan doc) |
| Decisions documented | 5 key technical + 3 product reversals |
| Lines of code | ~5,400 |
| Lines of design docs | ~1,400 |

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind, TypeScript |
| LLM | Anthropic Claude Sonnet 4.6 (interviewer + coach) |
| Voice | Sarvam Bulbul + Saaras, Cartesia Sonic + Ink-Whisper |
| Brand & art | Midjourney (Ember mascot, in-product imagery) |
| Testing | Vitest, Playwright |
| Deploy | Vercel (edge runtime for voice/LLM proxies) |

---

*Built by [Bhavya Barri](https://x.com/bhavya_barri). May 2026.*
