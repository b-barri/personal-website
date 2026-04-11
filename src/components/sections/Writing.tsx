import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { writings } from "@/data/writings";

export default function Writing() {
  return (
    <section id="writing" className="py-32 bg-grid">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="03" label="Writing" />
          <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal text-text-primary mb-6 leading-[1.05] tracking-tight">
            Notes from the build.
          </h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl leading-relaxed">
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
                className="group block p-7 rounded-2xl border border-border bg-white hover:border-accent/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-medium text-accent uppercase tracking-widest font-[family-name:var(--font-inter)]">
                    {writing.platform}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-normal text-text-primary group-hover:text-accent transition-colors mb-3 leading-tight">
                  {writing.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {writing.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
                  Read
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
