# ToDo List (Compound Engineering Workflow)

Task management app with Claude Code workflow integration

## /todo — A Task System Built Without Code

A personal productivity system where the "source code" is English prose and the runtime is an AI.

Six slash commands. Zero dependencies. No traditional code. Built entirely as Claude Code natural language instructions that manage structured markdown files.

## TL;DR

- **What:** A daily task management system that lives inside Claude Code's CLI
- **How:** Six slash commands defined as markdown instruction files — no scripts, no database, no build step
- **Result:** A frictionless plan/track/review workflow accessible from any project directory

## Why I Built This

I work across multiple projects in Claude Code throughout the day. Every morning I'd open a notes app to plan tasks, then context-switch back and forth between my terminal and that app to check what's next. The friction wasn't large, but it was constant — and it broke flow at exactly the moments I needed focus most.

I wanted task management that lived where I already work: the terminal.

## The Problem

Existing task tools don't fit the Claude Code workflow:

| Tool | Why it falls short |
|---|---|
| Standalone apps (Todoist, Things) | Requires context-switching away from the terminal |
| Terminal tools (Taskwarrior) | Another CLI to learn, doesn't integrate with Claude's context |
| Plain text files | No structure, no workflow, manual formatting |

The real gap: none of these tools can be part of an AI-assisted development session. I wanted Claude to know what I'm working on — and to help me manage it, not just code around it.

## The Solution

Six slash commands that map to the natural rhythm of a workday:

| Time of day | Command | What it does |
|---|---|---|
| Morning | /todo:plan | Interactive planning session — review carryovers, add new tasks |
| During work | /todo:add | Quick-add a task with priority, category, time estimate |
| During work | /todo:show | Display tasks grouped by priority, with status indicators |
| During work | /todo:update | Modify any field on a task by ID |
| During work | /todo:done | Mark complete with timestamp |
| End of day | /todo:review | Summarize progress, archive completed tasks, triage leftovers |

**Before:** Open Todoist, find my list, type a task, switch back to terminal, forget what I was doing.

**After:**

```
> /todo:add Fix auth token expiration bug
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ADDED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] 007 Fix auth token expiration       2h   coding
Priority: high   Due: 2026-03-25
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Two seconds, zero context switch.

## Technical Architecture

**Stack:** Claude Code CLI + Structured Markdown. That's it.

```
~/.claude/
├── commands/todo/          ← 6 instruction files (the "code")
│   ├── add.md
│   ├── show.md
│   ├── update.md
│   ├── done.md
│   ├── plan.md
│   └── review.md
└── todo/                   ← data layer
    ├── tasks.md            ← active tasks (structured markdown)
    └── archive/
        └── 2026-03-25.md   ← daily archives
