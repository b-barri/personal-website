import ScrollReveal from "@/components/ui/ScrollReveal";

const experience = [
  {
    role: "Product Manager II, Rewards Platform & CRED Store",
    company: "CRED",
    period: "Dec 2025 — Present",
    highlights: [
      "Designed Choice Stack — a time-bound, themed shopping arena to nudge multi-cart purchases and drive GMV lift; product scoped and in pre-launch",
      "Driving Rewards Platform × Checkout integration to expose relevant offers at the payment stage, targeting improved conversion rates; in progress",
    ],
  },
  {
    role: "Product Manager I, Engagement (AI & Platform)",
    company: "Groww",
    period: "Aug 2024 — Nov 2025",
    highlights: [
      "Led Annual Flashback feature reaching 5.2M+ users with 73.4% completion rate and 59% revisit engagement",
      "Built GenAI-powered financial news system processing 5,700+ articles daily with semantic deduplication and custom NER",
      "Created LLM-based document analysis tools that reduced quarterly report processing from one day to two hours",
      "Scaled Stories platform to 80M+ users with templated content and smart prioritization",
    ],
  },
  {
    role: "Associate Product Manager II, Search, Discovery & Referral",
    company: "Groww",
    period: "Aug 2023 — Aug 2024",
    highlights: [
      "Launched multi-language voice search handling 1.2M+ daily queries, increasing repeat usage by 21%",
      "Redesigned in-app rating system, doubling weekly submissions from 5K to 10K",
      "Created link-based referral program contributing 3.5% conversion share",
    ],
  },
  {
    role: "Associate Product Manager I, Search and Discovery",
    company: "Groww",
    period: "Jul 2022 — Aug 2023",
    highlights: [
      "Implemented word correction model reducing null searches by 2%",
      "Launched 'Pills in Search' feature capturing 21% of underserved browse demand",
    ],
  },
];

const education = {
  school: "Indian Institute of Technology, Delhi",
  degree: "B.Tech in Biochemical Engineering & Biotechnology",
  detail: "Minor in Entrepreneurship",
  period: "2018 — 2022",
};

export default function Resume() {
  return (
    <section id="resume" className="py-24 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-4">
            Experience
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl">
            Building product at CRED and Groww across Search, Discovery,
            Engagement, Rewards, and AI platforms.
          </p>

          {/* Experience timeline */}
          <div className="space-y-10 mb-16 max-w-3xl">
            {experience.map((item) => (
              <div key={item.role} className="flex gap-5">
                <div className="w-1 bg-accent/30 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1 gap-1">
                    <h3 className="text-lg md:text-xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                      {item.role}
                    </h3>
                    <span className="text-sm text-text-secondary font-[family-name:var(--font-inter)] shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-accent mb-3">
                    {item.company}
                  </p>
                  <ul className="space-y-2">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="text-text-secondary leading-relaxed pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-accent"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-6">
            Education
          </h3>
          <div className="flex gap-5 mb-12 max-w-3xl">
            <div className="w-1 bg-accent/30 rounded-full shrink-0" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1 gap-1">
                <h4 className="text-lg md:text-xl font-semibold font-[family-name:var(--font-heading)] text-text-primary">
                  {education.school}
                </h4>
                <span className="text-sm text-text-secondary font-[family-name:var(--font-inter)] shrink-0">
                  {education.period}
                </span>
              </div>
              <p className="text-sm font-medium text-accent mb-1">
                {education.degree}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {education.detail}
              </p>
            </div>
          </div>

          {/* Download button */}
          <a
            href="https://docs.google.com/document/d/15oVn3fsh1IK-v_hSKwbzVRP0iOSNl7_jMI1jGm6RAhE/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Full Resume
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
