# ProjectDora

**An AI writing pipeline that actually sounds like you, with a human saying yes at every step.**

## The three hours before the writing

I write a PM and strategy newsletter on Substack, and the part that kills me was never the writing. It was the three hours before it. Scanning Hacker News, skimming Stratechery, scrolling Twitter, trying to connect dots across a dozen trends and figure out what was actually worth a thousand words this week. By the time I had an angle, I had no energy left to write it.

So I wanted a system that did the grunt work, scanning and synthesizing, suggested topics with a real strategic angle, then drafted in my voice. The non-negotiable part: I keep control of every editorial call. The AI does the legwork, I make the decisions.

The tools that already exist don't do this. "Write me a blog post" gives you generic, voiceless content with no sense of what's trending. Content mills like Jasper optimize for SEO volume, not whether the piece is any good. Research tools like Perplexity answer questions well but won't connect trends into a narrative or write like you. None of them solve the actual bottleneck: getting from "47 interesting things are happening" to "here's the one angle that's mine, researched, in my voice."

## How it works

![How ProjectDora works: a seven-stage writing pipeline with a human approval gate at each step](/images/projects/project-dora/how-it-works.svg)

ProjectDora is a seven-stage pipeline, and the spine of it is a human approval gate between every stage. It scrapes nine sources, suggests topics, researches the one you pick, outlines it, drafts it section by section, fact-checks the claims, then generates a hero image. At each handoff it stops and waits for me to approve, edit, or reject. Nothing moves forward on its own.

The first interesting decision is how it picks what to surface. Instead of scoring every item equally, it uses a slot system: fixed slots per source, weighted by how much I trust that source. Stratechery and Every.to get fifteen slots each. Twitter gets eight, with a one-per-author cap so a single prolific poster can't flood the feed. The other sources, Lenny's newsletter, Hacker News, TechCrunch, The Verge, Reddit, and Google Trends, fill in around them. It's an editorial opinion baked into the plumbing.

Topic generation runs in two passes instead of one big prompt. Pass one uses [[Claude Sonnet::Anthropic's mid-tier AI model, good at open-ended creative work]] to generate raw ideas grounded in the trends. Pass two uses [[Claude Haiku::Anthropic's small, fast, cheap AI model, about ten times cheaper than the bigger one]] to overlay strategic frameworks like Aggregation Theory or Jobs To Be Done. Splitting it means the creative step doesn't fight the analytical step, I can tune each on its own, and the cheaper model does the framing work it's plenty good enough for.

It also learns my taste. The last twenty topics I approved and thirty I rejected get fed into future suggestion prompts, so after a handful of rounds the suggestions visibly drift toward what I actually want to write about.

Drafting leans on two things. A tone profile pulled from my own past posts, and the [Every.to](https://every.to) writing style guide encoded as a config file so the craft rules are consistent. After the draft, an editorial pass scores each section for voice consistency and quietly patches the weak ones, then a fact-check stage pulls the claims out and cross-references them against the research before anything reaches me. The hero image is the last step: a prompt in Every.to's crosshatched, physical-metaphor illustration style, rendered through an image model.

The whole thing runs locally as plain server-rendered pages, built in Python on [[FastAPI::a popular Python toolkit for building web apps and APIs]] with a single-file [[SQLite::a tiny database that lives in one file, no separate database server to run]] database. No React, no build step. It's a tool for exactly one user. Reaching for a JavaScript framework would have been me cosplaying as someone shipping to a million people.

## The fight to make it sound like me

The first drafts were the failure that taught me the most. They were technically fine and they sounded like a stranger wrote them. Correct, competent, and not me at all. That's the whole reason most AI writing gets thrown out.

What fixed it was tone fingerprinting. I scraped my old posts and pulled out a writing profile, then paired it with actual paragraphs of mine dropped into the prompt as examples. Abstract descriptors alone ("conversational, a bit wry") don't get you there. Real sample paragraphs alone don't either. The combination is what finally made drafts pass my own "wait, did I write this?" test. That was the turning point of the whole build.

The other half of the voice problem was counterintuitive. My early style guide was a blacklist: don't use em dashes, avoid clickbait titles, don't do this, don't do that. It made the output worse. Tell the model not to produce something and it produces more of it, the same way "don't think about a pink elephant" works on people. The fix was to flip it: show pairs of generic-versus-in-voice examples instead of naming forbidden patterns. Demonstrate the right answer rather than the wrong one.

And for em dashes specifically, after fighting it in the prompt and losing, I gave up and added a one-line cleanup pass in code that swaps every em dash for a comma. Sometimes the right answer to an AI problem isn't a cleverer prompt, it's three characters of plain string replacement after the fact.

## What I learned working with AI

I built this entirely with [[Claude Code::Anthropic's command-line tool that writes and edits code for you as you describe what you want]] across eighteen days and eighty-four commits, and the lesson that stuck was about negative instructions. Every time I tried to control the model by telling it what not to do, I made things worse: more em dashes, more of the patterns I'd banned. The thing that worked was always positive and concrete. Show the good example. Give it the right pattern to copy. The model is a far better mimic than it is a rule-follower, and once I stopped writing prohibitions and started writing demonstrations, both the code and the prose got noticeably better.

The honest limit of all this: there are no public users. It's a personal tool, so the metrics are proxies, not proof. What I can say is that the topic-to-draft loop went from three or four hours of manual grind to about fifteen minutes, and the drafts now need light editing instead of a full rewrite. For a thing I use every week, that's the bar that mattered.

## Source

Code at [github.com/b-barri/ProjectDora](https://github.com/b-barri/ProjectDora).
