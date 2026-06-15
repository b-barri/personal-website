# Resume Wizard

**A Claude skill that turns a job description into a submission-ready resume in about five minutes.**

## The same puzzle, rearranged for every job

I was applying to PM roles at Uber, Coinbase, Sarvam AI, and Razorpay while working full-time at Groww. Every application was the same 30 to 45 minutes: reorder my resume bullets, adjust the skills section, write a cover letter, and fight Google Docs formatting into submission. Same resume, same achievements. I was just rearranging the same puzzle pieces to face a different job description.

So I built a tool. The first version was a Python pipeline, because that's the reflex when you want to automate something. It worked, and the overhead was real: virtual environments, dependency management, and a 155-line [[Apps Script::small chunks of Google's own scripting code you paste into a Doc to make it do things automatically]] I had to paste into Google Docs every single time. I was spending more time managing the tool than the tool was saving me. That's the version I threw away.

## What it actually is

The second version is a Claude [[skill::a set of plain-English instructions Claude follows step by step, so the instructions themselves are the program, no code to run]]. You type `/resume-optimizer` with a job description URL, and it runs the whole thing as a conversation: fetches the JD, reorders my real bullets to front-load what's relevant, prioritizes the matching skills, drafts a cover letter in either a formal or an email style, and writes it all to a markdown file I can open in my editor. I read it, edit if I want, say "approved," and it produces a formatted Google Doc ready to submit.

The fetch step has a quiet fallback chain. It tries [[WebFetch::a tool that pulls the text off a web page]] first, drops to browser automation for sites like LinkedIn that don't hand their text over easily, and only asks me to paste manually if both fail. The original design asked "Chrome or paste?" up front. I cut that, because nobody applying for a job cares how the JD got fetched. They just want the JD.

A real example, optimizing for a Sarvam AI Product Manager role: the template order leads with an Annual Flashback project, then a GenAI pipeline. The optimized version flips it. GenAI pipeline first, LLM doc analysis next, the Stories platform dropped entirely as least relevant, and the skills reshuffled so Claude Code, prompt engineering, evals, and RAG move to the front. Subtle, but a hiring manager scanning for AI experience now sees it in the first line instead of the third.

## Deleting the algorithm

The decision that defined the rewrite was admitting that resume optimization is a reasoning task, not an algorithmic one.

The Python version had a real scoring formula: plus 2.0 per keyword match, plus 0.5 for leadership verbs, weighted by how important each requirement was. It worked. But I had written an algorithm to approximate something a language model does natively. Claude can just read a JD and understand that "managed an end-to-end AI system in production" answers a posting that asks for "agent-building experience," even with zero keyword overlap. So I deleted the scoring code. I gave up deterministic, explainable scores. I got nuance the formula could never reach.

The same instinct fixed the hardest part of the build, the Google Doc. My resume template has fussy, exact formatting: Calibri 11pt body, 18pt name header, borderless two-column tables, justified bullets at 1.05 line spacing. Building that through the [[API::the programmatic back door into a service like Google Docs, so a script can edit a document instead of a person]] means dozens of update requests doing character-index math, and one off-by-one breaks everything. Instead I had it copy the already-formatted template and use a find-and-replace to swap only the bullet text. I lost the ability to restructure the document. I got pixel-perfect formatting with no index math at all. The best technical decision was the one that sidestepped the technical problem.

## The bug that only showed up on the real thing

I tested against a live Sarvam AI posting. The JD fetched, the resume optimized, the review file wrote, the Doc generated with formatting intact. One bug surfaced, and it was a good one.

When I reorder bullets rather than just edit them, the find-and-replace passes start tripping over each other. Replace bullet A's text with B's, and the next pass looking for B's text now finds two copies and overwrites both. A cascade. The quick fix was to fall back to position-based replacement for the second pass, which shipped. The cleaner fix, swapping through a placeholder first, is noted for later. This is exactly the kind of failure no unit test catches and a single real run does.

## What I learned working with AI

The sharpest realization was that the skill is the program. A skill file isn't documentation that describes what some code does. It is the instructions Claude executes, step by step. When your runtime is a reasoning engine, the line between "spec" and "code" just dissolves, and 500 lines of Python collapse into a couple hundred lines of plain English that read like a brief.

The other lesson was about where the leverage lives. Before writing the skill, I had a handful of review agents grade the plan in parallel. One caught that my character-count page limit was false precision, since characters don't map to rendered length, so I fixed the structure to three bullets per role instead. Another flagged credential files I'd left world-readable. None of that was the typing. The typing was fast. The thinking I forced before the typing is what made it good. The whole second version went from idea to working tool in a single session.
