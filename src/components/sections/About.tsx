import Image from "next/image";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CatalogLabel from "@/components/ui/CatalogLabel";

// The About section is a philatelic postcard: a career told in passport stamps,
// rebuilt as a close HTML replica of the generated "POST CARD / ABOUT ME" art.
// It stays paper-toned in both themes (a real postcard doesn't go dark). Texture
// is a real scanned-paper photo (public/images/about/paper-bg.png) stretched to
// hug all four card edges; everything on top is live, selectable, themeable HTML.

const PAPER = "#dcc69c";
const INK = "#3a2f25";
const INK_SOFT = "#6b5a40";
const NAVY = "#23436a";
const C = {
  green: "#5f6b35",
  red: "#a23d2c",
  blue: "#2d5577",
  purple: "#6a4670",
  brown: "#7c5226",
};

const mono = "font-[family-name:var(--font-mono)]";
const hand = "font-[family-name:var(--font-hand)]";
const display = "font-[family-name:var(--font-playfair)]";

// ── rubber-stamp frame ──────────────────────────────────────────────────────
// Two nested borders; the displacement filter (defined once, below) breaks the
// ink so edges wobble like a real stamp while the text inside stays crisp.
function RoughFrame({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2px] border-2"
        style={{ borderColor: color, opacity, filter: "url(#stampRough)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-[1px] border"
        style={{ borderColor: color, opacity: opacity * 0.5, filter: "url(#stampRough)" }}
      />
    </>
  );
}

function Stamp({
  color,
  rotate = 0,
  className = "",
  children,
}: {
  color: string;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mix-blend-multiply" style={{ color, transform: rotate ? `rotate(${rotate}deg)` : undefined }}>
      <RoughFrame color={color} opacity={0.92} />
      <div className={`relative ${className}`}>{children}</div>
    </div>
  );
}

// ── engraved icons ──────────────────────────────────────────────────────────
// Monoline SVGs, stroke = currentColor (so each inherits its stamp's ink), all
// pushed through the same displacement filter so they read as part of the stamp
// impression. Each entry carries its own viewBox so composite rows can be wide.
type Eng = { vb: string; node: ReactNode };
const ENG: Record<string, Eng> = {
  searchbox: {
    vb: "0 0 48 20",
    node: (
      <>
        <rect x="1" y="2" width="46" height="16" rx="2.5" />
        <circle cx="9" cy="10" r="3" />
        <path d="m11.2 12.2 2.4 2.4" />
        <path d="M18 8h22M18 12h15" />
      </>
    ),
  },
  filmstrip: {
    vb: "0 0 62 22",
    node: (
      <>
        <rect x="1" y="2" width="60" height="18" rx="1" />
        <path d="M1 6h60M1 16h60" />
        <path d="M22 6v10M42 6v10" />
        <path d="M9 8.5 13 11l-4 2.5Z" />
        <circle cx="29" cy="9.5" r="1.6" />
        <circle cx="35" cy="9.5" r="1.6" />
        <path d="M26 15c0-1.6 1.4-2.6 3-2.6s3 1 3 2.6M32 15c0-1.6 1.4-2.6 3-2.6s3 1 3 2.6" />
        <path d="M46 15l3.5-3 2.5 2 2-1.5 3 2.5" />
        <circle cx="49" cy="9" r="1.1" />
      </>
    ),
  },
  routing: {
    vb: "0 0 62 24",
    node: (
      <>
        <rect x="2" y="5" width="11" height="14" rx="1" />
        <path d="M5 9h5M5 12h5M5 15h3.5" />
        <path d="M15 12h4.5M18 9.5 20.5 12 18 14.5" />
        <rect x="23" y="9" width="13" height="9" rx="2" />
        <path d="M29.5 5v4" />
        <circle cx="29.5" cy="4" r="1" />
        <circle cx="27" cy="13.5" r="1" />
        <circle cx="32" cy="13.5" r="1" />
        <path d="M26 18v2M33 18v2" />
        <path d="M38 12h4.5M41 9.5 43.5 12 41 14.5" />
        <rect x="46" y="7" width="14" height="11" rx="1" />
        <path d="m46 8 7 5 7-5" />
      </>
    ),
  },
  commerce: {
    vb: "0 0 46 24",
    node: (
      <>
        <path d="M4 9h11l-1 11H5L4 9Z" />
        <path d="M7 9a3 3 0 0 1 6 0" />
        <path d="M18 12h5M21.5 9.5 24 12 21.5 14.5" />
        <rect x="27" y="11" width="15" height="9" rx="1" />
        <path d="M27 14.5h15M34.5 11v9" />
        <path d="M34.5 11c-1.6-3-5-1.4-3 0M34.5 11c1.6-3 5-1.4 3 0" />
      </>
    ),
  },
  hourglass: {
    vb: "0 0 24 24",
    node: (
      <>
        <path d="M7 4h10M7 20h10" />
        <path d="M7 4c0 4 5 5 5 8s-5 4-5 8M17 4c0 4-5 5-5 8s5 4 5 8" />
      </>
    ),
  },
  birkin: {
    vb: "0 0 30 28",
    node: (
      <>
        <path d="M4 12l2.5-2.5h17L26 12" />
        <path d="M4 12h22l-2 14H6L4 12Z" />
        <path d="M10 10.5V9a4.5 4.5 0 0 1 10 0v1.5" />
        <rect x="13" y="14" width="4" height="5" rx="0.6" />
      </>
    ),
  },
  building: {
    vb: "0 0 28 28",
    node: (
      <>
        <path d="M2 26h24" />
        <path d="M4 26V13M9 26V13M14 26V13M19 26V13M24 26V13" />
        <path d="M2 13h24" />
        <path d="M3 13 14 4l11 9" />
      </>
    ),
  },
  capitol: {
    vb: "0 0 32 28",
    node: (
      <>
        <path d="M3 26h26" />
        <path d="M6 26V15M11 26V15M16 26V15M21 26V15M26 26V15" />
        <path d="M5 15h22" />
        <path d="M8 15v-1.5h16V15" />
        <path d="M11 13.5c0-4 2.5-6.5 5-6.5s5 2.5 5 6.5" />
        <path d="M16 7V3.5" />
      </>
    ),
  },
  teapot: {
    vb: "0 0 44 26",
    node: (
      <>
        <path d="M4 12c0-1.5 1.2-2.5 2.6-2.5h9C17 9.5 18 10.5 18 12c0 4.4-3.4 7.5-7 7.5S4 16.4 4 12Z" />
        <path d="M18 12c2.4 0 4 1.2 5.2 3" />
        <path d="M4 12C1.8 12 1.8 8.5 4 8.5" />
        <path d="M9 9.5V8M7.6 8h3" />
        <path d="M26 14h12l-1.5 7h-9L26 14Z" />
        <path d="M38 15c2 0 3 1 3 2.5s-1 2.5-3 2.5" />
        <path d="M28 14l1-3h8l1 3" />
      </>
    ),
  },
  ereader: {
    vb: "0 0 24 28",
    node: (
      <>
        <rect x="4" y="2" width="16" height="24" rx="2" />
        <rect x="6.5" y="5" width="11" height="14" rx="0.5" />
        <path d="M8 8h8M8 11h8M8 14h5" />
        <circle cx="12" cy="22.5" r="1" />
      </>
    ),
  },
  envelope: {
    vb: "0 0 30 24",
    node: (
      <>
        <rect x="3" y="5" width="24" height="16" rx="1.5" />
        <path d="m3 7 12 8 12-8" />
      </>
    ),
  },
  landscape: {
    vb: "0 0 36 26",
    node: (
      <>
        <rect x="2" y="3" width="24" height="18" rx="1" />
        <circle cx="9" cy="9" r="1.6" />
        <path d="M4 18l6-6 4 3 5-5 5 6" />
        <path d="M24 24l8-8 2 2-8 8-3 1 1-3Z" />
      </>
    ),
  },
  airplane: {
    vb: "0 0 24 24",
    node: (
      <>
        <path d="M22 3 2 10l7 3 3 7 4-7 6-10Z" />
        <path d="m9 13 7-7" />
      </>
    ),
  },
  bulb: {
    vb: "0 0 24 24",
    node: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z" />
      </>
    ),
  },
  wrench: {
    vb: "0 0 24 24",
    node: (
      <path d="M15 3a5 5 0 0 0-2.3 9.4l-8 8L7 23l8-8A5 5 0 0 0 21 9l-3 3-2-2 3-3a5 5 0 0 0-2-1Z" />
    ),
  },
  book: {
    vb: "0 0 24 24",
    node: (
      <>
        <path d="M12 6c-2-1.4-5-1.4-7-1v12c2-.4 5-.4 7 1 2-1.4 5-1.4 7-1V5c-2-.4-5-.4-7 1Z" />
        <path d="M12 6v12" />
      </>
    ),
  },
};

