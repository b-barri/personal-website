"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
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
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
      </div>

      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-[family-name:var(--font-heading)] text-white drop-shadow-lg">
            Bhavya Barri
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed drop-shadow-md">
            Side projects are how I think.{" "}
            <span className="text-white font-medium">
              These are the ones that made it out.
            </span>
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-12"
        >
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
