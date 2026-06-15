# Literary Garden

**Your Kindle highlights and looked-up words, grown into a private garden you actually visit.**

Built in a weekend with Claude Code, open-sourced as a template. [github.com/b-barri/literary-garden](https://github.com/b-barri/literary-garden)

![Literary Garden, a scrapbook walkthrough](/videos/projects/literary-garden/scrapbook_recording.mp4)

## The words you underline, then forget

There's a quiet torpor that settles in the months after you close a good book. Every gorgeous word you once underlined dissipates into the banality of the next chapter. You look up *equipoise* for the third time, a little crestfallen, and accept that your vocabulary retention sits somewhere between facile and non-existent.

Here's the thing: your Kindle has been hoarding all of it the whole time, right there on the device. Every word you tap goes into [[vocab.db::a small database file your Kindle quietly keeps, listing every word you've ever tapped to look up]]. Every passage you highlight lands in a plain text file next to it called [[My Clippings.txt::a plain text file on the Kindle where all your highlighted passages are saved]]. Years of reading, just sitting there, with no way to practice the words and no surface where yesterday's discoveries meet today's.

I wanted an honest object for that. Not a reading tracker, not a Goodreads profile. A garden: words you looked up start as seedlings, bloom while you're actively learning them, and press into the album after three weeks of proven memory.

![Literary Garden, a phone demo](/videos/projects/literary-garden/demo.mp4#phone)

## Two beds, one garden

The site has two halves that share a look but do different jobs.

The **words bed** is the daily ritual. Each word you looked up becomes a flashcard with the exact Kindle sentence it came from on the back. Five new words a day, plus whatever's due for review. The card's appearance *is* its state: a pale ink outline when it's new (seedling), a full botanical illustration once it's in rotation (bloom), a pressed-flower album card once you've proven you remember it. No progress bar, no percentage, the screen rewards you without a single number on it.

![The words bed: cards in seedling, bloom, and pressed states](/images/projects/literary-garden/words-bed.webp)

The **scrapbook** is for wandering. A horizontal carousel of every book you highlighted, shown as spines on a shelf. Click one and it opens on a 3D hinge, its passages fanning out below. Any quote exports as a watercolor card you can send to a friend.

![The scrapbook: a spine carousel with the focused book bloomed open](/images/projects/literary-garden/scrapbook.webp)

The whole thing is a [[static site::a website that's just prebuilt files, with no server or database running behind it]] reading directly from those two Kindle files. Spaced repetition runs on [[FSRS::a modern algorithm that schedules each word for review right before you'd forget it, and learns your personal recall pace]], a sharper successor to the old Anki default. And it's private by construction: your reading data never leaves your laptop unless you choose to deploy it. The repo is a shareable template, not a copy of my library.

## Function differs, form unifies

Both beds speak one visual language: warm cream paper, sage and sepia ink, faint watercolor washes, italic display type. Three choices set that tone.

The paper isn't an image, it's a layered gradient plus a little generated noise, the same trick print designers use, so it ships fast and stays crisp. Every book's spine color is pulled from its own cover (the dominant color, sampled automatically), and that color then drives the spine, the detail page accent, and the share-card border, so each book paints its own chrome. And any passage exports as a 1080×1350 image sized for Instagram and WhatsApp, stamped with a personal wax seal, captioned simply: *"i thought this would resonate with you."*

![The share modal: a watercolor card with the book's spine color, the passage, and a wax-seal stamp](/images/projects/literary-garden/share-modal.webp)

The hinge motion in the carousel is borrowed from [Adam Maj's bookshelf](https://adammaj.com), where the focused book rotates out from its binding while the spine swings back behind it. A flat grid of covers would have been denser, but it would have felt like scrolling a feed instead of walking past a shelf.

## The bug I chased for a day

The carousel had a hiccup I lost hours to. Clicking a book on the right would scroll, but it would land just off-center, drift, then snap into place. Wrong in a way you feel before you can name it.

I assumed it was a scroll-snap problem and tried three CSS fixes. Nothing. Then I traced it properly: the code read the target book's position the instant you clicked, but the previously-focused book was still animating its width shut over 620 milliseconds, shoving every book after it sideways while the scroll was in flight. The scroll was aiming at where the book *had been*. The fix was to compute the destination from the resting layout rather than the mid-animation position, and pause snapping until the scroll finished. Three lines of insight on top of a day of debugging.

## What I learned working with AI

The carousel bug is the whole lesson in one story. AI is genuinely fast at executing a plan. It is not good at telling you the plan is wrong, or that the bug you're describing has a cause you haven't considered. That judgment is still the human's job, and it usually shows up disguised as hours of "why won't this work."

The other thing that made the build fast was having an aesthetic brief. Most AI code review drifts toward the abstract. "Warm cream paper, watercolor wash, italic display type" is concrete enough that the agent can build against it and I can tell at a glance when it's wandering off. And making the app local-first wasn't only a privacy stance, it was a scoping superpower: no auth, no accounts, no data policy. The feature set writes itself when the blast radius is your own laptop.

## Try it

The repo is a clonable template. If your Kindle has Vocabulary Builder turned on:

```bash
git clone https://github.com/b-barri/literary-garden
cd literary-garden
pnpm install
# copy your Kindle's vocab.db + My Clippings.txt into data/raw/
pnpm seed
pnpm dev
```

The full walkthrough, including how to pull `vocab.db` off the Kindle itself, is in the [README](https://github.com/b-barri/literary-garden#readme).
