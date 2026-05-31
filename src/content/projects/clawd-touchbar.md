# clawd-touchbar

**A tiny animated mascot that lives on your MacBook Pro Touch Bar and reacts to your Claude Code session.**

Shipped end-to-end in one focused session. Live at [github.com/b-barri/clawd-touchbar](https://github.com/b-barri/clawd-touchbar) (AGPL-3.0).

---

![clawd-touchbar — live demo on a MacBook Pro Touch Bar](/videos/projects/clawd-touchbar/demo.mp4)

## TL;DR

- **What**: A small animated character that walks around on the Touch Bar and shows live state from your Claude Code session.
- **How**: A Swift Package Manager executable linking Apple's private DFRFoundation framework, talking to Claude Code via a local HTTP listener wired through hooks.
- **Result**: Ten visual states, thirteen commits, ad-hoc signed (no Apple Developer Program needed), public on GitHub.

---

## Why I Built This

I kept noticing the Touch Bar sit dark above my keyboard. Apple removed it from the MacBook Pro lineup in 2021 and gave up on the software story years before that. Most apps that ever supported it have dropped support.

Meanwhile I'd been spending half my day in Claude Code. It's the kind of tool with constant state changes — thinking, running a tool, waiting on me, finishing — and I wanted some ambient signal of what was happening without staring at the terminal. Menu bar widgets feel like more notification noise. But the Touch Bar is two inches above the keyboard, always in my peripheral vision, doing nothing.

Both problems converged. The Touch Bar is the right surface for live session state, and Claude Code's hook system gives you the events. So I built clawd.

---

## The Problem

The Touch Bar shipped on 2016-2021 MacBook Pros and was discontinued with the M1 Pro generation. The function row never found its audience, the per-app contextual bars never matured, and most owners flipped to F-keys and forgot it existed.

The existing third-party tools for the Touch Bar are Pock and MTMR. Both are great, both focus on system widgets like volume sliders or window switchers. Neither is session-aware in the way Claude Code needs.

A menu bar widget would have been the obvious alternative. But a menu bar item competes with system notifications for attention, and the whole point of an ambient signal is that it sits there without demanding anything. The Touch Bar is structurally better for this.

---

## The Solution

clawd is a small character living on the left half of the Touch Bar. Ten visual states, driven by hook events:

| State | Trigger | What clawd shows |
|---|---|---|
| Waking | Session start | Alert pose with a "!", settles into idle |
| Idle | Nothing pending | One of four chill poses (headphones, reading, juggling, bubble) |
| Thinking | You submit a prompt | Thoughtful pose |
| Working | Tool call in progress | Tool-aware sprite: bash → typing, write/edit → building, read → reading |
| Asking | Claude needs your input | Lightbulb above clawd's head |
| Happy | Tool succeeded | Celebratory jump |
| Awaiting | Claude finished, your turn | Thought-bubble pose |
| Error | Tool failed | Downed clawd with ERROR text |
| Sleeping | Sustained idle | Curled up |
| Notification | Reserved for future hook types | (currently unused) |

The character walks back and forth across the stage continuously regardless of state. The Control Strip on the right stays fully visible, so brightness, volume, and mute keep working normally.

---

## Technical Architecture

The whole thing is a Swift Package Manager executable. No Xcode required, no Apple Developer Program, no 7-day expiry. Builds in roughly ten seconds.

Stack:

| Layer | Tech |
|---|---|
| UI | AppKit, NSImageView, CATransition for cross-fades |
| Touch Bar takeover | Apple's private DFRFoundation framework, linked via `@_silgen_name` and Obj-C runtime selector resolution |
| Networking | BSD sockets via the Darwin module, bound to 127.0.0.1:53777 |
| State machine | Plain Swift with auto-cancelling dispatch timers |
| Build + sign | Swift Package Manager, Makefile, ad-hoc codesign |
| License | AGPL-3.0 inherited from the sprite source |

The wiring loop: Claude Code fires a hook event, runs a curl command that posts the JSON payload to clawd's local listener, the state machine maps the event to a state, the animator picks a sprite, the Touch Bar updates. Round trip is under fifty milliseconds.

---

## Key Technical Decisions

**Modal Touch Bar over Control Strip slot.** The original plan was to render clawd in the small 30pt slot inside the Control Strip. I built it, then ran a smoke test on actual hardware and realized a 30pt-wide animated character is unreadable. I pivoted mid-build to the wide app-region modal Touch Bar (the same private API Pock uses for full-bar takeover). I gave up peaceful coexistence with other apps' Touch Bar items. I gained visibility. The README discloses the trade-off prominently.

**BSD sockets over Network.framework.** The standard answer is Network.framework. But on the Command Line Tools-only install on my Mac, the prebuilt Network swiftmodule failed to load with a compiler-version mismatch. Switching to raw BSD sockets via the Darwin module added about fifty lines of code, removed a toolchain dependency, and now the project builds on any Mac with `xcode-select --install`.

**Per-sprite Y offsets over autolayout centering.** NSImageView with `wantsLayer = true` draws via its CALayer, and the layer's `contentsGravity` overrides `imageAlignment`. Some sprites kept getting clipped at the top because the visible character sat in the upper portion of the source's bounding box. Instead of fighting the layer subsystem, I added a per-sprite Y offset dictionary. Four sprites get a small negative offset, the rest stay at zero. Small ongoing maintenance cost, predictable rendering today.

**Passive verification onboarding over synthetic round-trip.** The first design had the app send itself a fake hook event after the user pastes the config. That always succeeded since the listener was up, but it didn't prove the user's settings.json was actually wired. I switched to passive listening. The onboarding window waits for the first real hook event from Claude Code, then flips to "connected" and closes. Honest signal, no false positives.

---

## The Build Story

Built with Claude Code's compound-engineering workflow. A brainstorm doc captured the requirements and explicit non-goals, a plan doc broke v1 into seven implementation units with execution notes, and each unit shipped as one commit with proper attribution.

The project lived three lives:

**v1: scaffolding.** Swift Package Manager skeleton, DFRFoundation bindings, sprite pipeline, HTTP listener, state machine, onboarding window. Shipped as seven commits with traceable test cases.

**v2: contextual states.** Live testing on the actual Touch Bar surfaced two perceptual gaps. `Stop` looked like "session over" when it actually meant "your turn," and every tool call looked the same. v2 added a distinct `awaiting` state plus tool-aware working sprites (bash → typing keyboard, write → hammer and hard hat, read → sitting with a book). It also unified all "needs your response" signals — permission prompts plus blocking tool calls like AskUserQuestion and ExitPlanMode — into a single `asking` state.

**v2.5: visual polish.** The hardest part. One sprite had a solid green chroma-key background that nobody had stripped upstream. Another had asymmetric padding that made it sit at the top of the stage instead of centered. A third had elements (a lightbulb, juggling balls) reaching the top edge of the bounding box and getting clipped on the Touch Bar's small render. Each fix was its own small commit with a clear "before" and "after."

The mid-build pivot mattered most. The v1 plan called for clawd to live in the small Control Strip slot. When I actually ran it on Touch Bar hardware, the character was illegibly small. Instead of compressing the design around the slot, I rewrote U3 to take over the wide app region via the modal Touch Bar API. One wasted afternoon, but the alternative was shipping something nobody would use.

---

## Outcomes and What I Learned

- A full v1 + v2 + v2.5 shipped in one focused session: ten states, modal Touch Bar takeover, onboarding UI, thirty-eight tests, AGPL attribution chain intact, public on GitHub.
- The compound-engineering workflow kept the work coherent through multiple pivots. Every architectural change was a deliberate commit with a clear message, not a silent reverse.
- Live testing on the actual surface caught everything that pure unit tests missed: clipping, asymmetric centering, the chroma-key bug, the "stop means your turn" misread.

Three meta-insights:

1. **Visual code needs visual testing.** Unit tests catch logic. Only your eye catches "the question mark is clipped at the top" or "this sprite is sitting too high in the frame." The testing strategy has to match the medium.
2. **When an architectural assumption is wrong, pivot the architecture, not the design.** I spent time trying to make a small character work in a small slot before accepting that the slot was the wrong place. A small fix would have been a band-aid.
3. **AI-assisted building works best when you commit to the workflow's seams.** Brainstorm doc → plan doc → execute → polish makes each phase's output legible and reviewable. Trying to skip ahead loses context faster than you'd think.

---

## What I'd Do Differently

- Test against Apple's Touch Bar simulator (in Xcode) from day one instead of relying on hardware loops. It would have caught sprite clipping in the first few iterations instead of the fifth.
- Consider per-session state partitioning from v1, not v1.1+. With multiple Claude Code sessions running concurrently, last-event-wins is awkward. Easy to spot in retrospect, easy to defer in the moment.
- Record the demo earlier in the build, not after publishing. The GitHub page shipped with a missing hero image until the recording landed as a follow-up.

---

## Try It Yourself

On any MacBook Pro with Touch Bar hardware (2016 to 2021), macOS 13 or newer, with Claude Code installed:

```bash
git clone https://github.com/b-barri/clawd-touchbar.git
cd clawd-touchbar
xcode-select --install   # only if you don't have command line tools
make
open Clawd.app
```

The onboarding window walks you through a five-line addition to `~/.claude/settings.json`. Send a message in any Claude session and clawd reacts.

---

Source, license, and full attribution chain at [github.com/b-barri/clawd-touchbar](https://github.com/b-barri/clawd-touchbar).
