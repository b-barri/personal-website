import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CatalogLabel from "@/components/ui/CatalogLabel";

// The About section is a single illustrated "postcard" artifact, rendered as an
// image by deliberate choice (the hand-drawn engraving/ink quality reads more
// original than HTML can). To offset the usual cost of text-in-an-image, the
// section keeps a real <h2> heading and a structured sr-only summary so the
// content stays indexable and screen-reader accessible.
//
// Below md the artwork's fine print is illegible (~340px wide), so the same
// postcard is re-set as a vertical paper strip with live text. The strip uses
// the artwork's own fixed paper/ink palette — it's a physical artifact, so it
// deliberately does not re-theme in dark mode.

const PAPER = "#ecdfbe";
const INK = "#3a2f25";
const INK_SOFT = "#6b5a40";
const NAVY = "#23436a";
const C = {
  green: "#5f6b35",
  red: "#a23d2c",
  blue: "#2d5577",
  purple: "#6a4670",
};

const mono = "font-[family-name:var(--font-mono)]";
const hand = "font-[family-name:var(--font-hand)]";
const display = "font-[family-name:var(--font-playfair)]";

// Copy follows the illustration, with one deliberate divergence: stamps are
// grouped under the company that issued them (the artwork leaves this
// ambiguous — Search/Engagement/AI Systems were all Groww, Commerce is CRED).
const CAREER_CHAPTERS = [
  {
    label: "Posted from Groww",
    dates: "2022 – 2025",
    stamps: [
      {
        office: "Search Immigration",
        pre: null,
        name: "Search",
        detail: "Entry purpose: understanding intent",
        dates: "2022 – 2023",
        note: "That small box people use when they don't know the right word yet.",
        color: C.green,
        rotate: -1.2,
      },
      {
        office: "Engagement Visa",
        pre: "Valid for:",
        name: "Making finance feel human",
        detail: null,
        dates: "2023",
        note: "Could stories make a financial app feel alive instead of transactional?",
        color: C.red,
        rotate: 1,
      },
      {
        office: "Information Routing Authority",
        pre: null,
        name: "AI Systems",
        detail: "Cleared for delivery",
        dates: "★ 2024 – 2025 ★",
        note: "Getting the right information to the right person before they know to ask for it.",
        color: C.blue,
        rotate: -0.8,
      },
    ],
  },
  {
    label: "Now posted at CRED",
    dates: "2025 – present",
    stamps: [
      {
        office: "Commerce Department",
        pre: null,
        name: "Discovery × Purchase",
        detail: "Merged · Rewards platform",
        dates: "2025 – present",
        note: "Making discovery and purchase feel like one motion, not two.",
        color: C.purple,
        rotate: 1.2,
      },
    ],
  },
];

const VISITS = [
  { name: "Republic of Curiosity", status: "Entry granted", color: C.green },
  { name: "Department of Second-Order Thinking", status: "Clearance approved", color: C.purple },
  { name: "Ministry of Broken Things", status: "Frequent visitor", color: C.blue },
  { name: "Archive of Interesting Ideas", status: "Lifetime access", color: INK },
];

const OFF_THE_CLOCK = [
  { title: "Home barista", sub: "In progress", color: C.green },
  { title: "Kindle", sub: "Reader", color: C.red },
  { title: "Substack", sub: "Writer", color: C.blue },
  { title: "iPad", sub: "Sketcher", color: C.purple },
];

