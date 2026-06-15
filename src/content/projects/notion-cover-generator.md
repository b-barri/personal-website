# Notion Cover Generator

**Type in a blog title, get back a hand-drawn Notion cover in one consistent style.**

My Notion was a mess of stock photos that didn't go together. Every page had a different vibe because every cover came from a different place, and the workspace felt like a junk drawer. I didn't want to learn illustration or pay someone per cover. I wanted one look, applied everywhere, with as little effort as typing.

So I built Notion Pixie Doodler. You give it a blog title and a short description, and it draws a cover in a fixed style: delicate black ink line art with soft pink watercolor on a white background, a small girl in a pink coat somewhere in the frame doing something related to what you wrote about. The output is sized 1500 by 600, which is Notion's cover format, with room left at the bottom so the page icon doesn't land on top of her.

The point isn't any single image. It's that every cover comes out looking like it belongs to the same set. Open ten pages and they read as one workspace instead of ten unrelated tabs.

I made it on [[Lovable::a tool where you describe an app in plain English and it builds the working version for you, front end and back end together]], which meant I could focus on the look and the rules of the style rather than wiring. The actual drawing happens in a small server-side function that calls [[Google Gemini::Google's family of AI models, used here for turning a text prompt into an image]] to generate each cover on demand. Storage and the backend run on [[Supabase::a ready-made backend, the database and file storage you'd otherwise have to set up and run yourself]] underneath.

The hard part wasn't getting an image. It was getting the same image twice. A loose prompt gives you ten different art styles for ten different titles, which is the exact problem I started with. Most of the work was pinning the style down hard enough that the model stays on a leash: same line weight, same pink, same character, same empty space for the icon, every time, no matter what you type in.

Try it at [notion-pixie-doodler.lovable.app](https://notion-pixie-doodler.lovable.app/).
