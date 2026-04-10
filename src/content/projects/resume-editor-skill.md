# Resume Editor Skill (v1 improved)

Claude skill that turns job descriptions into submission-ready resumes in minutes

## Resume Wizard

A Claude Code skill that turns job descriptions into submission-ready resumes in under 5 minutes.

Replaced a 500-line Python pipeline with a 230-line conversational skill. One command. Review in your editor. Approve. Get a formatted Google Doc.

## TL;DR

- **What:** A Claude Code skill that optimizes resumes for specific job descriptions, generates cover letters, and creates formatted Google Docs
- **How:** Pure conversational AI — no code execution, no dependencies. Claude reasons about bullet ordering, skill prioritization, and JD alignment natively
- **Result:** Collapsed a multi-step workflow (run Python, paste Apps Script, verify formatting) into "type command, review, approve"

## Why I Built This

I was applying to PM roles at companies like Uber, Coinbase, Sarvam AI, and Razorpay while working full-time at Groww. Each application meant spending 30-45 minutes manually reordering resume bullets, adjusting skills, writing a cover letter, and fighting with Google Docs formatting. I had the same resume, the same achievements — I was just rearranging the same puzzle pieces for each job description.

The first version was a Python pipeline because that's what you build when you want to automate something. It worked, but the overhead was real: virtual environments, dependency management, a 155-line Apps Script that I had to paste into Google Docs every time. I was spending more time managing the tool than it saved me.

## The Problem

Tailoring a resume for a specific job is straightforward but time-consuming:

1. Read the JD, identify key requirements and keywords
2. Reorder bullets to front-load the most relevant achievements
3. Adjust skills section to match
4. Write a cover letter that maps your experience to their needs
5. Get it into a properly formatted Google Doc for submission

Existing tools either do too little (grammar checkers) or too much (AI resume builders that hallucinate achievements you never had). I needed something that would rearrange my real work to match their specific needs — no fabrication, no fluff.

## The Solution

A Claude Code skill invoked with `/resume-optimizer [JD URL]` that handles the entire workflow conversationally.

| Step | What Happens | How |
|---|---|---|
| 1. Fetch JD | Grabs the job description from any URL | WebFetch, browser automation for LinkedIn, paste as fallback |
| 2. Optimize | Reorders bullets, prioritizes skills, identifies keywords | Claude's native reasoning against the resume template |
| 3. Cover Letter | Generates formal or email-style letter | Style guide from proven cover letters |
| 4. Review | Writes a markdown file for human review | Opens in Zed — edit, iterate, approve |
| 5. Google Doc | Creates a perfectly formatted doc | Copies template, replaces only text |

### Before/after example (Sarvam AI, Product Manager):

**Before (template order):** Annual Flashback -> GenAI pipeline -> LLM doc analysis -> Stories platform

**After (optimized for AI PM role):** GenAI pipeline -> LLM doc analysis -> Annual Flashback. Stories dropped (least relevant). Skills reordered: Claude Code, Prompt engineering, Evals, RAG moved to front.

The reordering is subtle but matters — a hiring manager scanning for AI experience sees it in the first bullet, not buried in the third.

## Key Technical Decisions

"Resume optimization is a reasoning task, not an algorithmic one."

- **Deleted the scoring algorithm.** The V1 Python pipeline had a relevance scoring formula: +2.0 per keyword match, +0.5 for leadership verbs, weighted by requirement importance. It worked, but Claude can just read a JD and understand which bullets are most relevant. I was writing an algorithm to approximate what a language model does natively. I chose to delete the algorithm and let Claude reason directly. I gave up deterministic scoring but gained nuance — Claude understands that "managed end-to-end AI system in production" maps to a JD asking for "agent building experience" even without keyword overlap.

- **Copy-template instead of build-from-scratch for Google Docs.** The resume template has extremely precise formatting: Calibri 11pt body, 18pt name header, borderless two-column tables, justified bullets with 1.05 line spacing. Building this via API requires dozens of batchUpdate requests with character index math. I chose to copy the formatted Google Doc template and use replaceAllText to swap only the bullet text. I gave up the ability to restructure the document but gained pixel-perfect formatting with zero index math. The key insight: replaceAllText preserves paragraph formatting automatically.

- **Silent fallback chain for JD fetching.** The original design asked the user "Try Chrome or paste?" when WebFetch failed. I chose to silently try browser automation before asking, because the user doesn't care about fetch methods — they just want the JD. I gave up transparency but gained a smoother experience. The user only sees a prompt if all automated methods fail.

- **Fixed bullet count as the page limit.** V1 enforced a character budget (~1800 chars, 5% tolerance). This was false precision — character count doesn't map to rendered page length. I chose to fix the structure instead: 3 bullets per role, always. The template's fixed structure (3 roles + skills + education) inherently fits one page. I gave up flexibility but gained a constraint that's impossible to violate.

