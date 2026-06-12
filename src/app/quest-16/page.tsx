"use client";

// The sixteenth quest — hidden room, unlocked by stamping all side quests.
// PROTOTYPE: evaluating the "Side Quests as a mechanic" idea (docs/ideation/2026-06-12).

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { getStampedSlugs, romanize, QUEST_EVENT } from "@/lib/questlog";
import { WaxSeal } from "@/components/ui/QuestLog";

export default function QuestSixteen() {
  const [stamped, setStamped] = useState<string[] | null>(null);

  useEffect(() => {
    const sync = () => setStamped(getStampedSlugs());
    sync();
    window.addEventListener(QUEST_EVENT, sync);
    return () => window.removeEventListener(QUEST_EVENT, sync);
  }, []);

  // Avoid hydration flash: render nothing until localStorage is read
  if (stamped === null) return <main id="main" className="flex-1 min-h-screen bg-bg-primary" />;

  const total = projects.length;
  const complete = stamped.length >= total;

  return (
    <main id="main" className="flex-1 min-h-screen bg-bg-primary bg-grid flex items-center justify-center px-6 pt-16">
      {complete ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl text-center py-24"
        >
          <motion.div
            initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 20 }}
            className="inline-block mb-8"
          >
            <WaxSeal label={romanize(total + 1)} color="#B8860B" size={96} />
          </motion.div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Quest {romanize(total + 1)} — The Hidden One
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-4">
            You read <em className="font-[family-name:var(--font-playfair)] text-text-primary">everything</em>.
            All {total} side quests, witnessed and sealed. Statistically, you have now
            spent more time with this work than some of my interviewers.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed mb-10">
            There is no prize except this: you are exactly the kind of curious
            this site was built for. We should probably talk.
          </p>
          <a
            href="mailto:barribhavya7@gmail.com?subject=I%20finished%20the%20sixteenth%20quest"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm"
          >
            Claim the conversation
          </a>
          <p className="mt-12 text-xs uppercase tracking-[0.3em] text-text-secondary">
            prototype · clawd will live here too
          </p>
        </motion.div>
      ) : (
        <div className="max-w-md text-center py-24">
          <div className="inline-flex gap-2 mb-8 opacity-60">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="w-8 h-8 rounded-full border-2 border-dashed border-text-secondary/50" />
            ))}
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-text-primary mb-4">
            This door is sealed.
          </h1>
          <p className="text-text-secondary leading-relaxed mb-8">
            {stamped.length} of {total} wax seals pressed. The hidden quest opens
            only to those who witness all the others.
          </p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Back to the side quests
          </Link>
        </div>
      )}
    </main>
  );
}
