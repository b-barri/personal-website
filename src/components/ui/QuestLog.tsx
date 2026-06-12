"use client";

// Quest Log prototype — nav button + drawer of wax-seal stamps.
// PROTOTYPE: evaluating the "Side Quests as a mechanic" idea (docs/ideation/2026-06-12).

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { getStampedSlugs, resetQuests, romanize, QUEST_EVENT } from "@/lib/questlog";

const SEAL_COLORS = ["#A63D2F", "#8E4A2E", "#A03548", "#7E4E35"];

function initialsOf(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function WaxSeal({
  label,
  color,
  size = 40,
  className = "",
}: {
  label: string;
  color: string;
  size?: number;
  className?: string;
}) {
  // Scalloped edge: a ring of small circles unioned with the base disc.
  const bumps = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { cx: 50 + Math.cos(a) * 38, cy: 50 + Math.sin(a) * 38 };
  });
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {bumps.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r="9" fill={color} />
      ))}
      <circle cx="50" cy="50" r="40" fill={color} />
      <circle
        cx="50"
        cy="50"
        r="31"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2.5"
        strokeDasharray="3 4"
      />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgba(255,255,255,0.92)"
        fontSize="30"
        fontWeight="700"
        fontFamily="var(--font-space-grotesk), sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export default function QuestLog({ scrolled }: { scrolled: boolean }) {
  const [stamped, setStamped] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setStamped(getStampedSlugs());
    sync();
    window.addEventListener(QUEST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUEST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const total = projects.length;
  const count = stamped.length;
  const complete = count >= total;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Quest log: ${count} of ${total} quests complete`}
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          scrolled
            ? "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {/* Scroll/log icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H8a3 3 0 01-3-3V5a2 2 0 012-2h10a2 2 0 012 2v11" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 16a2.5 2.5 0 000 5" />
          <path strokeLinecap="round" d="M9 7h6M9 11h6" />
        </svg>
        <span className="tabular-nums">{count}/{total}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-[19rem] sm:w-80 rounded-2xl border border-border bg-bg-primary bg-grid-fine shadow-xl overflow-hidden"
            role="dialog"
            aria-label="Quest log"
          >
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-text-primary uppercase tracking-widest">
                Quest Log
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {complete
                  ? "every seal pressed. the last door is open."
                  : `${count} of ${total} side quests witnessed`}
              </p>
            </div>

            <ul className="max-h-80 overflow-y-auto px-3 py-2">
              {projects.map((p, i) => {
                const done = stamped.includes(p.slug);
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-bg-surface transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {done ? (
                        <WaxSeal
                          label={initialsOf(p.title)}
                          color={SEAL_COLORS[i % SEAL_COLORS.length]}
                          size={28}
                          className="shrink-0 -rotate-6"
                        />
                      ) : (
                        <span className="shrink-0 w-7 h-7 rounded-full border-2 border-dashed border-border" />
                      )}
                      <span
                        className={`text-sm truncate ${
                          done ? "text-text-primary" : "text-text-secondary"
                        }`}
                      >
                        {p.title}
                      </span>
                    </Link>
                  </li>
                );
              })}

              {/* The sixteenth slot */}
              <li className="mt-1 pt-2 border-t border-dashed border-border">
                {complete ? (
                  <Link
                    href="/quest-16"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                  >
                    <WaxSeal label={romanize(total + 1)} color="#B8860B" size={28} className="shrink-0 animate-pulse" />
                    <span className="text-sm font-semibold text-accent">
                      the hidden quest
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-2 py-2 opacity-70">
                    <span className="shrink-0 w-7 h-7 rounded-full border-2 border-dotted border-text-secondary/50" />
                    <span className="text-sm tracking-[0.3em] text-text-secondary">???</span>
                  </div>
                )}
              </li>
            </ul>

            <div className="px-5 py-2.5 border-t border-border flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-text-secondary">
                prototype
              </span>
              <button
                onClick={() => resetQuests()}
                className="text-[10px] uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
              >
                wipe seals
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