## The Build Story

The entire V2 was designed and built in a single session on March 25, 2026.

The process:

1. **Brainstorm** — Used `/ce:brainstorm` to explore the idea. Asked and answered 7 questions: invocation style (pure Claude, no Python), Google Docs approach (explored 3 options, picked GWS CLI after research), LinkedIn handling (browser automation), cover letter format (both styles available), review location (existing output folder pattern).

2. **Research** — `/last30days` discovered the Google Workspace CLI had launched just 2 weeks earlier with 22K GitHub stars. This was the missing piece — a Bash-callable interface to Google Docs built specifically for AI agents. The research also found that gws docs documents create only creates blank docs — content must be pushed separately. This led directly to the copy-template strategy.

3. **Plan** — `/ce:plan` created the implementation plan, then `/deepen-plan` ran 7 specialized agents in parallel: agent-native reviewer, architecture strategist, simplicity reviewer, security sentinel, pattern recognition specialist, SKILL.md best practices researcher, and GWS CLI documentation researcher. Each agent caught something different — the simplicity reviewer cut the review.md from 5 sections to 3, the pattern specialist identified a naming convention drift in the V1 output folders, the security reviewer flagged world-readable credential files.

4. **Build** — `/ce:work` implemented the plan: one SKILL.md, three reference files, a .gitignore, and a deprecation notice on V1. Total implementation time was under 30 minutes.

5. **Test** — Ran the skill against a real Sarvam AI job description. The JD was fetched, resume optimized, review.md written, and a Google Doc created with preserved formatting. Hit one bug: cascading replaceAllText when reordering bullets (swapping A->B then B->C causes the B from step 1 to match step 2). Fixed by using index-based replacement for the second pass.

### What went wrong:

The replaceAllText cascading match was the main failure. When you reorder bullets (not just edit them), the sequential text replacements interfere with each other. Bullet 1 gets replaced with Bullet 2's text, then the next replacement finds two copies of Bullet 2's text and replaces both. The fix worked (fall back to index-based editing for the duplicate), but the root solution is to use placeholder text as an intermediate step. This is documented as a future improvement.

## Outcomes and What I Learned

Metrics:

- Workflow time: ~40 minutes -> ~5 minutes per application (including review and iteration)
- Lines of code: ~500 lines of Python -> 230 lines of SKILL.md (plus 3 reference files)
- Dependencies: 6 Python packages + Google API client -> 1 npm package (gws)
- Manual steps: 5 (run script, open doc, paste Apps Script, run, verify) -> 1 (say "approved")

### What surprised me:

- **The skill is the program.** A SKILL.md is not documentation — it's executable instructions that Claude follows step by step. The line between "spec" and "code" disappears when your runtime is a reasoning engine.

- **Research agents are the 10x multiplier.** The 7 parallel agents during `/deepen-plan` each found something I would have missed: the simplicity reviewer's insight that character budgets are false precision, the security reviewer catching world-readable credentials, the architecture strategist generalizing the browser fallback beyond LinkedIn. Running them took 3 minutes and saved hours of iteration.

- **Copy beats create.** The copy-template strategy for Google Docs is obvious in retrospect, but I spent the brainstorm session debating between three from-scratch approaches (API, browser automation, Apps Script) before landing on "just copy the formatted doc and swap the text." The best technical decision was the one that avoided the technical problem entirely.

## What I'd Do Differently

- **Add bold keyword application in Google Docs.** Currently replaceAllText preserves existing formatting but can't add new bold. A follow-up updateTextStyle pass would bold JD keywords in the created doc.
- **Use placeholder text for bullet reordering.** Replace A->__PLACEHOLDER__, B->A, __PLACEHOLDER__->B to avoid cascading match issues. Simple fix, just needs to be implemented.
- **Add a batch mode.** The skill handles one JD at a time. An -auto-approve flag and batch invocation would let me optimize for 5 jobs overnight — the agent-native reviewer identified this gap.

## Project Stats

| Metric | Value |
|---|---|
| Build time (V2) | 1 session (~3 hours brainstorm-to-ship) |
| Research agents used | 7 (parallel) |
| SKILL.md lines | 230 |
| Reference files | 3 (review template, GWS commands, cover letter style) |
| V1 Python lines replaced | ~500 |
| Applications optimized (V1+V2) | 17+ |
| Workflow time savings | ~35 min per application |

| Layer | Technology |
|---|---|
| AI Engine | Claude Code (Opus) |
| Skill Framework | Claude Code Skills (SKILL.md) |
| JD Fetching | WebFetch + claude-in-chrome (MCP) |
| Google Docs | Google Workspace CLI (gws) |
| Review Interface | Markdown in Zed |
| V1 Fallback | Google Apps Script |
