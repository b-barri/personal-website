import ScrollReveal from "@/components/ui/ScrollReveal";

export default function About() {
  return (
    <section id="about" className="py-24 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-8">
            About
          </h2>
          <div className="max-w-3xl space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              I&apos;m Bhavya Barri, a Product Manager who builds things on the
              side. I believe the best way to understand a problem is to build a
              solution for it — even if it&apos;s scrappy, even if it&apos;s
              just for you.
            </p>
            <p>
              My side projects span AI-powered tools, Claude Code skills,
              content workflows, and the occasional hardware hack. Each one
              started as a question I couldn&apos;t shake — and ended as
              something I shipped.
            </p>
            <p>
              By day, I work on AI products. By night, I&apos;m usually
              prototyping the next Side Quest.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
