"use client";

// Hover/tap-to-explain tooltip for technical terms in case studies.
// Rendered in place of <abbr> by MarkdownContent; the plain-language
// explanation arrives in `title` (see lib/remark-gloss.ts).

import { useState, useId, useRef, useEffect } from "react";

export default function GlossTerm({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  // Tap-away + Escape to dismiss (mobile / keyboard)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // No explanation? Render the term plainly.
  if (!title) return <span>{children}</span>;

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="gloss-term cursor-help font-medium text-text-primary underline decoration-dotted decoration-accent/70 underline-offset-[3px] hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded"
      >
        {children}
      </button>
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-xl border border-border bg-bg-surface px-3.5 py-2.5 text-left text-[13px] font-normal not-italic leading-snug text-text-secondary shadow-xl transition-all duration-150 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        <span className="mb-1 block font-[family-name:var(--font-heading)] text-[10px] uppercase tracking-widest text-accent">
          in plain words
        </span>
        {title}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-border bg-bg-surface" />
      </span>
    </span>
  );
}
