"use client";

// Quest Stamp prototype — plays the wax-seal "thunk" when a project page is
// visited for the first time.
// PROTOTYPE: evaluating the "Side Quests as a mechanic" idea (docs/ideation/2026-06-12).

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import { stampQuest, getStampedSlugs } from "@/lib/questlog";
import { WaxSeal } from "./QuestLog";

const SEAL_COLORS = ["#A63D2F", "#8E4A2E", "#A03548", "#7E4E35"];

function initialsOf(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Stamps from the last few seconds still count as "fresh" — React StrictMode
// mounts effects twice in dev, and the second mount must still show the toast
// even though the localStorage write happened on the first.
const freshStamps = new Map<string, number>();

export default function QuestStamp({ slug, title }: { slug: string; title: string }) {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (stampQuest(slug)) freshStamps.set(slug, Date.now());
    const stampedAt = freshStamps.get(slug);
    if (!stampedAt || Date.now() - stampedAt > 3000) return;
    setCount(getStampedSlugs().length);
    const showTimer = setTimeout(() => setShow(true), 700);
    const hideTimer = setTimeout(() => setShow(false), 4500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [slug]);

  const index = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const total = projects.length;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border border-border bg-bg-primary bg-grid-fine shadow-xl pl-4 pr-6 py-4 max-w-[calc(100vw-3rem)]"
          role="status"
          aria-live="polite"
        >
          {/* The seal presses in after the card lands */}
          <motion.div
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { scale: 2.6, opacity: 0, rotate: -28 }
            }
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { scale: 1, opacity: 1, rotate: -8 }
            }
            transition={
              reducedMotion
                ? { delay: 0.3 }
                : { delay: 0.35, type: "spring", stiffness: 500, damping: 22, mass: 1.1 }
            }
          >
            <WaxSeal
              label={initialsOf(title)}
              color={SEAL_COLORS[index % SEAL_COLORS.length]}
              size={52}
            />
          </motion.div>
          <div>
            <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-text-primary uppercase tracking-widest">
              Quest complete
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              {title} · <span className="tabular-nums">{count}/{total}</span> witnessed
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
