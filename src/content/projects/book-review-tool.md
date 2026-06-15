# Book Review Tool

**Turns the messy notes you scribble after finishing a book into a presentation worth sharing.**

I read a fair bit, and the notes I take are a graveyard. Half-sentences in my phone, a few underlined quotes, a verdict I meant to send to a friend and never did. The thoughts were fine. They just never made it out of the drafts folder, because turning them into something presentable felt like more work than the book deserved.

So I built the smallest tool that closes that gap. You drop in the title and author, paste in whatever you actually wrote, pick a couple of style knobs, and it hands you back a clean, visual document you'd be happy to send to someone.

There are two ways in, because I write about books in two different moods. Personal Review is for my own take, the verdict I'd give a friend who asked. Book Club Recap is for the messier group version, where the interesting part is the disagreement, not my opinion. Same engine underneath, different shape on the way out.

The knobs are deliberately few. A document vibe, like Modern, that sets the overall feel. An image style, like Photorealistic, for the generated art. And a reading-progress slider, because I wanted to be able to write about a book I'm halfway through without pretending I've finished it. Everything else I left out on purpose. The whole point was to lower the friction, not hand myself a design tool.

The actual document gets built by the [[Gamma API::Gamma is a tool that makes slick presentation decks and docs from a prompt. The API is the version you call from your own code instead of clicking around their app]], which does the layout and the imagery so I don't have to. My job was the front of the house in [[React::the standard toolkit for building interactive web pages, the input fields and buttons people click]]: the inputs, the two modes, the styling choices, and handing it all off cleanly.

The early outputs are the ones that told me it was working. A solo review of *Small Things Like These* by Claire Keegan. A book club recap of *Pride and Prejudice*, group argument and all. A take on *Dune* by Frank Herbert. Each one took the kind of notes that usually die in my drafts and made them something I'd actually press send on. That was the whole bet.
