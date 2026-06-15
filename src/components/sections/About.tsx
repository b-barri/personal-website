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
                I studied biotech and chose product the week I graduated, not
                because I had a plan, but because I couldn&apos;t stop noticing
                what was broken.
              </p>
              <p>
                Four years at Groww, then Cred. I spent most of it close to the
                search bar, what people type when they don&apos;t know the right
                word for what they want. That question took me into LLM
                pipelines, document analysis, and eventually building with
                Claude.
              </p>
              <p>
                Off-hours: same thing, smaller canvas. iPad sketches. Side
                projects that ship. Books I finish, not just start.
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
