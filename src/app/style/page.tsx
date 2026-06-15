import type { Metadata } from "next";
import { projects } from "@/data/projects";
import CatalogLabel from "@/components/ui/CatalogLabel";
import Stamp from "@/components/ui/Stamp";
import StampGrid from "@/components/ui/StampGrid";
import Postcard from "@/components/ui/Postcard";

// Private reference for the postal-archive visual language (Track A1), set as a
// catalogue specimen sheet rather than a dev styleguide: ink-chip cards, type
// foundry specimens, an album page with mounting corners + a loupe, a divided-
// back postcard, print-proof registration marks, and a colophon. The chrome of
// the page is itself the taste argument. Toggle light/dark with the nav switch.
export const metadata: Metadata = {
  title: "Postal language — specimen sheet",
  robots: { index: false, follow: false },
};

const INKS: { no: string; name: string; token: string; hex: string }[] = [
  { no: "01", name: "Paper · Cream", token: "--color-bg-primary", hex: "#FEFFFC" },
  { no: "02", name: "Paper · Mat", token: "--color-bg-surface", hex: "#F5F5F0" },
  { no: "03", name: "Charcoal Ink", token: "--color-text-primary", hex: "#2C2C2C" },
  { no: "04", name: "Graphite", token: "--color-text-secondary", hex: "#6B7280" },
  { no: "05", name: "Accent · Blue", token: "--color-accent", hex: "#3B82F6" },
  { no: "06", name: "Deckle Rule", token: "--color-border", hex: "#DEE2DE" },
  { no: "07", name: "Oxblood · Postmark", token: "--color-frank", hex: "#A63D2F" },
];

const TYPEFACES: {
  glyph: string;
  family: string;
  name: string;
  role: string;
  pangram: string;
}[] = [
  {
    glyph: "Aa",
    family: "var(--font-playfair)",
    name: "Playfair Display",
    role: "Display · titles",
    pangram: "I make things I can't stop thinking about.",
  },
  {
    glyph: "Aa",
    family: "var(--font-heading)",
    name: "Space Grotesk",
    role: "Headings · buttons",
    pangram: "The work is the point.",
  },
  {
    glyph: "Aa",
    family: "var(--font-body)",
    name: "Inter",
    role: "Body · long-form",
    pangram: "Side projects are how I think. These are the ones that made it out.",
  },
  {
    glyph: "01",
    family: "var(--font-mono)",
    name: "IBM Plex Mono",
    role: "Catalogue metadata",
    pangram: "NO. 04 · AI TOOL · BENGALURU · 2024–2025",
  },
  {
    glyph: "Bb",
    family: "var(--font-hand)",
    name: "Caveat",
    role: "Marginalia · the gift",
    pangram: "make the thing you can't stop thinking about.",
  },
];

const ALBUM: {
  imageSrc: string;
  alt: string;
  no: string;
  category: string;
  title: string;
  slug: string;
}[] = [
  { imageSrc: "/images/artworks/art-10.jpg", alt: "Watercolour portrait", no: "No. 04", category: "AI Tool", title: "Mockingbird", slug: "mockingbird" },
  { imageSrc: "/images/artworks/art-06.jpg", alt: "Northern lights", no: "No. 07", category: "Claude Skill", title: "Literary Garden", slug: "literary-garden" },
  { imageSrc: "/images/artworks/art-03.jpg", alt: "Neon cube in forest", no: "No. 09", category: "Experiment", title: "clawd", slug: "clawd-touchbar" },
  { imageSrc: "/images/artworks/art-12.jpg", alt: "Girl cooking", no: "No. 11", category: "PM Tool", title: "PRD Auditor", slug: "prd-auditor" },
];

function RegMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 text-text-secondary/70 ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path d="M12 1v9M12 14v9M1 12h9M14 12h9" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function Plate({
  numeral,
  label,
  caption,
  children,
}: {
  numeral: string;
  label: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-10 pb-16">
      <div className="mb-9 flex items-baseline gap-5">
        <span className="font-[family-name:var(--font-playfair)] text-3xl italic leading-none text-text-primary/35">
          {numeral}
        </span>
        <div className="flex-1">
          <CatalogLabel rule>{label}</CatalogLabel>
          {caption && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{caption}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function StyleReference() {
  return (
    <main id="main" className="flex-1 bg-bg-primary bg-grid">
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-20 sm:px-8">
        {/* The sheet */}
        <div className="paper-grain relative border border-border bg-bg-primary px-6 py-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] sm:px-12 sm:py-14">
          {/* crop brackets + registration marks */}
          <span className="crop-bracket tl" aria-hidden="true" />
          <span className="crop-bracket tr" aria-hidden="true" />
          <span className="crop-bracket bl" aria-hidden="true" />
          <span className="crop-bracket br" aria-hidden="true" />
          <RegMark className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-bg-primary" />
          <RegMark className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-bg-primary" />

          {/* ---- Masthead ---- */}
          <header className="relative z-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.32em] text-text-secondary">
                  The Studio Archive · Specimen Sheet
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-[2.6rem] font-medium leading-[0.98] tracking-tight text-text-primary sm:text-6xl">
                  The Postal Language
                </h1>
                <p className="mt-3 max-w-md font-[family-name:var(--font-playfair)] text-lg italic text-text-secondary">
                  A reference plate of every ink, type, and stamp in the system.
                </p>
              </div>
              {/* catalogue block */}
              <div className="shrink-0 border border-border bg-bg-surface/60 px-5 py-4 font-[family-name:var(--font-mono)] text-[10px] uppercase leading-[2] tracking-[0.16em] text-text-secondary">
                <div className="flex justify-between gap-8"><span>Plate</span><span className="text-text-primary">I / I</span></div>
                <div className="flex justify-between gap-8"><span>Compiler</span><span className="text-text-primary">B. Barri</span></div>
                <div className="flex justify-between gap-8"><span>Place</span><span className="text-text-primary">Bengaluru</span></div>
                <div className="flex justify-between gap-8"><span>Rev.</span><span className="text-text-primary">2026·06·15</span></div>
                <div className="mt-1 flex justify-between gap-8 border-t border-border pt-1"><span>Status</span><span className="text-frank">Internal · noindex</span></div>
              </div>
            </div>

            {/* press color bar */}
            <div className="mt-8 flex items-center gap-3">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-text-secondary">Ink bar</span>
              <div className="flex h-3.5 flex-1 overflow-hidden rounded-[2px] border border-border">
                {INKS.map((ink) => (
                  <span key={ink.token} className="flex-1" style={{ background: `var(${ink.token})` }} />
                ))}
              </div>
            </div>
          </header>

          <div className="relative z-10 mt-12">
            {/* ---- Plate I · Inks ---- */}
            <Plate
              numeral="I"
              label="Inks &amp; papers"
              caption="The whole palette is paper and ink. Blue is the one accent, carried only on interactive moments; the watercolours are the only other colour on the site."
            >
              <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4 lg:grid-cols-7">
                {INKS.map((ink) => (
                  <figure key={ink.token}>
                    <div
                      className="h-20 rounded-[3px] border border-border"
                      style={{ background: `var(${ink.token})` }}
                    />
                    {/* tint ladder */}
                    <div className="mt-1 flex h-1.5 overflow-hidden rounded-[1px]">
                      {[85, 65, 45, 25].map((p) => (
                        <span
                          key={p}
                          className="flex-1"
                          style={{ background: `color-mix(in srgb, var(${ink.token}) ${p}%, var(--color-bg-primary))` }}
                        />
                      ))}
                    </div>
                    <figcaption className="mt-2.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase leading-[1.7] tracking-[0.1em] text-text-secondary">
                      <span className="text-accent">{ink.no}</span> · {ink.name}
                      <br />
                      <span className="text-text-primary/70">{ink.hex}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Plate>

            {/* ---- Plate II · Type ---- */}
            <Plate numeral="II" label="Typefaces" caption="Five hands. A serif for display, a grotesk for structure, a humanist for reading, a monospace for the catalogue, and a script for marginalia.">
              <div className="divide-y divide-border">
                {TYPEFACES.map((t) => (
                  <div key={t.name} className="grid grid-cols-[auto_1fr] items-center gap-6 py-6 sm:gap-10">
                    <div
                      className="w-20 text-center text-5xl text-text-primary sm:w-28 sm:text-7xl"
                      style={{ fontFamily: t.family }}
                    >
                      {t.glyph}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-text-primary">{t.name}</span>
                        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-text-secondary">{t.role}</span>
                      </div>
                      <p className="mt-2 text-xl leading-snug text-text-primary sm:text-2xl" style={{ fontFamily: t.family }}>
                        {t.pangram}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Plate>

            {/* ---- Plate III · Paper stock ---- */}
            <Plate numeral="III" label="Paper stock" caption="Three surfaces, ink only. Graph for structure, crosshatch for Tufte-style richness without colour, laid grain for warmth.">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {[
                  { cls: "bg-grid", name: "Stock A · Graph", spec: "32gsm · 32px rule" },
                  { cls: "bg-crosshatch", name: "Stock B · Crosshatch", spec: "engraved · 6px" },
                  { cls: "paper-grain bg-bg-surface", name: "Stock C · Laid grain", spec: "fibre · fractal noise" },
                ].map((s) => (
                  <figure key={s.name} className="relative">
                    <div className={`${s.cls} relative h-40 overflow-hidden rounded-[3px] border border-border`}>
                      <span className="photo-corner tl" />
                      <span className="photo-corner tr" />
                      <span className="photo-corner bl" />
                      <span className="photo-corner br" />
                    </div>
                    <figcaption className="mt-2.5 flex justify-between font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.1em] text-text-secondary">
                      <span className="text-text-primary/80">{s.name}</span><span>{s.spec}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Plate>

            {/* ---- Plate IV · The album ---- */}
            <Plate numeral="IV" label="The album" caption="Projects as postage stamps: perforated edge, paper margin, a printed keyline frame, the illustration in full colour, the chrome in ink. Hover lifts the stamp off the page.">
              <div className="bg-grid-fine rounded-[4px] border border-border bg-bg-surface/40 p-5 shadow-[inset_0_2px_18px_-8px_rgba(0,0,0,0.35)] sm:p-8">
                <StampGrid className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
                  {ALBUM.map((a, i) => (
                    <div key={a.slug} data-stamp className="relative">
                      {/* mounting corners pin the stamp to the album */}
                      <Stamp
                        imageSrc={a.imageSrc}
                        imageAlt={a.alt}
                        catalogNo={a.no}
                        category={a.category}
                        title={a.title}
                        href={`/projects/${a.slug}`}
                        featured={i === 0}
                        perfBg="var(--color-bg-surface)"
                      />

                      {/* loupe detail callout over the first specimen */}
                      {i === 0 && (
                        <div className="pointer-events-none absolute -right-6 -top-8 hidden lg:block">
                          <div
                            className="loupe h-28 w-28"
                            style={{
                              backgroundImage: `url(${a.imageSrc})`,
                              backgroundSize: "300%",
                              backgroundPosition: "38% 62%",
                            }}
                          >
                            <div className="flex h-full w-full items-end justify-center pb-3">
                              <span className="rounded-full bg-black/45 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[8px] font-semibold uppercase tracking-[0.12em] text-white/95">
                                detail · 3×
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </StampGrid>
              </div>
            </Plate>

            {/* ---- Plate IV·B · Real-data test ---- */}
            <Plate
              numeral="IV·B"
              label="The album · real project images"
              caption="The honest test: every real project hero (screenshots, decks, covers) inside the stamp frame — not watercolours. If the metaphor holds here, the live grid is safe. If it reads as clutter, the frame needs a tweak."
            >
              <div className="bg-grid-fine rounded-[4px] border border-border bg-bg-surface/40 p-5 shadow-[inset_0_2px_18px_-8px_rgba(0,0,0,0.35)] sm:p-8">
                <StampGrid className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                  {projects.map((p, i) => (
                    <div key={p.slug} data-stamp className="relative">
                      <Stamp
                        imageSrc={p.imagePath}
                        imageAlt={p.title}
                        catalogNo={`No. ${String(i + 1).padStart(2, "0")}`}
                        category={p.tools[0]}
                        title={p.title}
                        href={`/projects/${p.slug}`}
                        featured={p.featured}
                        perfBg="var(--color-bg-surface)"
                      />
                    </div>
                  ))}
                </StampGrid>
              </div>
            </Plate>

            {/* ---- Plate IV·C · Interaction states ---- */}
            <Plate
              numeral="IV·C"
              label="Interaction states"
              caption="Loading shimmers on the mat (no blank flash). A missing or broken image falls back to a specimen-pending mat instead of an empty frame. Stamps lift on hover. The album assembles on scroll."
            >
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <figure>
                  <div className="bg-grid-fine rounded-[4px] border border-border bg-bg-surface/40 p-3">
                    <Stamp
                      title="Untitled"
                      catalogNo="No. —"
                      category="No image"
                      perfBg="var(--color-bg-surface)"
                    />
                  </div>
                  <figcaption className="mt-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-text-secondary">
                    Empty / error → fallback
                  </figcaption>
                </figure>
                <figure>
                  <div className="bg-grid-fine rounded-[4px] border border-border bg-bg-surface/40 p-3">
                    <Stamp
                      imageSrc="/images/projects/__does-not-exist__.png"
                      title="Broken"
                      catalogNo="No. 404"
                      category="Bad src"
                      perfBg="var(--color-bg-surface)"
                    />
                  </div>
                  <figcaption className="mt-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] text-text-secondary">
                    404 image → graceful
                  </figcaption>
                </figure>
              </div>
            </Plate>

            {/* ---- Plate V · The postcard, two sides ---- */}
            <Plate numeral="V" label="The postcard · two sides" caption="The keepable gift: a watercolour front you take, and the divided back where the franking, postmark and message live.">
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                {/* front */}
                <div>
                  <p className="mb-2.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-text-secondary">Recto · the gift</p>
                  <Postcard
                    artSrc="/images/artworks/art-11.jpg"
                    artAlt="Mother and child in a field of flowers"
                    stampSrc="/images/artworks/art-12.jpg"
                    quote="make the thing you can't stop thinking about."
                    cta={
                      <button
                        type="button"
                        className="rounded-lg bg-accent px-5 py-2.5 font-[family-name:var(--font-heading)] text-[13px] font-semibold text-white transition-[filter] hover:brightness-110"
                      >
                        Take one ↓
                      </button>
                    }
                  />
                </div>

                {/* divided back */}
                <div>
                  <p className="mb-2.5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.18em] text-text-secondary">Verso · the back</p>
                  <div className="relative grid h-[calc(100%-1.6rem)] min-h-[230px] grid-cols-[1.3fr_1fr] overflow-hidden rounded-[4px] border border-border bg-bg-surface shadow-[0_10px_30px_-16px_rgba(0,0,0,0.4)]">
                    {/* message side */}
                    <div className="flex flex-col justify-between border-r border-dashed border-border p-5">
                      <p className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.24em] text-text-secondary">Post Card</p>
                      <p className="font-[family-name:var(--font-hand)] text-2xl leading-[1.15] text-text-primary">
                        Dear visitor, thanks for reading all the way down here. Keep this one.
                      </p>
                      <p className="font-[family-name:var(--font-hand)] text-xl text-text-secondary">yours, b.</p>
                    </div>
                    {/* address side */}
                    <div className="flex flex-col p-5">
                      {/* stamp box + postmark */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-10 items-center justify-center rounded-[1px] border border-dashed border-text-secondary/50 text-center font-[family-name:var(--font-mono)] text-[7px] uppercase leading-tight tracking-wide text-text-secondary/70">
                          Affix
                          <br />
                          stamp
                        </div>
                        <div className="postmark grid h-12 w-12 -rotate-6 place-items-center text-center font-[family-name:var(--font-mono)] text-[6.5px] font-semibold uppercase leading-[1.25] tracking-wide">
                          Benga<br />luru<br />·IST·
                        </div>
                      </div>
                      {/* address ruling */}
                      <div className="mt-auto space-y-3">
                        <span className="block h-px bg-border" />
                        <span className="block h-px bg-border" />
                        <span className="block h-px w-2/3 bg-border" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Plate>

            {/* ---- Plate VI · Marks & interaction ---- */}
            <Plate numeral="VI" label="Marks &amp; interaction" caption="Catalogue labels and the places the blue accent is allowed to appear.">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div className="space-y-5">
                  <CatalogLabel number="01">Selected Work</CatalogLabel>
                  <CatalogLabel number="04">Take one</CatalogLabel>
                  <CatalogLabel rule={false}>Album · B-sides · Dispatches</CatalogLabel>
                </div>

                <div className="flex flex-wrap content-start items-center gap-4">
                  <button type="button" className="rounded-lg bg-accent px-5 py-2.5 font-[family-name:var(--font-heading)] text-[13px] font-semibold text-white transition-[filter] hover:brightness-110">
                    Primary
                  </button>
                  <button type="button" className="rounded-lg border border-border px-5 py-2.5 font-[family-name:var(--font-heading)] text-[13px] font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent">
                    Secondary
                  </button>
                  <a href="#" className="font-[family-name:var(--font-heading)] text-[13px] font-semibold text-accent underline decoration-1 underline-offset-2">
                    text link →
                  </a>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-accent">
                    view the dispatch →
                  </span>
                </div>
              </div>
            </Plate>
          </div>

          {/* ---- Colophon ---- */}
          <footer className="relative z-10 mt-6 flex flex-col items-center gap-3 border-t border-border pt-10 text-center">
            <RegMark />
            <p className="max-w-xl font-[family-name:var(--font-playfair)] text-sm italic text-text-secondary">
              Set in Playfair Display, Space Grotesk, Inter, IBM Plex Mono &amp; Caveat. Printed on
              warm cream, ink and one blue. Compiled in Bengaluru.
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-text-secondary">
              Studio Archive · MMXXVI · Internal Plate
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
