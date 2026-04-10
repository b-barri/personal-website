"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-start justify-center overflow-hidden pt-32 md:pt-40">
      {/* Full background image */}
      <div className="absolute inset-0 -z-10">
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

      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-normal font-[family-name:var(--font-playfair)] text-white tracking-tight leading-[1.1]">
            Bhavya Barri
          </h1>
          <p className="text-base md:text-lg text-white/75 max-w-lg leading-relaxed tracking-wide font-[family-name:var(--font-inter)]">
            Side projects are how I think.{" "}
            <span className="text-white/95">
              These are the ones that made it out.
            </span>
          </p>
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
    </section>
  );
}