```

How it works: When you type `/todo:add Buy groceries`, Claude loads the instruction file at `~/.claude/commands/todo/add.md`, reads the structured process, then executes it — reading the task file, finding the next ID, prompting for details, appending the task, and displaying confirmation.

The instruction files use YAML frontmatter to declare metadata and scope tool permissions, then XML-structured `<objective>` and `<process>` sections that tell Claude exactly what to do, step by step.

Tasks are stored as H2 sections with bold-label fields — a format Claude reads natively without any parsing library:

```markdown
## [ID: 003] Fill PM-OS sections with personal info
- **Status:** pending
- **Priority:** high
- **Category:** admin
- **Time estimate:** 2h
- **Due:** —
- **Notes:** Structure is set up, templates added.
```

## Key Technical Decisions

- **Natural language as source code.** Every "line of code" in this project is an English sentence inside a markdown file. I chose prose instructions over a script or CLI tool. I gave up runtime speed and deterministic execution, but gained the ability to build a complete task system in an afternoon with zero debugging — Claude interprets intent, not syntax.

- **Markdown as a database.** Tasks live in a single .md file rather than SQLite, JSON, or a SaaS API. I gave up querying power and concurrent access, but gained human-readable data, zero dependencies, and a format Claude already parses natively. For a personal task list, this is more than enough.

- **Scoped tool permissions per command.** Each command declares only the tools it needs in its YAML frontmatter. `/todo:show` gets Read, Grep, and Glob — it cannot write files. `/todo:done` cannot use Bash. I gave up flexibility but gained a lightweight correctness guarantee: a read-only command can't accidentally mutate your data.

- **`disable-model-invocation: true`.** Five of six commands lock Claude into deterministic execution — follow the instructions exactly, don't improvise. Only `/todo:show` allows model invocation (for flexible filtering). This was a deliberate choice: task management should be predictable, not creative.

- **Daily archiving over deletion.** Completed tasks move to dated archive files (`archive/2026-03-25.md`) rather than being deleted. I gave up a smaller file count but gained a built-in work journal — perfect for standups, retrospectives, or just remembering what you did last Tuesday.

- **Location-independent storage.** Everything lives under `~/.claude/` instead of within any project. The commands work from any directory on the machine. Tasks are personal, not project-scoped — because my workday spans multiple repos.

## The Design

The visual output follows Swiss/International Typographic Style:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ TASKS 2026-03-25 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HIGH
[ ] 003 Fill PM-OS sections            2h   admin
[ ] 006 Improve Project Dora           1h   coding

MEDIUM
[ ] 001 Interview Coach setup          1h   interview prep
[ ] 002 Build interview prep plan      2h   interview prep
[ ] 004 Start working on next blog     2h   writing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5 pending · 0 in-progress · 0 done · 0 blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Design rules: box-drawing characters for borders, uppercase section headers, fixed-width column alignment, no color, no emoji. The grid itself is the design. In a terminal full of noise, the constraint creates clarity.

## The Build Story

The entire system was built in a single session with Claude Code. The process:

1. **Wrote the spec first.** A 327-line plan document covering file structure, task format, all six commands with frontmatter and behavior specs, archive format, acceptance criteria, and four implementation phases.

2. **Built foundation.** Created the directory structure and implemented `/todo:add` and `/todo:show` first — the minimum needed to start using the system.

3. **Added task management.** `/todo:update` and `/todo:done` for the work-during-the-day flow.

4. **Completed the daily arc.** `/todo:plan` and `/todo:review` bookend the day with interactive sessions.

5. **Polished the output.** Refined the Swiss-style formatting across all commands, handled edge cases (empty list, no matching filter, first-run initialization).

The interesting failure: my first draft of the commands didn't use `disable-model-invocation: true`. Claude would sometimes "helpfully" improvise — adding extra fields, changing the output format, or offering unsolicited suggestions. Locking commands to deterministic execution fixed this immediately. The lesson: when building tools with AI, you sometimes need to constrain the AI to make the tool reliable.

## Outcomes and What I Learned

Proxy metrics:

- 6 commands, ~400 lines of "instruction code" total
- Zero external dependencies
- Works from any directory, any project
- Morning plan to first task: under 2 minutes

### What surprised me:

- **Natural language is a viable "programming language" for personal tools.** The entire system has no traditional code — no parser, no script, no binary. Claude interprets English instructions at runtime. For single-user tools with bounded scope, this works remarkably well.

- **The workflow design matters more than the tech.** The six commands aren't arbitrary CRUD operations — they map to morning/during/evening. This opinionated structure is what makes the system feel natural rather than just functional.

- **AI tools need constraints to be reliable.** Paradoxically, the system became more useful when I limited what Claude could do per command. Creativity is great for coding; predictability is essential for productivity tools.

## What I'd Do Differently

- Add a `/todo:standup` command that reads recent archives and generates a standup summary — the data is already there.
- Integrate with git commits — auto-link task IDs to commits when working in a project, creating an activity trail.
- Time tracking — record when tasks move to in-progress and done to calculate actual vs. estimated time over weeks.

## Try It Yourself

Clone the command files to `~/.claude/commands/todo/`
Type `/todo:plan` in any Claude Code session
Start your day

## Project Stats

| Metric | Value |
|---|---|
| Total instruction files | 6 |
| Lines of "code" (prose) | ~400 |
| External dependencies | 0 |
| Build step | None |
| Database | Markdown files |
| Time to build | Single session |

| Layer | Technology |
|---|---|
| Runtime | Claude Code CLI |
| Command system | Slash commands (YAML frontmatter + markdown) |
| Data storage | Structured markdown (~/.claude/todo/) |
| Presentation | Swiss-style terminal output (box-drawing, fixed-width) |
| Infrastructure | None — runs locally, no server |
