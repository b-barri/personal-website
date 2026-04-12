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
            A builder, by choice.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-16 items-start">
            {/* Bio text */}
            <div className="space-y-5 text-base md:text-lg text-text-secondary leading-[1.8] order-2 md:order-1">
              <p>
                Biotech engineer by training, product builder by choice. After
                graduating from IIT Delhi in 2022, I joined Groww — what started
                as curiosity about how people make financial decisions quietly
                turned into a deep obsession with Search, Discovery, and
                Engagement.
              </p>
              <p>
                Somewhere along the way, LLMs entered the picture. I&apos;ve
                since built GenAI pipelines for financial content and LLM-powered
                document analysis systems — not because it was trendy, but
                because it genuinely made products smarter. From voice search to
                Stories and Rewards platforms at CRED, I care most about
                building things that feel effortless to the millions of people
                who never think twice about how it works.
              </p>
              <p>
                Off the clock: tech blogs, reading on my Kindle, prompt
                engineering experiments, and iPad sketching when I need a break
                from building.
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
