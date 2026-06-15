# OpenClaw Setup

**One AI assistant, every messaging app, running on my own hardware. I ran it for a day and watched it break three times.**

[I ran OpenClaw for a day. Here's what actually happened](https://bhavya287274.substack.com/p/i-ran-openclaw-for-a-day-heres-what)

## Tired of using AI the way everyone else does

I spend my days as a PM evaluating AI tools, and somewhere along the way the sameness started to bother me. ChatGPT in a browser tab. Copilot in VS Code. Siri on my phone. Each one a silo, none of them able to actually do anything across the parts of my life that don't live inside their app.

What I wanted wasn't another chatbot. I wanted an assistant that runs 24/7, answers wherever I already am, schedules its own follow-ups, remembers things between conversations, and quietly handles the low-stakes recurring chores I keep postponing. The options I looked at each missed in their own way. Cloud-hosted bots like custom GPTs and Slack apps can talk but can't do, no real tasks, no browser, no reach into a machine. Self-hosted setups like [[Ollama::software that runs an AI model on your own computer instead of in the cloud]] with Open WebUI are lovely for chat and nothing else. Bot frameworks like Botpress or Rasa are built so you can ship chatbots to other people, not run one for yourself. Nothing gave me a single assistant that lived across all my channels and could still reach into my systems.

## A gateway that sits between my apps and the AI

[[OpenClaw::an open-source framework for running your own personal AI assistant, the way you'd self-host your own email server instead of using Gmail]] is the layer I was missing. Think of it as a switchboard that sits between every messaging app I use and whichever AI model I point it at, routing all of it through one agent that keeps its memory and its sense of who I am.

The shape of it is what makes it feel like an agent rather than a chatbot. Channels are plugins, so WhatsApp, Telegram, Slack, Discord, Signal, iMessage and a dozen more are each just something you switch on. Models are swappable, Anthropic or OpenAI or Google or a local Ollama, with automatic failover if one goes down. And it has real agency: it can drive a browser, run shell commands, schedule itself through [[cron::the standard way computers run a task on a timer, like "every morning at 7"]] jobs, take a camera snapshot. Underneath, everything flows through one switchboard and the rest are just lines plugged into it. The product is the assistant. The infrastructure is supposed to disappear.

Day to day, that turns "ask ChatGPT in a tab, copy the answer, paste it into Slack, repeat" into "message my AI on Discord and it just does the thing, then follows up tomorrow on its own."

## Eighty percent automated, twenty percent the part that mattered

I deployed it on [[Fly.io::a service that runs your app on rented servers somewhere in the cloud, so it stays on even when your laptop is closed]] using [[Claude Code::Anthropic's coding agent that runs in your terminal and can write and run code on your behalf]] with a detailed prompt, and it handled most of the nine setup steps, from cloning the repo through wiring up Discord permissions. That part was genuinely 80% done by the agent.

The other 20% was the part that only shows up when you hit real infrastructure, and it's the part worth talking about. I connected Discord first, since that's where I already spend my time. I set [[Claude Opus::Anthropic's most capable model, the bigger and smarter of its lineup]] as the primary brain and Claude Sonnet as the fallback, on the theory that if one had an outage the other would catch me.

## The day it broke three times

It answered one message. Then it went silent on everything after, no error, just nothing. The culprit was the assistant burning through tokens fast enough to slam into the free tier's per-minute limit. I trimmed how much conversation history it carried and cut the simultaneous requests.

Then the fallback failed too, which taught me something obvious in hindsight: a backup model on the same API account is no backup at all, because both share the same rate limit. I added a 30-second cooldown after a limit hit so the ceiling had time to reset before retrying.

The last one was the sneakiest. [[Subagents::little helper AIs the main assistant spins up to go do side tasks, like fetching context, while it keeps talking to you]] were defaulting to eight running at once. Every single message was quietly launching an invisible avalanche of token spend. Capping them at two finally made the whole thing stable.

The lesson underneath all three: the hard part of self-hosting an AI assistant isn't the setup. It's the economics. Rate limits, token budgets and concurrency settings are the real configuration surface, and the onboarding wizard can't debug your usage patterns for you.

## Where to run it, and what it's actually good for

I ran it on Fly.io first, then weighed moving it to a Mac mini at home. Cloud wins for the always-on jobs: overnight tasks, daily digests, anything that needs a heartbeat while I'm asleep. Local wins when the assistant needs to touch my actual desktop, drive a browser on my logged-in accounts, or read my files, at the cost of turning me into a part-time sysadmin with exposed API keys to worry about. There's no single right answer, just which half of your use cases you care about more.

And the use cases that stuck weren't the flashy ones. A daily AI-industry digest delivered to Discord every morning. Blog topic ideas surfaced from watching my own activity. A context brief pulled together before a meeting. "Look into this and report back tomorrow." Remembering things about people so I don't have to. The pattern is consistent: too annoying to do by hand every day, too small to justify building a real tool for. That gap is exactly where a personal agent earns its keep.

## What I learned working with AI

Using Claude Code to stand up the infrastructure and then running OpenClaw as the thing that lives there was the first time AI-building-AI-infrastructure stopped feeling like a slogan. But the sharper lesson was about where the agent's help ends. It got me 80% of the way in minutes, then left me alone with the 20% that no prompt could have pre-solved, because it only existed once real traffic met real limits. The automation collapses the tedious part and concentrates all the difficulty into the judgment calls. That, it turns out, is the actual skill: not getting the AI to build the thing, but knowing which 20% it was always going to hand back to you.

## Try it

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

Full docs at docs.openclaw.ai, source at github.com/openclaw/openclaw.

Read the full day-one write-up: [I ran OpenClaw for a day. Here's what actually happened](https://bhavya287274.substack.com/p/i-ran-openclaw-for-a-day-heres-what)
