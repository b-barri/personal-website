import ScrollReveal from "@/components/ui/ScrollReveal";
import { writings } from "@/data/writings";

export default function Writing() {
  return (
    <section id="writing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-4">
            Writing
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl">
            Thoughts on building with AI, shipping side projects, and working in
            public.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {writings.map((writing) => (
              <a
                key={writing.title}
                href={writing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-xl border border-border bg-white hover:border-accent/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    {writing.platform}
                  </span>
                </div>
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary group-hover:text-accent transition-colors mb-2">
                  {writing.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {writing.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
