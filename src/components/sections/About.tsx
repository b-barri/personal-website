import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="02" label="About" />
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

            {/* Photo */}
            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-md">
                <Image
                  src="/images/about.jpg"
                  alt="Bhavya Barri"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-widest text-text-secondary text-center font-[family-name:var(--font-inter)]">
                <span className="font-[family-name:var(--font-playfair)] italic normal-case text-sm">
                  Bhavya
                </span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
