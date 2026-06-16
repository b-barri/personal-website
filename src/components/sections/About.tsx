import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CatalogLabel from "@/components/ui/CatalogLabel";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <CatalogLabel number="02" className="mb-6">Return Address</CatalogLabel>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-12 md:mb-16 leading-[1.05] tracking-tight">
            The work is the point.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-16 items-start">
            {/* Bio text */}
            <div className="space-y-5 text-base md:text-lg text-text-secondary leading-[1.8] order-2 md:order-1">
              <p>
                Biotech engineer by training. Product builder because I
                couldn&apos;t stop noticing what was broken.
              </p>
              <p>
                I graduated from IIT Delhi in 2022, joined Groww, and spent the
                next few years pulling on three threads in sequence. First,
                search, that one small box where people type when they
                don&apos;t know the right word for what they want. Then
                engagement, specifically how in-app stories could make a
                financial app feel alive instead of transactional. Then AI,
                building an in-house news and content pipeline because the same
                question kept coming up: how do you get the right information to
                the right person before they know to ask for it.
              </p>
              <p>
                At Cred, I moved into commerce, the Rewards platform and Cred
                Store, where the job was making discovery and purchase feel like
                one motion, not two.
              </p>
              <p>
                The common thread across all of it is not the domain. It is a
                question I keep returning to: what actually endures? Software
                ages fast. An interface that looks great today looks dated in
                ten years. But the community around a product, the problem it
                stands for, the trust it builds, those outlast the UI. A Birkin
                bag is decades old and appreciating. Buildings get more
                interesting with time. Software almost never does. So the work I
                care about is the layer underneath the product: what does it
                mean to people, and would they miss it if it disappeared.
              </p>
              <p>
                Off the clock: home barista in progress, Kindle reader, Substack
                writer, and iPad sketcher when I need to make something with my
                hands.
              </p>
            </div>

            {/* Photo — mounted as a return-address portrait: an archival print
                held by album corners, cancelled by a Bangalore postmark, and
                signed by hand. The section header is "Return Address"; the photo
                is the sender's slug on the back of the envelope. */}
            <div className="order-1 md:order-2">
              <figure className="relative mx-auto max-w-xs paper-grain rounded-[2px] border border-border bg-bg-primary p-2.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out md:mx-0 md:max-w-none md:-rotate-[1.2deg] md:hover:rotate-0 md:hover:-translate-y-0.5">
                {/* matted print — the mat is the paper the album corners grip */}
                <div className="relative p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1px] ring-1 ring-black/[0.06] dark:ring-white/[0.08]">
                    <Image
                      src="/images/about.jpg"
                      alt="Bhavya Barri"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 33vw"
                      priority
                    />
                  </div>
                  {/* album mounting corners grip the print over the mat */}
                  <span className="photo-corner tl" aria-hidden="true" />
                  <span className="photo-corner tr" aria-hidden="true" />
                  <span className="photo-corner bl" aria-hidden="true" />
                  <span className="photo-corner br" aria-hidden="true" />
                </div>

                {/* return-address slug + hand signature */}
                <figcaption className="mt-2 flex items-end justify-between gap-4 px-1">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase leading-relaxed tracking-[0.14em] text-text-primary/70">
                    <span className="block text-text-secondary">The sender</span>
                    <span className="block text-text-primary/85">Bhavya Barri</span>
                    <span className="block">Bangalore · IN</span>
                  </span>
                  <span className="font-[family-name:var(--font-hand)] -rotate-6 text-2xl leading-none text-text-secondary">
                    b.
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
