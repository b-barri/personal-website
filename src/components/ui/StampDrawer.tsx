"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

// Subscribe to a media query without a setState-in-effect (the React 19 way).
// Server snapshot is `false`, so SSR renders the non-reduced / no-parallax shape.
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

// StampDrawer — the art section's "take one" gift. A bifold folder opens (covers
// fold back), postcards fan out of the pocket, and clicking one pops it forward
// to flip (front = artwork, back = a handwritten note) and "take". All the 3D
// chrome lives in globals.css under `.drawer`; this owns the state machine,
// keyboard flow, focus management, parallax, and the reduced-motion fallback.

export interface DrawerCard {
  id: string;
  imageSrc: string;
  alt: string;
  title: string;
  no: string;
  note: string;
  edition: string;
}

type Phase = "closed" | "open" | "popped";

interface StampDrawerProps {
  cards: DrawerCard[];
  /** Shown on the closed folder's left cover. */
  label?: string;
  className?: string;
}

// Compact fanned deck that scales to any count: gentle horizontal overlap, an
// arc of rotation, outer cards dipping lower, center card on top. The per-card
// stagger is bounded so a big deck still cascades open in well under a second.
function fan(i: number, n: number) {
  const center = (n - 1) / 2;
  const off = i - center;
  const t = center === 0 ? 0 : off / center; // -1..1 across the deck
  const per = Math.min(70, 420 / n);
  return {
    "--fx": `${off * 20}px`,
    "--fr": `${t * 30}deg`,
    "--fy": `${10 + Math.abs(t) * 30}px`,
    "--fz": `${18 - Math.abs(off) * 1.3}px`,
    "--card-delay": `${40 + i * per}ms`,
  } as React.CSSProperties;
}

