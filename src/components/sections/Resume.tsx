import ScrollReveal from "@/components/ui/ScrollReveal";

const highlights = [
  {
    role: "Product Manager",
    company: "Sarvam AI",
    description: "Building AI products that scale across languages and modalities.",
  },
  {
    role: "Side Project Builder",
    company: "11+ shipped projects",
    description:
      "From AI-powered PRD auditors to open-source claw machines — building across the stack with Claude Code, Cursor, and Lovable.",
  },
  {
    role: "Builder in Public",
    company: "Writing & sharing",
    description:
      "Documenting the process of building side projects with AI tools, one shipped experiment at a time.",
  },
];

export default function Resume() {
  return (
    <section id="resume" className="py-24 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-12">
            Experience
          </h2>

          <div className="space-y-8 mb-12 max-w-3xl">
            {highlights.map((item) => (
              <div key={item.role} className="flex gap-4">
                <div className="w-1 bg-accent/20 rounded-full shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                    {item.role}
                  </h3>
                  <p className="text-sm text-accent font-medium mb-2">
                    {item.company}
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
