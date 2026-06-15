# Resume Optimizer v0

**A Python pipeline that re-tailors your resume to a job description without quietly making things up about you.**

## The resume rewrite tax

Every time I applied to a role, I paid the same tax. Read the job post, dig back through my resume, figure out which bullets actually matter for this one, reorder them, reword a few so the keywords line up, and somehow still keep it on one page. An hour, easily, per application. And the tools that promised to do it for me were worse than the manual work: they'd bulldoze my formatting, sprinkle in corporate filler, and sometimes invent a metric I never claimed. A resume that reads "AI-generated" is a resume that gets trusted less, which defeats the entire point.

So I built the boring, honest version of that tool for myself.

## What it actually does

You feed it your resume and a job posting (a PDF, a DOCX, or just a URL it scrapes), and it does three things. It pulls the real requirements out of the posting, separating the skills they need from the ones that are merely nice to have. It re-sorts your bullets so the most relevant experience rises to the top instead of sitting in chronological order. And it tells you which skills the job wants that your resume doesn't mention, which is as useful for deciding whether to even apply as it is for prep.

The hard rule underneath all of it: it never touches a fact. No invented dates, no inflated numbers, no achievements I didn't have. It only reorders and re-emphasizes what's already true. It also doesn't edit your document directly. It hands you instructions for what to change in your Google Doc, so your formatting survives intact.

## The decision that kept it honest

The tempting move was to let the tool rewrite freely and trust it to stay truthful. I didn't trust it, so I designed against it. The core of the thing is a plain, legible [[scoring algorithm::a fixed set of point rules, more like a tax form than a black box, so you can see exactly why one bullet beat another]] that I can read and defend: a bullet earns +2.0 for each skill from the posting it actually mentions, a small bonus for leadership verbs on senior roles, a bit more for carrying a real metric, and the whole score gets weighted by how badly the job wants that requirement. Required skills count triple. Nice-to-haves count once.

It's not clever. That was the point. A transparent rule I can audit beats a smart model that occasionally lies on my behalf, on the one document where lying gets you caught in the interview.

## What I learned working with AI

This is v0 for a reason. I'd written hundreds of lines of Python to extract skills, match keywords, and score bullets, basically hand-coding the judgment of a person reading a resume. It worked, but it was brittle. Every new resume shape or weirdly-worded posting meant another pattern to bolt on. The lesson that pushed me toward v1 was realizing I was rebuilding, badly, the one thing the model is already good at: reading a document and understanding what it means. The scoring rules were the part worth keeping. The reverse-engineered NLP was the part to hand back to Claude. v0 taught me where the line sits between logic you should own and judgment you should delegate.

## Try it

It runs from the command line on Python 3.9+, reads PDF and DOCX resumes, fetches postings from a URL, and writes back plain text, Word, or step-by-step Google Docs instructions plus a change-tracking report so you can see exactly what moved and why.
