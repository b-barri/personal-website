import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";

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
    <section id="resume" className="py-20 md:py-32 bg-bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="05" label="Experience" />
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
            Where I&apos;ve built.
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
            Building product at CRED and Groww across Search, Discovery,
            Engagement, Rewards, and AI platforms.
          </p>

          {/* Experience timeline */}
          <div className="space-y-12 mb-20 max-w-3xl">
            {experience.map((item) => (
              <div key={item.role} className="flex gap-6">
                <div className="w-px bg-border shrink-0 relative">
                  <div className="absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-1">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-normal text-text-primary leading-tight">
                      {item.role}
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-text-secondary font-[family-name:var(--font-inter)] shrink-0">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-accent mb-4 uppercase tracking-wider">
                    {item.company}
                  </p>
                  <ul className="space-y-2.5">
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
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal text-text-primary mb-8 italic">
            Education
          </h3>
          <div className="flex gap-6 max-w-3xl">
            <div className="w-px bg-border shrink-0 relative">
              <div className="absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-1">
                <h4 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-normal text-text-primary leading-tight">
                  {education.school}
                </h4>
                <span className="text-xs uppercase tracking-widest text-text-secondary font-[family-name:var(--font-inter)] shrink-0">
                  {education.period}
                </span>
              </div>
              <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">
                {education.degree}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {education.detail}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