function Eng({
  name,
  className = "h-6 w-6",
  sw = 1.4,
  filterId = "stampRough",
}: {
  name: string;
  className?: string;
  sw?: number;
  filterId?: string;
}) {
  const e = ENG[name];
  if (!e) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox={e.vb}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: `url(#${filterId})`, opacity: 0.88 }}
    >
      {e.node}
    </svg>
  );
}

// Postmark wavy cancellation lines, trailing off the air-mail box.
function Waves({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 20"
      preserveAspectRatio="none"
      fill="none"
      stroke={INK}
      strokeWidth={1.3}
      className={className}
      style={{ filter: "url(#stampRough)", opacity: 0.4 }}
    >
      {[2, 7, 12, 17].map((y) => (
        <path key={y} d={`M0 ${y} q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0`} />
      ))}
    </svg>
  );
}

// Faint round postmark cancellation, scattered over the collage as aged texture.
function Cancel({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute ${className}`} style={{ transform: `rotate(${rotate}deg)`, opacity: 0.14 }}>
      <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" stroke={INK} strokeWidth={1.1} style={{ filter: "url(#stampRough)" }}>
        <circle cx="32" cy="32" r="30" />
        <circle cx="32" cy="32" r="21" />
        <path d="M32 11v6M32 47v6M11 32h6M47 32h6" />
        <path d="M22 32h20M24 28h16M24 36h16" />
      </svg>
    </span>
  );
}

const OFFCLOCK = [
  { title: "Home Barista License", sub: "Provisional holder", eng: "teapot", engClass: "h-9 w-16", foot: "Daily brews in progress", color: C.brown, rotate: -1.2, waves: false },
  { title: "Kindle Import Authorized", sub: "Customs cleared", eng: "ereader", engClass: "h-11 w-11", foot: "Heavy reader", color: C.blue, rotate: 0.9, waves: true },
  { title: "Substack Correspondent", sub: "Filing regularly", eng: "envelope", engClass: "h-9 w-14", foot: "★ Active ★", color: C.red, rotate: -0.7, waves: true },
  { title: "Field Sketcher", sub: "Observations recorded", eng: "landscape", engClass: "h-10 w-16", foot: "Ideas made by hand", color: C.green, rotate: 1.4, waves: false },
];

const VISITS = [
  { name: "Republic of Curiosity", status: "Entry granted", color: C.green, eng: "airplane" },
  { name: "Department of Second-Order Thinking", status: "Clearance approved", color: C.purple, eng: "bulb" },
  { name: "Ministry of Broken Things", status: "Frequent visitor", color: C.blue, eng: "wrench" },
  { name: "Archive of Interesting Ideas", status: "Lifetime access", color: INK, eng: "book" },
];

export default function About() {
  return (
    <section id="about" className="bg-bg-surface py-20 md:py-32">
      {/* Shared letterpress filter: displacement (wobble) → dilate/blur/alpha-threshold
          (ink bleed + bite). Every frame, icon, postmark, and cancel references this,
          so the whole stamp layer gets a printed-into-paper edge for free. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="stampRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feMorphology in="d" operator="dilate" radius="0.15" result="s" />
          <feGaussianBlur in="s" stdDeviation="0.5" result="b" />
          <feComponentTransfer in="b">
            <feFuncA type="discrete" tableValues="0 0 1 1 1" />
          </feComponentTransfer>
        </filter>
        {/* Wobble only, no ink-bleed — for dense composite icons whose thin strokes
            would merge into a blob under the dilate/threshold above. */}
        <filter id="stampWobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <CatalogLabel number="02" className="mb-6">
            Return Address
          </CatalogLabel>
          <h2 className={`${display} mb-10 text-4xl font-normal leading-[1.05] tracking-tight text-text-primary md:mb-14 md:text-6xl`}>
            The work is the point.
          </h2>

          {/* ── the postcard ───────────────────────────────────────── */}
          <article
            aria-label="About Bhavya Barri, told as a postcard of passport stamps"
            className="relative isolate mx-auto overflow-hidden rounded-[4px] shadow-[0_34px_80px_-34px_rgba(0,0,0,0.7)]"
            style={{
              color: INK,
              backgroundColor: PAPER,
              backgroundImage: "url('/images/about/paper-bg.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative p-5 sm:p-8 md:p-10">
              {/* ── header: air-mail · POST CARD · place-stamp ──────── */}
              <header className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
                <div className="flex items-center gap-2 mix-blend-multiply">
                  <span
                    className={`${mono} relative rounded-[2px] px-2.5 py-1.5 text-center text-[8px] font-semibold uppercase leading-tight tracking-[0.14em]`}
                    style={{ color: NAVY }}
                  >
                    <RoughFrame color={NAVY} />
                    <span className="relative">
                      By air mail
                      <br />
                      <span className="tracking-[0.22em]">Par avion</span>
                    </span>
                  </span>
                  <Waves className="hidden h-5 w-24 sm:block" />
                </div>

                <div className="pt-1 text-center mix-blend-multiply">
                  <h3 className={`${display} text-2xl font-semibold uppercase tracking-[0.16em] sm:text-3xl md:text-4xl`} style={{ color: INK }}>
                    Post Card
                  </h3>
                  <p className={`${mono} mt-1 text-[9px] uppercase tracking-[0.4em] sm:text-[10px]`} style={{ color: INK_SOFT }}>
                    · · About me · ·
                  </p>
                </div>

                {/* portrait affixed as the postage stamp */}
                <figure className="justify-self-end">
                  <div
                    className="stamp-edge w-[62px] rounded-[2px] p-1 sm:w-[76px]"
                    style={{ ["--perf-bg" as string]: PAPER, backgroundColor: "#ddcaa0" }}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1px]">
                      <Image src="/images/about.jpg" alt="Bhavya Barri" fill sizes="80px" className="object-cover" />
                    </div>
                  </div>
                  <figcaption className={`${mono} mt-1 text-center text-[7px] uppercase tracking-[0.16em]`} style={{ color: INK_SOFT }}>
                    The sender
                  </figcaption>
                </figure>
              </header>

              {/* ── postmark + career stamps ───────────────────────── */}
              <div className="relative mt-7 grid gap-7 lg:grid-cols-[230px_1fr] lg:items-start lg:gap-7">
                {/* scattered cancellations riding over the stamp row */}
                <Cancel className="left-[40%] top-[24%] hidden h-[70px] w-[70px] lg:block" rotate={-12} />
                <Cancel className="left-[62%] top-[60%] hidden h-[58px] w-[58px] lg:block" rotate={16} />
                <Cancel className="left-[86%] top-[18%] hidden h-[62px] w-[62px] lg:block" rotate={-6} />

                {/* left: round notice-of-entry postmark + thesis line */}
                <div className="flex flex-col items-center lg:items-start">
                  <div
                    className="relative grid aspect-square w-48 shrink-0 place-items-center rounded-full text-center mix-blend-multiply"
                    style={{ color: INK, transform: "rotate(-4deg)" }}
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border-2" style={{ borderColor: INK, filter: "url(#stampRough)" }} />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-[7px] rounded-full border" style={{ borderColor: INK, opacity: 0.45, filter: "url(#stampRough)" }} />
                    <div className="relative px-5">
                      <p className={`${mono} text-[8px] uppercase tracking-[0.2em]`} style={{ color: INK_SOFT }}>
                        ★ Notice of entry ★
                      </p>
                      <p className={`${display} mt-1.5 text-[22px] font-bold uppercase leading-none`}>Bhavya Barri</p>
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

                  <p className={`${display} mt-5 max-w-[15rem] text-center text-lg italic leading-snug mix-blend-multiply lg:text-left`} style={{ color: INK }}>
                    {"Product builder because I couldn't stop noticing what was "}
                    <span style={{ color: C.red }}>broken</span>.
                  </p>
                </div>

                {/* right: the four career stamps, each with a handwritten note */}
                <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                  {/* Search Immigration */}
                  <div>
                    <Stamp color={C.green} rotate={-1.2} className="px-3 py-3 text-center">
                      <p className={`${mono} text-[9px] font-semibold uppercase tracking-[0.1em]`}>Search Immigration</p>
                      <p className={`${display} mt-1 text-2xl font-bold leading-none`}>Groww</p>
                      <p className={`${mono} mt-1 text-[10px] tracking-wide`}>2022 – 2023</p>
                      <Eng name="searchbox" filterId="stampWobble" sw={1.6} className="mx-auto my-2 h-6 w-28" />
                      <p className={`${mono} text-[8px] uppercase leading-snug tracking-[0.08em]`} style={{ opacity: 0.85 }}>
                        Entry purpose:
                        <br />
                        understanding intent
                      </p>
                    </Stamp>
                    <p className={`${hand} mt-2 flex items-start gap-1 px-1 text-[15px] leading-tight`} style={{ color: INK_SOFT }}>
                      <span>{"that small box people use when they don't know the right word yet."}</span>
                      <Eng name="airplane" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    </p>
                  </div>

                  {/* Engagement Visa */}
                  <div>
                    <Stamp color={C.red} rotate={1.1} className="px-3 py-3 text-center">
                      <p className={`${mono} text-[9px] font-semibold uppercase tracking-[0.1em]`}>Engagement Visa</p>
                      <p className={`${mono} mt-1.5 text-[8px] uppercase tracking-[0.14em]`} style={{ opacity: 0.8 }}>Valid for:</p>
                      <p className={`${display} mt-0.5 text-base font-bold uppercase leading-[1.05]`}>
                        Making finance
                        <br />
                        feel human
                      </p>
                      <p className={`${mono} mt-1 text-[10px] tracking-wide`}>2023 – 2024</p>
                      <Eng name="filmstrip" filterId="stampWobble" sw={1.6} className="mx-auto mt-2 h-7 w-32" />
                    </Stamp>
                    <p className={`${hand} mt-2 px-1 text-[15px] leading-tight`} style={{ color: INK_SOFT }}>
                      {"could in-app stories make a financial app feel alive instead of transactional?"}
                    </p>
                  </div>

                  {/* Information Routing Authority */}
                  <div>
                    <Stamp color={C.blue} rotate={-0.8} className="px-3 py-3 text-center">
                      <p className={`${mono} text-[8.5px] font-semibold uppercase tracking-[0.08em]`}>Information Routing Authority</p>
                      <p className={`${display} mt-1 text-xl font-bold uppercase leading-none`}>AI Systems</p>
                      <p className={`${mono} mt-1 text-[8px] uppercase tracking-[0.1em]`} style={{ opacity: 0.85 }}>Cleared for delivery</p>
                      <Eng name="routing" filterId="stampWobble" sw={1.6} className="mx-auto my-2 h-7 w-32" />
                      <p className={`${mono} text-[9px] font-semibold tracking-[0.16em]`}>★ 2024 – 2025 ★</p>
                    </Stamp>
                    <p className={`${hand} mt-2 px-1 text-[15px] leading-tight`} style={{ color: INK_SOFT }}>
                      {"the right information to the right person before they know to ask for it."}
                    </p>
                  </div>

                  {/* Commerce Department */}
                  <div>
                    <Stamp color={C.purple} rotate={1.5} className="px-3 py-3 text-center">
                      <p className={`${mono} text-[9px] font-semibold uppercase tracking-[0.1em]`}>Commerce Department</p>
                      <Eng name="commerce" filterId="stampWobble" sw={1.6} className="mx-auto my-2 h-7 w-28" />
                      <p className={`${display} text-base font-bold uppercase leading-none`}>Discovery × Purchase</p>
                      <p className={`${mono} mt-1 text-[9px] uppercase tracking-[0.16em]`} style={{ opacity: 0.85 }}>Merged</p>
                      <p className={`${mono} mt-1.5 text-[10px] tracking-wide`}>2025 – present</p>
                    </Stamp>
                    <p className={`${hand} mt-2 px-1 text-[15px] leading-tight`} style={{ color: INK_SOFT }}>
                      {"making discovery and purchase feel like one motion, not two."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── philosophy · question · answer · visitor ───────── */}
              <div className="mt-12 grid grid-cols-1 items-start gap-7 lg:grid-cols-2 xl:grid-cols-[1fr_1.25fr_1fr_0.95fr] xl:gap-6">
                {/* philosophy list with engraved sketches */}
                <ul className={`${hand} space-y-3 text-[16px] leading-tight mix-blend-multiply`} style={{ color: INK_SOFT }}>
                  <li className="flex items-center gap-3">
                    <Eng name="birkin" className="h-9 w-9 shrink-0" />
                    <span>a Birkin bag is decades old and appreciating.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Eng name="building" className="h-9 w-9 shrink-0" />
                    <span>buildings get more interesting with time.</span>
                  </li>
                  <li className="flex items-center gap-3 pl-12" style={{ color: C.red }}>
                    <span>software almost never does. ✳</span>
                  </li>
                </ul>

                {/* the question stamp */}
                <Stamp color={C.red} rotate={-1.4} className="px-5 py-5 text-center">
                  <p className={`${mono} text-[9px] font-semibold uppercase tracking-[0.16em]`}>★ Question under investigation</p>
                  <p className={`${display} mt-2 text-[30px] font-bold uppercase leading-[0.92] md:text-[34px]`}>
                    What actually
                    <br />
                    endures?
                  </p>
                  <p className={`${mono} mt-3 border-t pt-2 text-[8.5px] font-semibold uppercase tracking-[0.1em]`} style={{ borderColor: "color-mix(in srgb, #a23d2c 40%, transparent)" }}>
                    ★ Software expires. Trust accumulates.
                  </p>
                </Stamp>

                {/* the answer, handwritten */}
                <p className={`${hand} text-[16px] leading-snug mix-blend-multiply`} style={{ color: INK }}>
                  software ages fast. an interface that looks great today looks dated in ten years.{" "}
                  <span style={{ color: C.red }}>
                    but the community around a product, the problem it stands for, the trust it builds, those outlast the UI. ↘
                  </span>
                </p>

                {/* frequent visitor stack */}
                <div>
                  <p className={`${mono} mb-3 text-[11px] uppercase tracking-[0.2em]`} style={{ color: INK_SOFT }}>
                    Frequent visitor to:
                  </p>
                  <div className="space-y-2.5">
                    {VISITS.map((v) => (
                      <div key={v.name} className="relative flex items-center gap-2 px-3 py-2 mix-blend-multiply" style={{ color: v.color }}>
                        <RoughFrame color={v.color} opacity={0.82} />
                        <div className="relative flex-1">
                          <p className={`${display} text-[12px] font-bold uppercase leading-tight`}>{v.name}</p>
                          <p className={`${mono} mt-0.5 text-[8px] uppercase tracking-[0.12em]`} style={{ opacity: 0.85 }}>
                            {v.status}
                          </p>
                        </div>
                        <Eng name={v.eng} className="relative h-5 w-5 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── off the clock ──────────────────────────────────── */}
              <div className="mt-12 grid gap-6 lg:grid-cols-[168px_1fr] lg:items-stretch lg:gap-8">
                {/* IIT Delhi — a tall departure stamp */}
                <Stamp color={C.blue} rotate={-1.1} className="flex flex-col items-center px-3 py-4 text-center">
                  <p className={`${display} text-lg font-bold uppercase leading-tight`}>IIT Delhi</p>
                  <p className={`${mono} mt-0.5 text-[9px] uppercase tracking-[0.14em]`}>Class of 2022</p>
                  <Eng name="capitol" className="mx-auto my-3 h-12 w-14" />
                  <p className={`${mono} mt-auto text-[8px] uppercase tracking-[0.1em]`} style={{ opacity: 0.85 }}>Departure date</p>
                  <p className={`${mono} text-[10px] font-semibold uppercase tracking-[0.16em]`}>May 2022</p>
                </Stamp>

                {/* divider + the four off-clock stamps */}
                <div>
                  <div className="mb-5 flex items-center gap-3 mix-blend-multiply" style={{ color: INK_SOFT }}>
                    <Eng name="airplane" className="h-3.5 w-3.5 shrink-0" />
                    <span className={`${mono} whitespace-nowrap text-[11px] uppercase tracking-[0.28em]`}>Off the clock</span>
                    <span className="h-px flex-1" style={{ backgroundColor: "#b89a68" }} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {OFFCLOCK.map((o) => (
                      <Stamp key={o.title} color={o.color} rotate={o.rotate} className="flex flex-col items-center px-3 py-3 text-center">
                        <p className={`${mono} text-[9.5px] font-semibold uppercase leading-tight tracking-[0.06em]`}>{o.title}</p>
                        <p className={`${mono} mt-1 text-[8px] uppercase tracking-[0.1em]`} style={{ opacity: 0.78 }}>{o.sub}</p>
                        <div className="my-2 flex items-center justify-center gap-1.5">
                          {o.waves && <Waves className="h-4 w-5" />}
                          <Eng name={o.eng} className={o.engClass} />
                          {o.waves && <Waves className="h-4 w-5" />}
                        </div>
                        <p className={`${mono} mt-auto text-[8.5px] font-semibold uppercase tracking-[0.1em]`}>{o.foot}</p>
                      </Stamp>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── footer ─────────────────────────────────────────── */}
              <div className={`${mono} mt-11 flex flex-col items-center justify-between gap-2 border-t pt-5 text-[11px] uppercase tracking-[0.18em] mix-blend-multiply sm:flex-row`} style={{ color: INK_SOFT, borderColor: "#b89a68" }}>
                <span className="flex items-center gap-2">
                  <Eng name="airplane" className="h-3.5 w-3.5" />
                  Exploring. Building. Learning. Repeating.
                </span>
                <span>
                  Thanks for stopping by. <span style={{ color: C.red }}>♥</span>
                </span>
              </div>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
