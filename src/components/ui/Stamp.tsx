"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Stamp — a single project rendered as a postage stamp: perforated edge, paper
// margin, a printed keyline frame, the illustration in full colour, monospace
// catalog metadata, and a Playfair title. The album unit of the postal language.
//
// Interaction states:
//  - loading: a shimmer rides the mat until the illustration streams in
//  - loaded:  the illustration fades up
//  - empty/error: a "specimen pending" fallback (crosshatch + Playfair initial)
//  - hover:   the stamp lifts (CSS) and the title goes accent
//
// The illustration stays full colour in every palette; only the chrome is ink.

export interface StampProps {
  /** Illustration (watercolour or project hero). Omit/empty → fallback state. */
  imageSrc?: string;
  imageAlt?: string;
  /** Catalog index line, left side of the meta row, e.g. "No. 04". */
  catalogNo?: string;
  /** Category, right side of the meta row, e.g. "AI Tool". */
  category?: string;
  title: string;
  /** Optional one-line description under the title (e.g. the project tagline). */
  caption?: string;
  featured?: boolean;
  /** When set, the whole stamp is a link with a "view the dispatch" affordance. */
  href?: string;
  /** Surface colour behind the stamp, so the perforations punch through cleanly. */
  perfBg?: string;
  priority?: boolean;
}

export default function Stamp({
  imageSrc,
  imageAlt = "",
  catalogNo,
  category,
  title,
  caption,
  featured = false,
  href,
  perfBg,
  priority = false,
}: StampProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    imageSrc ? "loading" : "error"
  );

  const inner = (
    <>
      {/* printed keyline frame on a paper margin, then the illustration */}
      <div className="rounded-[2px] border border-text-primary/25 bg-bg-primary p-[3px] shadow-[inset_0_0_0_1px_var(--color-bg-primary)]">
        <div className="relative aspect-[4/3] overflow-hidden ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
          {status === "error" ? (
          <div className="bg-crosshatch absolute inset-0 flex flex-col items-center justify-center bg-bg-surface">
            <span className="font-[family-name:var(--font-playfair)] text-4xl italic text-text-secondary">
              {title.charAt(0)}
            </span>
            <span className="mt-1 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.18em] text-text-secondary">
              awaiting print
            </span>
          </div>
        ) : (
          <>
            {status === "loading" && (
              <div className="stamp-shimmer absolute inset-0 bg-bg-surface" aria-hidden="true" />
            )}
            <Image
              src={imageSrc as string}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 group-hover:scale-[1.04] ${
                status === "loaded" ? "opacity-100" : "opacity-0"
              }`}
              priority={priority}
              onLoad={() => setStatus("loaded")}
              onError={() => setStatus("error")}
            />
          </>
        )}
        </div>
      </div>

      {(catalogNo || category) && (
        <div className="mt-2.5 flex items-baseline justify-between px-0.5 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.14em] text-text-primary/70">
          <span>{catalogNo}</span>
          <span>{category}</span>
        </div>
      )}

      <h3 className="mt-0.5 px-0.5 font-[family-name:var(--font-playfair)] text-xl font-medium leading-tight text-text-primary transition-colors group-hover:text-accent">
        {title}
      </h3>

      {caption && (
        <p className="mt-1.5 px-0.5 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {caption}
        </p>
      )}

      {href && (
        <span className="mt-1.5 inline-flex items-center gap-1.5 px-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-accent">
          View the dispatch
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      )}
    </>
  );

  const edgeClass = `stamp-edge group block rounded-[3px] p-2.5 transition-transform duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1 ${
    featured ? "outline outline-2 outline-offset-[3px] outline-accent/55" : ""
  }`;

  const style = perfBg ? ({ ["--perf-bg" as string]: perfBg }) : undefined;

  if (href) {
    return (
      <Link
        href={href}
        className={`${edgeClass} outline-none focus-visible:outline-accent`}
        style={style}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={edgeClass} style={style}>
      {inner}
    </div>
  );
}
