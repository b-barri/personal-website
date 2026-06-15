import Image from "next/image";

// Postcard — the keepable artifact of the postal language. A watercolour on the
// left, a written side on the right (handwritten quote, a small inset stamp, a
// monospace dateline). Presentational only; the "take one" download wiring lands
// in Track B. Pass `cta` to slot the real action button when that arrives.

export interface PostcardProps {
  /** The main watercolour illustration (left panel). */
  artSrc: string;
  artAlt?: string;
  /** Small inset stamp on the written side (a second watercolour). */
  stampSrc?: string;
  stampAlt?: string;
  /** The handwritten takeaway line. */
  quote: string;
  /** Left side of the dateline. */
  from?: string;
  /** Right side of the dateline. */
  place?: string;
  /** Action slot — e.g. the "Take one ↓" button once it does real work. */
  cta?: React.ReactNode;
  className?: string;
}

export default function Postcard({
  artSrc,
  artAlt = "",
  stampSrc,
  stampAlt = "",
  quote,
  from = "From bhavya's archive",
  place = "Bengaluru · IST",
  cta,
  className = "",
}: PostcardProps) {
  return (
    <div
      className={`grid grid-cols-1 overflow-hidden rounded-[4px] border border-border bg-bg-surface shadow-[0_10px_30px_-16px_rgba(0,0,0,0.4)] md:grid-cols-[1.05fr_1fr] ${className}`}
    >
      {/* Illustration side */}
      <div className="relative min-h-[200px] after:absolute after:inset-0 after:border-b after:border-dashed after:border-black/15 md:after:border-b-0 md:after:border-r dark:after:border-white/15">
        <Image
          src={artSrc}
          alt={artAlt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
        />
      </div>

      {/* Written side */}
      <div className="flex flex-col p-6">
        {stampSrc && (
          <div className="mb-1.5 w-[46px] self-end rotate-[2.5deg] overflow-hidden rounded-[2px] border border-black/15 bg-bg-primary p-[3px] dark:border-white/15">
            <div className="relative aspect-[5/6]">
              <Image src={stampSrc} alt={stampAlt} fill sizes="46px" className="object-cover" />
            </div>
          </div>
        )}

        <p className="my-1.5 font-[family-name:var(--font-hand)] text-[27px] leading-[1.2] text-text-primary">
          {quote}
        </p>

        {cta && <div className="mt-2 flex flex-wrap items-center gap-3.5">{cta}</div>}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-text-secondary">
          <span>{from}</span>
          <span>{place}</span>
        </div>
      </div>
    </div>
  );
}
