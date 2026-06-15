# Lenny's War Room

**An AI PRD auditor. Paste your strategy, get it stress-tested by 279 product experts.**

Built in a single day with Claude Code. [Try it here](https://lenny-war-room.vercel.app/)

![War Room landing: drop your PRD, get the truth from 279 product experts](/images/projects/prd-auditor/lenny.png)

## "Looks good" is not feedback

After writing dozens of PRDs as a PM, I kept hitting the same wall. The feedback was nonexistent, vague, or one person's opinion. I'd spend a week on a strategy doc, share it, and hear back "looks good" or "the metrics section needs work," with zero specifics.

Meanwhile I'd spent years on Lenny Rachitsky's podcast and newsletter, where product leaders share specific, named frameworks for strategy, metrics, and growth. Shreyas Doshi's LNO framework, Teresa Torres on continuous discovery, all of it genuinely good, and all of it locked inside 289 transcripts and 349 articles nobody has time to cross-reference against their actual work. The question I couldn't shake: what if that knowledge were operational? Not something you read, but a tool that applies those frameworks directly to your PRD.

## Three kinds of feedback

The War Room gives you a PRD review in three flavors. **Analyze** scores nine sections, highlights weak phrases, and offers one-click rewrites, where each annotation teaches the expert's framework first, then shows how it applies to your text. **Red Team** matches two to five experts to your PRD's topics and has them debate your strategy, referencing and challenging each other rather than delivering parallel monologues. **Expert Review** runs one expert across your whole doc, organized by their own thinking tools rather than generic categories.

![Analyze mode: PRD draft on the left, expert-grounded annotations on the right](/images/projects/prd-auditor/image.png)

A concrete run. You paste a PRD for a notifications feature. The scorecard rates your Problem Statement 8/10 but your North Star Metric 3/10, and the annotation on the phrase "increase DAU" explains:

> "Shreyas Doshi's LNO Framework classifies metrics as Leverage, Neutral, or Overhead. DAU is Neutral, it describes activity but doesn't predict outcomes. A Leverage metric would be notification-driven task completions, which directly connects user engagement to the feature's value."

One click accepts the rewrite, the PRD updates, and after a couple of edits a nudge appears to re-analyze and watch the score move.

![Red Team Council: experts matched to the PRD's topics, ready to debate](/images/projects/prd-auditor/image2.png)

![Red Team Debate: experts reference and challenge each other](/images/projects/prd-auditor/image1.png)

![Lenny's Verdict: the debate distilled into Area, Issue, Action](/images/projects/prd-auditor/image3.png)

The knowledge base behind it was built from Lenny's content (sourced as a paid subscriber, processed on my own machine): 289 podcast transcripts and 349 newsletter articles, distilled into 279 experts and 119 named frameworks, for about $0.40 in API calls. The app itself is [[Next.js::a popular framework for building websites with React]] with a deliberately split brain: heavy reasoning (the analysis, the debates) runs on the stronger, slower [[Claude Sonnet::Anthropic's mid-tier model, good at careful reasoning]], while fast, cheap jobs like matching experts to your topics run on [[Claude Haiku::Anthropic's small, fast, inexpensive model]]. Matchmaking needs speed and costs pennies; a real framework-grounded review needs the depth.

![The system architecture: frontend modes, a state store, API routes, and the Claude API](/images/projects/prd-auditor/tech_architecture.png)

## The decisions that shaped it

I made it **teach, then apply**. An annotation could just say "your metric is bad." Instead each one explains the framework generically, then applies it to your specific text. You lose brevity, you gain a reusable framework instead of a one-time fix.

It's [[BYOK::bring your own key, meaning you paste your own Anthropic API key instead of using mine]], with the key held in a [[secure cookie::an httpOnly cookie, a kind of cookie that JavaScript on the page can't read, so it can't be stolen by a malicious script]] and never logged or stored on any server. I gave up easy onboarding and gained zero backend auth, no API cost exposure, and the freedom to deploy publicly without worrying about abuse.

And the debate's typing animation is faked. The experts appear to type word by word, but the whole conversation is generated in one call and revealed by a client-side animation. A code review flagged real streaming as high complexity for low value, and it was right: the fake version already feels great.

My favorite bug: accepting a rewrite originally used JavaScript's text-replace, which treats a `$` as a special character. So a rewrite containing "$50M ARR" produced garbage. The fix was to splice the text by position instead of pattern-matching. A correctness bug an AI code review caught before it ever shipped.

## Pixel art meets product rigor

Product work is serious enough that the tool critiquing your PRD doesn't have to be. The whole interface is a retro game: a pixel font for headers, 279 pixel-art expert avatars, RPG-style score badges, and "War Room" and "Red Team" metaphors throughout. Every expert you meet gets added to a Guest Collection, 279 to collect, tracked by a little treasure chest in the header.

## What I learned working with AI

Three things stuck. First, prompt engineering is the new product design: maybe 80% of this build wasn't code, it was getting the prompts right, because the gap between generic advice and a grounded, framework-specific critique lives entirely there. Second, AI code reviews catch real bugs, run in parallel across angles (correctness, security, performance, simplicity) they caught the text-replace bug, flagged an oversized data file, and talked me out of the streaming feature. Third, ship the simple version. The debate verdict was originally planned as a structured schema with dedicated types. The simplicity reviewer pushed back: just improve the prompt and render the result as markdown. I resisted, then tried it, and it worked perfectly. That one review saved hours.

## Try it

Paste a PRD at [lenny-war-room.vercel.app](https://lenny-war-room.vercel.app/) with your own Anthropic key. Expert-level feedback comes back in about thirty seconds, versus the days, or silence, of a traditional review cycle.

*Data sourced from Lenny's Podcast and Newsletter as a paid subscriber. Pixel-art sprites generated with AI image tools.*
