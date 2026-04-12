"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh items-start justify-center overflow-hidden pt-20 md:pt-40">
      {/* Full background image — light theme */}
      <div className="absolute inset-0 -z-10 dark:hidden">
        <Image
          src="/images/hero/photo.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Subtle gradient for text readability at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Full background image — dark theme */}
      <div className="absolute inset-0 -z-10 hidden dark:block">
        <Image
          src="/images/hero/photo-dark.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Stronger gradient for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/70 via-bg-dark/40 to-bg-dark/60" />
      </div>

      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="font-[family-name:var(--font-playfair)] italic text-base text-white/70">
              00
            </span>
            <span className="h-px w-12 bg-white/30" />
            <span className="font-[family-name:var(--font-playfair)] italic text-sm text-white/70 tracking-wide">
              Portfolio
            </span>
          </div>
          <h1 className="text-[3.25rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal italic font-[family-name:var(--font-playfair)] text-white tracking-tight leading-[1.05]">
            Bhavya Barri
          </h1>
          <p className="text-base md:text-lg text-white/75 max-w-lg leading-relaxed tracking-wide font-[family-name:var(--font-inter)] mt-4">
            Curious by default, builder by reflex.{" "}
            <span className="text-white/95">
              Each Side Quest is a question I couldn&apos;t stop poking at.
            </span>
          </p>
        </motion.div>

        {/* Caption — inline on mobile, below tagline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="sm:hidden mt-6"
        >
          <div className="flex items-start gap-2 justify-center">
            <span className="h-px w-6 bg-white/30 mt-2 shrink-0" />
            <p className="font-[family-name:var(--font-playfair)] italic text-[11px] text-white/60 leading-snug">
              Bangalore in tabebuia bloom — the pink riot we call cherry blossom
              season.
            </p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-12"
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-[10px] tracking-[0.25em] uppercase font-[family-name:var(--font-inter)]">
              Scroll
            </span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Image caption — bottom-left, desktop only */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="hidden sm:block absolute bottom-8 left-8 max-w-xs z-10"
      >
        <div className="flex items-start gap-3">
          <span className="h-px w-8 bg-white/30 mt-2.5 shrink-0" />
          <p className="font-[family-name:var(--font-playfair)] italic text-xs md:text-sm text-white/70 leading-snug">
            Bangalore in tabebuia bloom — the pink riot we call cherry blossom
            season.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
