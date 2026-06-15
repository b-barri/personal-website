# Mockingbird

**A senior PM interviewer that lives in your laptop. Voice-first, tension-aware, built in a weekend.**

[github.com/b-barri/mockingbird](https://github.com/b-barri/mockingbird)

![Mockingbird, the landing screen](/images/projects/mockingbird/hero.png)

## The senior PM who doesn't exist

PM interview prep comes in three flavors. Expensive: $200 an hour for a coach who used to work at Stripe. Free: question banks on Reddit, a friend willing to run a case at you. Cheap and available: AI tools that grade like a resume bot, generic "good structure," a checklist score, no sense of what you actually said. Indian candidates often can't reach a US-based senior PM at all.

The interesting one is the option that doesn't exist yet: a senior PM who lives in your laptop, listens while you talk through a case, probes, and afterward tells you what you missed. The fastest way to show I think like a PM wasn't to write a deck about thinking like a PM. It was to build the senior PM.

## Feedback graded on the case's tensions, not a checklist

Mockingbird runs on one product opinion: you should be graded against the case's real trade-offs, not a generic framework. Every case is authored with its named tensions. "Design Instagram for teen wellbeing" is testing engagement against harm. "Design a UPI feature for small merchants" is testing reconciliation against settlement against trust. The feedback grades how well you engaged each side of that specific tension, not whether you recited step four of CIRCLES.

![The case bank: 30 cases, about 70 percent India-context](/images/projects/mockingbird/choose_case.png)

You pick a case, Alex (the AI interviewer) reads it aloud, and you talk through your answer.

![A live session with Alex, voice on one side, transcript on the other](/images/projects/mockingbird/interview.png)

Afterward you get the kind of note a real senior PM would leave. Here is the actual output after a session where the candidate worked the engagement side hard and never mentioned harm:

```
Customer focus    [STRONG]     Named teens 14-17 sharply, anchored the rest.
Structure         [STRONG]     Moved user, needs, solutions cleanly.
Engagement side   [STRONG]     Named multiple specific levers with rationale.
Harm side         [MISSING]    Comparison anxiety, body image, sleep, never reached.

What worked
In framing the customer, you sharply named teens 14-17 as your target, which
anchored the rest of your answer. Your prioritization of engagement levers
was concrete and actionable.

What was missed and could have been better
You missed the harm side of the case's engagement-vs-harm tension entirely.
A stronger answer would have led with 'who could this hurt and how' before
optimizing engagement levers.
```

No score. No grade. Just what worked, and what a stronger PM would have done, anchored to specific moments.

![Post-session feedback: verdict cards above tension-grounded prose](/images/projects/mockingbird/feedback1.png)

![The feedback continues, citing concrete moments from the transcript](/images/projects/mockingbird/feedback2.png)

Under the hood it's a [[Next.js::a popular framework for building websites with React]] app talking to [[Claude::Anthropic's AI model, here doing both the interviewing and the grading]], with a swappable voice layer so the same product can speak through [[Sarvam Bulbul and Saaras::Sarvam's Indian-language voice models, for natural Hindi and Indic speech]] or [[Cartesia Sonic::a fast, English-first voice model]]. Running two providers behind one switch doubles as an experiment in which is better at Indic-native voice. The 30 cases lean Indian: UPI, Swiggy, Blinkit, IRCTC tatkal, Zerodha onboarding. You bring your own API keys, so there's no server cost, nothing personal stored, and a 90-second setup.

![Onboarding: paste your Anthropic key, optionally a Sarvam or Cartesia key for voice](/images/projects/mockingbird/onboarding_1.png)

![Onboarding step two: pick your interviewer mode and voice provider](/images/projects/mockingbird/onboaridng_2.png)

## The decision that defined the product

Alex never steers you toward a tension you're missing, even when he can see you walk past it. That was a real fork: a realistic interview rehearsal, or a live coach who helps you mid-case. I picked rehearsal. You lose the in-the-moment teaching, but you gain fidelity, and cleaner feedback at the end, because the evaluation isn't contaminated by hints Alex dropped along the way.

One reversal I'm glad I made. The original spec banned scorecards on purpose, since a card full of grades smuggles back the checklist feeling I was trying to kill. Then I used the prose-only version myself, and it was right but flat. You couldn't scan it. So I added four verdict cards above the prose: words only, no numbers, enough to see the shape at a glance without turning it into a test. I logged the reversal as a formal amendment to the requirements doc, the kind of decision history I should be able to defend later.

## When dogfooding fought back

Three bugs surfaced from actually using the thing, none of which a test would have caught. If you'd given a voice key at setup, you couldn't switch to text mid-session, there simply was no button for it (found the first time I practiced with my mic off). The README still advertised a "framework-aware" feature I had already removed. And when I added a sleeping mascot to the start screen, the old blinking one didn't leave, so two of the same character sat on screen at once. Tests prove the code is correct. Dogfooding proves the product is. Those are not the same thing.

![Ember, one mascot resolved into three state-driven poses](/images/projects/mockingbird/ember_intro.png)

The fix for the last one was to unify the mascot into a single state-aware character that moves through poses as the session changes: sleeping, blinking, reacting. The art was generated in [[Midjourney::an AI image generator]] against a tight brief: warm sepia, hand-drawn linework, one recurring character with a consistent silhouette.

## What I learned working with AI

The sharpest lesson came from a claim I almost shipped. My plan doc said the framework library was "decoupled" from the interviewer. When I had agent reviewers grade the code against my own written requirements, two of them independently caught that it wasn't: the code still injected the framework into every session's prompt. The AI catches what you write down, not what you mean. Had that requirement stayed in my head instead of on the page, the half-true claim would have shipped.

The other lesson is about speed. The fastest part of this build was the typing, because the agent is quick. The slowest and most valuable part was the brainstorm before any code, forcing myself to write down what success looked like before naming a single file. Every minute there saved an hour later. The whole thing came together over one weekend: nine commits, 187 passing tests, thirty cases.

## Try it

```bash
git clone https://github.com/b-barri/mockingbird
cd mockingbird
pnpm install
pnpm dev
```

Open the local site, paste an Anthropic key (and optionally a Sarvam or Cartesia key for voice), and pick a case. A session runs about 30 minutes; the feedback takes about 10 seconds to generate.

If you'd rather read the build than run it, [pull request #1](https://github.com/b-barri/mockingbird/pull/1) top-to-bottom is the version of this story a technical PM would actually want.
