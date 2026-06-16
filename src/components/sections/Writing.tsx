import ScrollReveal from "@/components/ui/ScrollReveal";
import CatalogLabel from "@/components/ui/CatalogLabel";
import { writings } from "@/data/writings";
import type { ReactNode } from "react";

// The postcard's "stamp" is the publication's logo in its brand colour — Substack
// orange; Medium in themed ink so it reads on both themes. Unknown platforms fall
// back to the initial letter.
const PLATFORM_MARKS: Record<string, { color: string; icon: ReactNode }> = {
  Substack: {
    color: "#FF6719",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  Medium: {
    color: "var(--color-text-primary)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12ZM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12Z" />
      </svg>
    ),
  },
};

export default function Writing() {
  return (
    <section id="writing" className="py-20 md:py-32 bg-grid">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <CatalogLabel number="03" className="mb-6">Dispatches</CatalogLabel>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
            Thinking out loud.
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
            Writing is how I figure out what I actually think.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {writings.map((writing) => (
              <a
                key={writing.title}
                href={writing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group paper-grain block rounded-[3px] border border-border bg-bg-primary dark:bg-bg-surface p-6 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                {/* divided postcard back: message left, address right */}
                <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                  {/* message side — the dispatch */}
                  <div className="border-r border-border pr-5">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-accent">
                      {writing.platform}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-normal leading-tight text-text-primary transition-colors group-hover:text-accent">
                      {writing.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {writing.description}
                    </p>
                  </div>

                  {/* address side — stamp box, ruling, destination */}
                  <div className="flex flex-col">
                    {(() => {
                      const mark = PLATFORM_MARKS[writing.platform];
                      return (
                        <span
                          aria-hidden="true"
                          className="grid h-14 w-12 place-items-center self-end rounded-[1px] border border-dashed"
                          style={
                            mark
                              ? {
                                  color: mark.color,
                                  backgroundColor: `color-mix(in srgb, ${mark.color} 10%, transparent)`,
                                  borderColor: `color-mix(in srgb, ${mark.color} 42%, transparent)`,
                                }
                              : {
                                  color: "var(--color-text-secondary)",
                                  borderColor:
                                    "color-mix(in srgb, var(--color-text-secondary) 45%, transparent)",
                                }
                          }
                        >
                          {mark ? (
                            mark.icon
                          ) : (
                            <span className="font-[family-name:var(--font-playfair)] text-lg italic">
                              {writing.platform.charAt(0)}
                            </span>
                          )}
                        </span>
                      );
                    })()}
                    <div className="mt-auto">
                      <span aria-hidden="true" className="block space-y-2.5 pt-4">
                        <span className="block h-px bg-border" />
                        <span className="block h-px bg-border" />
                        <span className="block h-px w-2/3 bg-border" />
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-text-secondary transition-colors group-hover:text-accent">
                        Read
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
