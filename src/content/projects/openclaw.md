# OpenClaw Setup

Open-source claw machine controller setup and configuration

## Substack Blog

[I ran OpenClaw for a day. Here's what actually happened](https://bhavya287274.substack.com/p/i-ran-openclaw-for-a-day-heres-what)

## OpenClaw: Self-Hosting a Personal AI That Actually Does Things

One AI assistant, every messaging app, running on my own hardware.

I deployed OpenClaw — an open-source personal AI assistant framework — on Fly.io and ran it for a day. It answered on Discord, scheduled its own tasks, and maintained persistent memory. It also broke in three different ways before I got it stable. This case study documents the deployment, the debugging, and what I learned about self-hosting AI agents.

## TL;DR

- **What:** Deployed OpenClaw, an open-source 24/7 AI assistant, on Fly.io with Discord integration
- **How:** Claude Code automated 80% of the deployment; the other 20% was debugging rate limits, fallback failures, and hidden concurrency
- **Result:** A stable personal AI agent that handles daily digests, async research, and recurring tasks — with hard-won lessons about API economics

## Why I Set This Up

As a PM who writes about AI, I spend my days evaluating tools — but I was tired of using them the way everyone else does. ChatGPT in a browser tab, Copilot in VS Code, Siri on my phone. Each one a silo, none of them able to actually do things across my workflow.

What I wanted was an AI that could run as a 24/7 assistant — answering on Discord, scheduling its own tasks, maintaining persistent memory, and handling the low-stakes-but-annoying recurring tasks I perpetually postpone. Not a chatbot. An agent that lives where I already am.

## The Problem

Most AI assistants force you into their interface. ChatGPT has its web app. Copilot lives in VS Code. Siri lives on Apple devices. Each one is a silo.

The alternatives I looked at fell short in different ways:

- **Cloud-hosted bots (custom GPTs, Slack bots):** No real agency — they can't run tasks, control browsers, or interact with local systems
- **Self-hosted LLM setups (Ollama + Open WebUI):** Great for chat, but no channel integrations, no automation layer
- **DIY bot frameworks (Botpress, Rasa):** Focused on building chatbots for others, not a personal assistant for yourself

None of them gave me a single assistant that worked across all my channels while also being able to do things on my machines.

## The Solution

OpenClaw is that missing layer. It's a gateway that sits between my messaging channels and AI models, routing conversations through a single intelligent agent.

| Capability | What it does |
|---|---|
| Channel unification | WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Matrix, IRC, and 15+ more |
| Model flexibility | Anthropic, OpenAI, Google, Ollama — with automatic failover |
| Real agency | Browser control, shell commands, cron jobs, camera snapshots |
| Privacy | Runs locally, single-user, my data stays on my hardware |
| Live canvas | Agent-driven visual workspace (A2UI) for interactive outputs |

**Before:** Ask ChatGPT something in a browser tab, copy the answer, paste it into Slack, switch apps, repeat.

**After:** Message my AI on Discord and it runs the task, schedules follow-ups via cron, and maintains context across conversations. Same assistant whether I reach it from my phone or desktop.

OpenClaw operates through five core principles that make it feel like an agent, not a chatbot: it uses multiple communication channels, self-installs integrations, runs periodic heartbeat checks, schedules its own tasks, and maintains persistent memory through daily logs and identity files.

## Technical Architecture

**Stack:** TypeScript (ESM) / Node 22+ / Hono / Lit Web Components / Vite / Vitest

The architecture is gateway-centric — everything flows through a single WebSocket control plane:

```
Messaging Channels          Native Apps
(WhatsApp, Telegram,        (macOS, iOS,
Discord, Slack, 20+)        Android)
        |                       |
        v                       v
+------------------------------------------+
|          Gateway (WS:18789)              |
| Sessions | Routing | Tools | Auth       |
| Control UI (Lit) | WebChat | Cron       |
+------------------------------------------+
        |                       |
        v                       v
   Pi Agent (RPC)        Device Nodes
  (AI model calls,      (camera, screen,
  tool execution,        location, notify)
  sandboxed bash)
```

The key insight: the gateway is just a control plane. Channels are plugins. Models are swappable. The product is the assistant, not the infrastructure.

## Key Technical Decisions

- **TypeScript over Python/Go** for the orchestration layer. Most AI projects default to Python. OpenClaw chose TypeScript for hackability and ecosystem breadth — the same language runs the gateway, CLI, control UI, and browser extension. I gave up Python's ML ecosystem proximity but gained a unified codebase that any web developer can contribute to.

- **Oxlint/Oxfmt over ESLint/Prettier.** The project uses the newer Rust-based toolchain instead of the JavaScript incumbents. Faster linting, fewer config files, but less ecosystem support for custom rules. The tradeoff pays off in a large monorepo where lint speed matters.

- **Lit Web Components over React/Vue** for the Control UI. Standards-based, lightweight, no virtual DOM overhead. The control UI doesn't need React's component ecosystem — it needs to be fast and stay out of the way. This was a bet on web standards over framework churn.

- **Plugin architecture with 40+ extensions** as workspace packages. Each channel integration (Discord, Telegram, Matrix, etc.) is its own package with its own package.json and manifest. Core stays lean. Adding a channel doesn't touch core code. I gave up the simplicity of a monolithic codebase but gained the ability to install only the channels I need.

- **MCP decoupled via mcporter bridge.** Instead of baking MCP (Model Context Protocol) into core, it's handled by a separate bridge. This means MCP servers can be added or swapped without restarting the gateway, and MCP protocol churn doesn't destabilize the core runtime.

- **Pairing-based DM security by default.** Unknown senders can't just message the bot — they need a pairing code first. This is the right default for a personal assistant: secure by default, explicitly opened when needed.

## The Build Story

Setting up OpenClaw was a multi-phase journey — part automated, part real-world debugging.

**Phase 1: Claude Code did 80% of the work.** I used Claude Code with a detailed prompt to automate the Fly.io deployment. It handled most of the nine configuration steps — from cloning the repository through enabling Discord permissions. The remaining 20% was the kind of debugging that only happens when you hit real infrastructure.

**Phase 2: Discord channel integration.** I connected Discord first since that's where I spend most of my time. The configuration is declarative — guild IDs, channel allowlists, mention requirements — all in a single openclaw.json file. The routing system lets me bind specific channels to specific agent configurations.

**Phase 3: Model configuration and failover.** I set up Claude Opus 4.6 as my primary model with Claude Sonnet 4.5 as fallback. The auth profile system handles API key rotation, and the failover chain means my assistant doesn't go dark if one provider has an outage.

### What went wrong — three times:

1. The bot answered one message, then failed silently on every subsequent attempt. The culprit: aggressive token usage slamming into Anthropic's free-tier per-minute rate limits. I had to reduce simultaneous requests and trim conversation history from 50 messages to a minimal context window.

2. Then the fallback model failed too — because having a secondary model on the same API account provides no real protection against rate limits. I implemented a 30-second cooldown after rate-limit hits, giving the limits time to reset before retrying.

3. The final hidden issue: subagents. These background tasks handling tool use and context retrieval defaulted to 8 simultaneous processes. Each message was silently spawning an invisible token avalanche. Capping subagent concurrency at 2 finally stabilized everything.

**Key insight:** The hardest part of self-hosting an AI assistant isn't the setup — it's the economics. Rate limits, token budgets, and concurrency settings are the real configuration surface area. The onboarding wizard handles the infrastructure, but understanding how your usage patterns interact with API limits takes hands-on debugging.

## Cloud vs. Local: The Deployment Tradeoff

I ran OpenClaw on Fly.io first, then evaluated running it locally on a Mac mini. Both have clear strengths:

| | Cloud (Fly.io) | Local (Mac mini) |
|---|---|---|
| Strengths | Always-on heartbeats, scheduled overnight tasks, no sysadmin on personal machine | Direct file access, near-zero latency, browser automation on local apps |
| Weaknesses | Can't access local apps, higher latency for browser control | You become a sysadmin, security considerations with exposed API keys |

The sweet spot depends on your use case. Cloud excels at the "always-on assistant" pattern — daily digests, monitoring, scheduled tasks. Local wins when the assistant needs to interact with your actual desktop — browser automation, file management, camera snapshots.

## What I Actually Use It For

The killer use cases aren't the flashy ones. They're the low-stakes, recurring tasks I'd perpetually postpone:

- Automated daily AI industry digests — summarized and delivered to Discord every morning
- Blog topic suggestions — monitors my social network activity and surfaces writing ideas
- Pre-meeting context briefs — pulls relevant background before calendar events
- Async research tasks — "look into X and report back tomorrow"
- Personal relationship tracking — remembers context about people so I don't have to

The pattern: anything that's too annoying to do manually every day but too simple to justify building a dedicated tool for.

## Outcomes and What I Learned

- **One assistant, everywhere:** I can reach the same AI context from my phone, desktop (Discord), or terminal (CLI). The context follows me, not the app.
- **Real privacy:** My conversations don't live on someone else's server. Sessions are JSONL files on my machine.
- **Cost is the real bottleneck:** Not compute, not setup — API rate limits and token economics are what you actually spend time tuning.

### What surprised me:

- **Subagent concurrency is the hidden cost multiplier.** A single message can spawn 8 background processes, each burning tokens. The default settings are optimized for paid-tier API access, not free-tier experimentation.
- **Gateway-centric architecture scales down beautifully.** The same architecture that could serve a team works perfectly for a single user. The "control plane" pattern isn't overengineered — it's actually the right abstraction for personal use.
- **Claude Code + OpenClaw is a powerful combo.** Using Claude Code to automate 80% of the deployment setup, then using OpenClaw as the runtime — AI building AI infrastructure felt like a glimpse of where everything is heading.

## What I'd Do Differently

- **Start on a paid API tier.** The free-tier rate limits turned debugging into guesswork. A $5 API credit would have saved hours of "why is it silently failing?" investigation.
- **Cap subagent concurrency from day one.** Set `maxConcurrent: 2` in your config before sending the first message. The default of 8 is an invisible token avalanche.
- **Deploy to cloud first, add local later.** Cloud deployment is simpler for the always-on use cases. Add local deployment when you need browser automation or file access.

## Try It Yourself

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

Full docs at docs.openclaw.ai. Source at github.com/openclaw/openclaw.

Read my full deployment write-up: [I Ran OpenClaw for a Day — Here's What Happened](https://bhavya287274.substack.com/p/i-ran-openclaw-for-a-day-heres-what)

## Project Stats

| Metric | Value |
|---|---|
| Deployment setup steps | 9 (80% automated via Claude Code) |
| Messaging channels supported | 20+ |
| Extension packages | 40+ |
| Model providers | 15+ (Anthropic, OpenAI, Google, Ollama, etc.) |
| Native apps | macOS, iOS, Android |
| Primary model | Claude Opus 4.6 |
| Fallback model | Claude Sonnet 4.5 |
| Subagent concurrency (tuned) | 2 (default: 8) |
| Rate-limit cooldown | 30 seconds |
| Deployment target | Fly.io (cloud) + local (macOS) |
| License | MIT |

| Layer | Technology |
|---|---|
| Runtime | Node 22+ / TypeScript (ESM) |
| HTTP framework | Hono |
| Control UI | Lit Web Components + Vite |
| Linting | Oxlint + Oxfmt |
| Testing | Vitest (V8 coverage, 70% threshold) |
| Native apps | Swift/SwiftUI (macOS/iOS), Kotlin (Android) |
| Package management | pnpm (monorepo workspaces) |
| Deployment | launchd (macOS) / systemd (Linux) / Docker |
