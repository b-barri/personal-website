# ToDo List

**A task manager whose entire source code is English prose, and whose runtime is an AI.**

## The notes app I kept leaving the terminal for

I work across a handful of projects in Claude Code all day. Every morning I'd open a notes app to plan, then spend the rest of the day bouncing between the terminal and that app to remember what was next. The friction was small but constant, and it broke flow at exactly the moments I needed it. Worse, the app had no idea what I was actually working on. Claude knew, but Claude couldn't help me track it.

The tools that exist don't fit this. Standalone apps like Todoist pull you out of the terminal. Terminal tools like Taskwarrior are one more CLI to learn and still can't see your AI session. Plain text files have no structure. I wanted task management that lived where I already work, and that the AI I was already talking to could read and update itself.

## Six commands, no code

So I built it as six [[slash commands::short typed commands like /todo:add that you run inside Claude Code, the way you'd type a command in a chat]] that map to the rhythm of a workday. `/todo:plan` in the morning to review carryovers and add new tasks. `/todo:add`, `/todo:show`, `/todo:update`, and `/todo:done` during the day. `/todo:review` at the end to summarize progress and archive what's finished.

The thing nobody quite believes at first: there is no traditional code. No script, no database, no build step. Each command is a markdown file of [[instruction code::ordinary English written as step-by-step instructions, which the AI reads and follows at runtime instead of a computer executing compiled code]] that tells Claude what to do, step by step. Type `/todo:add Fix auth bug` and Claude opens the matching instruction file, reads the process, finds the next task ID, asks for details, appends the task, and prints a confirmation. The whole system is about 400 lines of prose across six files, with zero dependencies, that works from any directory on my machine.

Tasks themselves live in a single markdown file under `~/.claude/`, stored as plain sections with bold-label fields. No SQLite, no JSON, no SaaS API. I gave up real querying and concurrent access. I got human-readable data and a format Claude parses natively with nothing in between. For a one-person task list, that trade is not close.

The output borrows from Swiss typographic style: box-drawing borders, uppercase headers, fixed-width columns, no color, no emoji. In a terminal already full of noise, the constraint is the design.

## The afternoon I had to muzzle the AI

The interesting break came from the AI being too helpful. My first draft of the commands let Claude improvise, and it did, adding fields I hadn't asked for, quietly reformatting the output, volunteering suggestions. Charming in a coding session. Useless in a task tracker, where the entire point is that the thing behaves the same way every time.

The fix was to set `disable-model-invocation` on five of the six commands, which locks Claude into following the instructions exactly rather than riffing. Only `/todo:show` stays flexible, because flexible filtering is the one place I actually want judgment. The lesson stuck with me: building reliable tools with AI is often about constraining the AI, not unleashing it. Creativity is what you want when you're writing code. Predictability is what you want from the tool that code becomes.

I also scoped each command to only the tools it needs. `/todo:show` can read and search but physically cannot write, so a display command can never corrupt my data. And completed tasks get moved to dated archive files instead of deleted, which turned out to be a free work journal. Handy for standups, and for remembering what on earth I did last Tuesday.

## What I learned working with AI

The honest surprise is that English held up as a programming language for a small, single-user tool. No parser, no binary, just intent the AI interprets at runtime. That obviously doesn't scale to anything with real performance or concurrency needs, and I wouldn't pretend otherwise. But for bounded personal tooling it let me ship a working system in an afternoon with nothing to debug.

The other half is that the workflow mattered more than the tech. The six commands aren't generic create-read-update-delete operations. They're shaped around morning, during, and evening. That opinion about how a day actually runs is what makes the thing feel like a habit instead of a database with a prompt.

## Try it

Drop the six command files into `~/.claude/commands/todo/`, open any Claude Code session, type `/todo:plan`, and start your day.
