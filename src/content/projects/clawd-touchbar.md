# clawd-touchbar

**A tiny pixel crab that lives on your MacBook's Touch Bar and reacts to what Claude Code is doing.**

![clawd-touchbar, live demo on a MacBook Pro Touch Bar](/videos/projects/clawd-touchbar/demo.mp4)

## The dead strip above the keyboard

Apple gave up on the Touch Bar in 2021, and gave up on caring about it years before that. Mine just sat there above the keyboard, a dark strip of wasted screen, while I spent half my day in Claude Code watching a terminal for state changes. Is it thinking? Running something? Waiting on me? Done?

Those two facts collided one evening. I wanted some ambient sense of what my agent was doing without staring at the terminal, and I had two inches of always-on display doing absolutely nothing. A menu-bar icon would just add to the notification pile. The Touch Bar sits in your peripheral vision and asks for nothing in return. It was the right surface, and nobody was using it.

I wasn't the first to think a creature could live up there. Grace Avery's [Touchbar Pet](https://screenrant.com/touch-bar-tamagotchi-macbook-pro-touchbar-pet/), a little cat that paces the strip and naps between meals, had already shown the Touch Bar could hold a character with moods. clawd borrows that spirit and points it at a different job: not a pet you look after, but a coworker that quietly mirrors what your AI is doing.

![Grace Avery's Touchbar Pet, a pixel cat that walks along the MacBook Touch Bar](/images/projects/clawd-touchbar/inspiration-touchbar-pet.jpg "The spark: Grace Avery's Touchbar Pet (image via ScreenRant).")

## How clawd works

![How clawd works: from a keystroke in Claude Code to a pixel on the Touch Bar, in six steps](/images/projects/clawd-touchbar/how-it-works.svg)

clawd is a little crab who paces back and forth on the Touch Bar and changes what he's doing based on your session. Ten poses in all. He types when Claude runs a shell command, picks up a hammer when it writes a file, sits down with a book when it reads one, throws his hands up when something breaks, and curls up to sleep when you walk away.

What makes that possible is [[hooks::little scripts Claude Code runs automatically whenever something happens. A task starts, a tool runs, a turn ends]]: Claude fires one on every event, and each quietly hands clawd the news through a [[local socket::a tiny private channel on your own machine that lets two programs talk to each other, without ever touching the internet]]. clawd just listens and reacts, in under fifty milliseconds.

Getting him onto the Touch Bar at all meant going where Apple would rather you didn't. There's no supported way to draw your own thing up there, so clawd leans on [[DFRFoundation::a hidden, undocumented piece of Apple's own code that controls the Touch Bar. Apps aren't meant to touch it, so there's no manual, and you reverse-engineer how it works]]. It's the same private machinery the handful of other Touch Bar tools quietly use. The whole app is one [[Swift::Apple's programming language for building Mac and iPhone software]] program built with [[Swift Package Manager::Apple's built-in build tool, so you don't need Xcode, Apple's big, heavy code editor]]. It compiles in about ten seconds and runs without the usual ceremony.

## The afternoon I almost shipped the wrong thing

The plan was to put clawd in the little 30-point slot inside the Control Strip, so he'd sit politely next to your volume and brightness keys. I built exactly that, ran it on real hardware, and he was a smear. A 30-pixel-wide animated character is illegible. It's noise. The tempting fix was to keep the slot and simplify the sprites until they read at that size. The right fix was to admit the slot itself was the problem, and rewrite it to take over the Touch Bar's entire app region instead. I lost polite coexistence with other apps. I got a crab you can actually see, and I put that trade-off at the top of the README so nobody's surprised.

That afternoon is the whole project in miniature. When something isn't working, the real question is whether you're fixing the design or papering over a decision underneath it that was wrong from the start. I spent hours shrinking a character to fit a box before I accepted the box was never going to work.

## When the surface fought back

The networking almost didn't ship. The modern, friendly way to do it is [[Network.framework::Apple's current, polished toolkit for letting programs talk over a network]], but on my machine it refused to load because of a toolchain version mismatch. Rather than chase the toolchain, I dropped down to [[BSD sockets::the decades-old, bare-metal way for programs to pass data to each other. Old-fashioned, but it works on any Mac with no special setup]]. Fifty extra lines, one fewer thing to break.

The sprites needed my eyes, not my tests. One shipped with a leftover [[chroma key::the green-screen trick, a solid background color that's supposed to be made invisible, except here nobody had]] green background. Another sat too high and got clipped on the narrow strip. Unit tests catch broken logic; only looking at the thing catches "the question mark is cut off at the top." The testing has to match the medium.

## Two decisions I'm glad I made

Onboarding doesn't lie to you. Instead of faking a self-test that always passes, the setup window sits quietly and waits for a real event from your actual Claude session before it says "connected."

And clawd is [[ad-hoc signed::Apple makes you cryptographically "sign" an app before the Mac will trust it. Ad-hoc signing is the free, do-it-yourself version, so you skip Apple's $99-a-year Developer Program]], so anyone can build and run it without paying Apple a cent. It's [[AGPL::a strict open-source license: anyone can use and change the code, but they have to keep their version open too]], inherited from the artist whose sprites clawd is built on.

## What I learned working with AI

I build these with Claude Code, and clawd is where one habit earned its keep. Before any code, I had it draft a short plan: v1 broken into a handful of small pieces, each meant to ship as a single commit. So when the Control Strip idea fell apart on real hardware, the pivot wasn't a rewrite of the whole app. It was throwing out one piece and slotting in another. The plan made the mistake cheap. I used to treat planning as overhead and skip straight to building. Now I think the plan is the thing that lets you change your mind without unravelling everything around it.

clawd shipped in one sitting, and it's the rare side project where the thing I built is also a thing I use every day.

## Try it

Any Touch Bar MacBook (2016 to 2021), macOS 13 or newer, Claude Code installed:

```bash
git clone https://github.com/b-barri/clawd-touchbar.git
cd clawd-touchbar
xcode-select --install   # only if you don't have command line tools
make
open Clawd.app
```

The onboarding walks you through a five-line addition to `~/.claude/settings.json`. Send a message in any session and he wakes up.

Source, license, and full attribution chain at [github.com/b-barri/clawd-touchbar](https://github.com/b-barri/clawd-touchbar) (AGPL-3.0).