export default function About() {
  return (
    <section id="about" className="bg-bg-surface py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <CatalogLabel number="02" className="mb-6">
            Return Address
          </CatalogLabel>
          <h2 className="mb-10 font-[family-name:var(--font-playfair)] text-4xl font-normal leading-[1.05] tracking-tight text-text-primary md:mb-14 md:text-6xl">
            The work is the point.
          </h2>

          <figure className="relative mx-auto overflow-hidden rounded-[4px] shadow-[0_34px_80px_-34px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/about/postcard.png"
              alt="An aged airmail postcard titled “Post Card — About me”, laid out as a sheet of passport stamps summarizing Bhavya Barri's career and interests."
              width={1536}
              height={1024}
              sizes="(max-width: 1152px) 100vw, 1104px"
              className="h-auto w-full"
            />

            {/* Portrait affixed as a postage stamp over the postcard's printed
                "place stamp here" box (top-right). Positioned as a percentage of
                the image so it tracks the postcard at every width. */}
            <div
              className="absolute rotate-[-5deg]"
              style={{ left: "88.6%", top: "3.5%", width: "8.7%" }}
            >
              <div className="stamp-paper relative aspect-square shadow-[0_3px_9px_-3px_rgba(40,32,22,0.55)]">
                <div className="absolute inset-[12%] overflow-hidden">
                  <Image
                    src="/images/about.jpg"
                    alt="Bhavya Barri"
                    fill
                    sizes="120px"
                    className="object-cover"
                    style={{ transform: "scale(1.85)", transformOrigin: "54% 30%" }}
                  />
                </div>
              </div>
            </div>
          </figure>

          {/* Mobile re-set of the postcard. aria-hidden because the sr-only
              summary below already carries this content for assistive tech. */}
          <div aria-hidden="true" className="mt-6 md:hidden">
            <div
              className="rounded-[4px] px-5 py-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
              style={{ backgroundColor: PAPER, color: INK }}
            >
              {/* masthead */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`${mono} rounded-[2px] border px-2 py-1 text-center text-[7px] font-semibold uppercase leading-tight tracking-[0.14em]`}
                  style={{ borderColor: NAVY, color: NAVY, transform: "rotate(-2deg)" }}
                >
                  ✈ By air mail
                  <br />
                  Par avion
                </span>
                {/* cancellation waves */}
                <svg viewBox="0 0 90 20" className="h-4 w-20 shrink-0" aria-hidden="true">
                  {[3, 8, 13, 18].map((y) => (
                    <path
                      key={y}
                      d={`M0 ${y} q 11 -4 22 0 t 22 0 t 22 0 t 22 0`}
                      fill="none"
                      stroke={INK_SOFT}
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  ))}
                </svg>
              </div>
              <p className={`${display} mt-4 text-center text-2xl font-semibold uppercase tracking-[0.18em]`}>
                Post Card
              </p>
              <p className={`${mono} mt-1 text-center text-[10px] uppercase tracking-[0.4em]`} style={{ color: INK_SOFT }}>
                · · About me · ·
              </p>

              {/* notice of entry */}
              <div
                className="mx-auto mt-7 grid aspect-square w-44 place-items-center rounded-full border-2 text-center"
                style={{ borderColor: INK, transform: "rotate(-4deg)", boxShadow: `inset 0 0 0 3px ${PAPER}, inset 0 0 0 4px ${INK}55` }}
              >
                <div className="px-4">
                  <p className={`${mono} text-[8px] uppercase tracking-[0.2em]`} style={{ color: INK_SOFT }}>
                    ★ Notice of entry ★
                  </p>
                  <p className={`${display} mt-1.5 text-xl font-bold uppercase leading-none`}>Bhavya Barri</p>
                  <p className={`${mono} mt-2 text-[8px] uppercase leading-[1.5] tracking-[0.12em]`} style={{ color: INK_SOFT }}>
                    Biotech engineer
                    <br />
                    turned
                    <br />
                    product builder
                  </p>
                  <p className={`${mono} mt-2 text-[9px] font-semibold uppercase tracking-[0.22em]`} style={{ color: C.red }}>
                    Admitted
                  </p>
                </div>
              </div>
              <p className={`${hand} mx-auto mt-4 max-w-[16rem] text-center text-lg leading-snug`}>
                Product builder because I couldn&apos;t stop noticing what was{" "}
                <span style={{ color: C.red }}>broken</span>.
              </p>

              {/* career stamps, chaptered by employer */}
              <div className="mt-8 space-y-6">
                {CAREER_CHAPTERS.map((chapter) => (
                  <div key={chapter.label} className="space-y-6">
                    {/* chapter postmark — which country of employment issued these */}
                    <div className="flex items-center gap-2" style={{ color: INK_SOFT }}>
                      <span className="h-px flex-1" style={{ backgroundColor: `${INK_SOFT}66` }} />
                      <p className={`${mono} shrink-0 text-[9px] font-semibold uppercase tracking-[0.18em]`}>
                        ✦ {chapter.label} · {chapter.dates} ✦
                      </p>
                      <span className="h-px flex-1" style={{ backgroundColor: `${INK_SOFT}66` }} />
                    </div>

                    {chapter.stamps.map((s) => (
                      <div key={s.office}>
                        <div
                          className="rounded-[3px] border-2 border-dashed px-4 py-4 text-center"
                          style={{
                            borderColor: s.color,
                            color: s.color,
                            transform: `rotate(${s.rotate}deg)`,
                            boxShadow: `inset 0 0 0 3px ${PAPER}, inset 0 0 0 4px ${s.color}55`,
                          }}
                        >
                          <p className={`${mono} text-[10px] font-semibold uppercase tracking-[0.1em]`}>{s.office}</p>
                          {s.pre && (
                            <p className={`${mono} mt-1.5 text-[9px] uppercase tracking-[0.14em] opacity-80`}>{s.pre}</p>
                          )}
                          <p className={`${display} mt-1 text-xl font-bold uppercase leading-tight`}>{s.name}</p>
                          {s.detail && (
                            <p className={`${mono} mt-1 text-[9px] uppercase tracking-[0.1em] opacity-85`}>{s.detail}</p>
                          )}
                          <p className={`${mono} mt-1.5 text-[11px] tracking-wide`}>{s.dates}</p>
                        </div>
                        <p className={`${hand} mt-2 px-1 text-center text-[17px] leading-tight`} style={{ color: INK_SOFT }}>
                          <span aria-hidden="true">↖ </span>
                          {s.note}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* the question */}
              <div
                className="mt-8 rounded-[3px] border-2 px-4 py-5 text-center"
                style={{
                  borderColor: C.red,
                  color: C.red,
                  transform: "rotate(-1deg)",
                  boxShadow: `inset 0 0 0 3px ${PAPER}, inset 0 0 0 4px ${C.red}55`,
                }}
              >
                <p className={`${mono} text-[9px] font-semibold uppercase tracking-[0.16em]`}>
                  ★ Question under investigation
                </p>
                <p className={`${display} mt-2 text-[28px] font-bold uppercase leading-[0.95]`}>
                  What actually endures?
                </p>
                <p
                  className={`${mono} mt-3 border-t pt-2 text-[9px] font-semibold uppercase tracking-[0.1em]`}
                  style={{ borderColor: `${C.red}66` }}
                >
                  ★ Software expires. Trust accumulates.
                </p>
              </div>
              <p className={`${hand} mt-4 px-1 text-center text-[17px] leading-snug`}>
                Software ages fast. An interface that looks great today looks dated in ten years.{" "}
                <span style={{ color: C.red }}>
                  But the community around a product, the problem it stands for, the trust it builds, those outlast the UI.
                </span>
              </p>

              {/* off the clock */}
              <p className={`${mono} mt-9 text-center text-[10px] uppercase tracking-[0.24em]`} style={{ color: INK_SOFT }}>
                — Off the clock —
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                {OFF_THE_CLOCK.map((o) => (
                  <div key={o.title} className="rounded-[3px] border px-2 py-3" style={{ borderColor: `${o.color}88`, color: o.color }}>
                    <p className={`${mono} text-[10px] font-semibold uppercase tracking-[0.12em]`}>{o.title}</p>
                    <p className={`${mono} mt-0.5 text-[8px] uppercase tracking-[0.14em] opacity-80`}>{o.sub}</p>
                  </div>
                ))}
              </div>
              <p className={`${hand} mt-3 text-center text-[16px]`} style={{ color: INK_SOFT }}>
                When I need to make something with my hands.
              </p>

              {/* frequent visitor */}
              <p className={`${mono} mt-9 text-center text-[10px] uppercase tracking-[0.24em]`} style={{ color: INK_SOFT }}>
                — Frequent visitor to —
              </p>
              <div className="mt-4 space-y-2.5">
                {VISITS.map((v) => (
                  <div
                    key={v.name}
                    className="rounded-[3px] border px-3 py-2"
                    style={{ borderColor: `${v.color}99`, color: v.color }}
                  >
                    <p className={`${display} text-[13px] font-bold uppercase leading-tight`}>{v.name}</p>
                    <p className={`${mono} mt-0.5 text-[8px] uppercase tracking-[0.12em] opacity-85`}>{v.status}</p>
                  </div>
                ))}
              </div>

              {/* from */}
              <div className="mt-9 border-t pt-5" style={{ borderColor: `${INK_SOFT}55` }}>
                <p className={`${mono} text-[9px] uppercase tracking-[0.2em]`} style={{ color: INK_SOFT }}>
                  From:
                </p>
                <p className={`${hand} mt-1 text-3xl leading-none`}>Bhavya Barri</p>
                <p className={`${mono} mt-2 text-[9px] uppercase leading-[1.7] tracking-[0.12em]`} style={{ color: INK_SOFT }}>
                  Product builder
                  <br />
                  Reader. Writer. Maker.
                  <br />
                  Collector of interesting ideas.
                </p>
              </div>
            </div>
          </div>

          {/* Same content as machine-readable text — keeps the section indexable
              and accessible even though the artifact itself is an image. */}
          <div className="sr-only">
            <p>
              About Bhavya Barri — biotech engineer turned product builder. A
              product builder because I couldn&apos;t stop noticing what was broken.
            </p>
            <p>
              Product work at Groww, 2022 to 2025: search and understanding
              user intent; engagement and making finance feel human; and
              AI-driven information routing, getting the right information to
              the right person before they ask. Now at CRED, 2025 to present:
              commerce, merging discovery and purchase into one motion, and
              the rewards platform.
            </p>
            <p>
              Driven by one question: what actually endures? Software expires,
              trust accumulates. An interface that looks great today looks dated
              in ten years, but the community around a product, the problem it
              stands for, and the trust it builds outlast the UI.
            </p>
            <p>
              Off the clock: home barista, heavy reader, Substack writer, and
              sketcher — a reader, writer, maker, and collector of interesting
              ideas.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
