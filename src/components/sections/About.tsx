import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export default function About() {
  return (
    <section id="about" className="py-32 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="02" label="About" />
          <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal text-text-primary mb-12 leading-[1.05] tracking-tight">
            A builder, by choice.
          </h2>
          <div className="max-w-3xl space-y-6 text-lg text-text-secondary leading-[1.8]">
            <p>
              Biotech engineer by training, product builder by choice. After
              graduating from IIT Delhi in 2022, I joined Groww — what started
              as curiosity about how people make financial decisions quietly
              turned into a deep obsession with Search, Discovery, and
              Engagement.
            </p>
            <p>
              Somewhere along the way, LLMs entered the picture. I&apos;ve since
              built GenAI pipelines for financial content and LLM-powered
              document analysis systems — not because it was trendy, but because
              it genuinely made products smarter. From voice search to Stories
              and Rewards platforms at CRED, I care most about building things
              that feel effortless to the millions of people who never think
              twice about how it works.
            </p>
            <p>
              Off the clock: tech blogs, reading on my Kindle, prompt
              engineering experiments, and iPad sketching when I need a break
              from building.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