export default function StampDrawer({ cards, label = "The Stamp Drawer", className = "" }: StampDrawerProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [focused, setFocused] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  // environment: reduced motion flattens the 3D; parallax needs a fine pointer
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = prefersReduced;
  const canParallax = finePointer && !prefersReduced;

  const wrapRef = useRef<HTMLDivElement>(null); // wraps drawer + tray (outside-click scope)
  const rootRef = useRef<HTMLDivElement>(null); // the .drawer element (parallax + CSS vars)
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastCardRef = useRef<number | null>(null); // to restore focus on "back"

  const resetParallax = useCallback(() => {
    const el = rootRef.current;
    if (el) {
      el.style.setProperty("--mx", "0deg");
      el.style.setProperty("--my", "0deg");
    }
  }, []);

  // --- transitions ---
  const open = useCallback(() => {
    setPhase("open");
    setFocused(null);
    setFlipped(false);
    resetParallax();
  }, [resetParallax]);

  const close = useCallback((focusTrigger = true) => {
    setPhase("closed");
    setFocused(null);
    setFlipped(false);
    setTaken({});
    resetParallax();
    if (focusTrigger) triggerRef.current?.focus();
  }, [resetParallax]);

  // --- hover open/close (desktop fine-pointer only; touch keeps tap) ---
  // Scoped to the whole component (drawer + tray) so reaching for the "take one"
  // button doesn't count as leaving. A short grace delay absorbs edge jitter and
  // the layout shift as the folder unfolds.
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHoverEnter = useCallback(() => {
    if (!finePointer) return;
    if (hoverLeaveTimer.current) {
      clearTimeout(hoverLeaveTimer.current);
      hoverLeaveTimer.current = null;
    }
    if (phase === "closed") open();
  }, [finePointer, phase, open]);

  const handleHoverLeave = useCallback(() => {
    if (!finePointer || phase === "closed") return;
    if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = setTimeout(() => close(false), 160);
  }, [finePointer, phase, close]);

  useEffect(
    () => () => {
      if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    },
    []
  );

  // back to the open drawer from a popped card (restores the fan, repeatable take)
  const backToDrawer = useCallback(() => {
    const prev = lastCardRef.current;
    setPhase("open");
    setFocused(null);
    setFlipped(false);
    setTaken({});
    resetParallax();
    if (prev != null) requestAnimationFrame(() => cardRefs.current[prev]?.focus());
  }, [resetParallax]);

  const popCard = useCallback(
    (i: number) => {
      lastCardRef.current = i;
      setFocused(i);
      setFlipped(false);
      setPhase("popped");
      resetParallax();
      requestAnimationFrame(() => cardRefs.current[i]?.focus());
    },
    [resetParallax]
  );

  const onCardActivate = useCallback(
    (i: number) => {
      if (phase === "popped" && focused === i) {
        setFlipped((f) => !f); // already up → flip
      } else {
        popCard(i);
      }
    },
    [phase, focused, popCard]
  );

  // the real "take one": download the artwork as a postcard, then mark it taken
  const takeOne = useCallback((card: DrawerCard) => {
    const a = document.createElement("a");
    a.href = card.imageSrc;
    a.download = `postcard-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTaken((t) => ({ ...t, [card.id]: true }));
  }, []);

  // --- Escape + click-outside (active only when not closed) ---
  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (phase === "popped") backToDrawer();
        else close();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        if (phase === "popped") backToDrawer();
        else close();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [phase, backToDrawer, close]);

  // --- parallax on the focused card (fine pointers only) ---
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!canParallax || phase !== "popped") return;
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const hx = (e.clientX - r.left) / r.width - 0.5;
      const vy = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", `${hx * 16}deg`);
      el.style.setProperty("--my", `${-vy * 16}deg`);
    },
    [phase, canParallax]
  );

  const focusedCard = focused != null ? cards[focused] : null;
  const focusedTaken = focusedCard ? !!taken[focusedCard.id] : false;

  return (
    <div
      ref={wrapRef}
      className={className}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
    >
      <div
        ref={rootRef}
        className="drawer"
        data-phase={phase}
        data-reduced={reduced ? "true" : "false"}
        onPointerMove={onPointerMove}
      >
        <div className="drawer-wrapper">
          {/* covers */}
          <div className="drawer-flap left" aria-hidden="true">
            <span className="drawer-brand">b.</span>
            <span className="drawer-meta">
              {label}
              <span>
                {cards.length} pieces · take one free
              </span>
            </span>
          </div>
          <div className="drawer-flap right" aria-hidden="true" />

          <div className="drawer-base">
            <div className="drawer-cards">
              {cards.map((card, i) => {
                const isFocused = focused === i;
                const interactive =
                  phase === "open" || (phase === "popped" && isFocused);
                return (
                  <button
                    key={card.id}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    type="button"
                    data-card
                    className={`drawer-card${isFocused ? " is-focused" : ""}${
                      isFocused && focusedTaken ? " is-leaving" : ""
                    }`}
                    style={fan(i, cards.length)}
                    tabIndex={interactive ? 0 : -1}
                    aria-hidden={!interactive}
                    aria-label={
                      isFocused
                        ? `${card.title}, postcard ${card.no}. Press Enter to flip it over.`
                        : `${card.title}, postcard ${card.no}. Press Enter to pull it out.`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardActivate(i);
                    }}
                  >
                    <span
                      className={`drawer-card-inner${
                        isFocused && flipped ? " flipped" : ""
                      }`}
                    >
                      {/* front — artwork */}
                      <span className="drawer-face front">
                        <Image
                          src={card.imageSrc}
                          alt={card.alt}
                          fill
                          sizes="(max-width: 768px) 70vw, 420px"
                          className="object-cover"
                        />
                        <span className="drawer-cap">
                          <span className="t">{card.title}</span>
                          <span className="n">{card.no} · iPad</span>
                        </span>
                      </span>
                      {/* back — handwritten note */}
                      <span className="drawer-face back">
                        <span className="drawer-note">{card.note}</span>
                        <span className="drawer-addr">
                          <span className="hd">POSTCARD</span>
                          <span className="ln" />
                          <span className="ln" />
                          <span className="ln" />
                          <span className="pmark">
                            TAKE
                            <br />
                            ONE
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="drawer-pocket" />
          </div>
        </div>

        {/* closed-state full-cover trigger — sibling of the 3D wrapper so its
            z-index actually wins (inside preserve-3d, only translateZ stacks) */}
        {phase === "closed" && (
          <button
            ref={triggerRef}
            type="button"
            className="drawer-trigger"
            aria-expanded={false}
            aria-label={`${label}. Open to take a postcard.`}
            onClick={open}
          />
        )}
      </div>

      {/* tray — context controls, always keyboard-reachable below the drawer */}
      <div className="mt-6 flex min-h-[2.5rem] flex-wrap items-center justify-center gap-3">
        {phase === "closed" && (
          <button
            type="button"
            onClick={open}
            className="group flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-text-secondary transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none rounded-full px-2 py-1"
          >
            <span
              aria-hidden="true"
              className="text-accent animate-bounce motion-reduce:animate-none"
            >
              ↑
            </span>
            {finePointer ? "hover to open" : "tap to open"} · take one, free
          </button>
        )}

        {phase === "open" && (
          <>
            <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-text-secondary">
              Pick a postcard to pull it out
            </p>
            <button
              type="button"
              onClick={() => close()}
              className="rounded-full border border-border bg-bg-primary px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none"
            >
              Close
            </button>
          </>
        )}

        {phase === "popped" && focusedCard && (
          <>
            <button
              type="button"
              onClick={backToDrawer}
              className="rounded-full border border-border bg-bg-primary px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none"
            >
              ← Back to drawer
            </button>
            <button
              type="button"
              disabled={focusedTaken}
              onClick={() => takeOne(focusedCard)}
              className={`rounded-full px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
                focusedTaken
                  ? "bg-[#2e7d52]"
                  : "bg-accent hover:bg-accent-hover"
              }`}
            >
              {focusedTaken ? `✓ saved · ${focusedCard.edition}` : "Take one ↓"}
            </button>
          </>
        )}
      </div>

      {/* live region for screen readers */}
      <p className="sr-only" aria-live="polite">
        {phase === "closed" && "Stamp drawer closed."}
        {phase === "open" && "Drawer open. Choose a postcard."}
        {phase === "popped" &&
          focusedCard &&
          `${focusedCard.title} postcard${
            focusedTaken ? ", taken." : flipped ? ", showing the note." : ", front side."
          }`}
      </p>
    </div>
  );
}
