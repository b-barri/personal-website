"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-surface to-bg-primary animate-gradient-shift" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Photo placeholder — replace with your actual photo */}
          <div className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-2 border-border shadow-lg bg-bg-surface">
            <Image
              src="/images/hero/photo.jpg"
              alt="Bhavya Barri"
              fill
              className="object-cover"
              priority
              onError={(e) => {
                // Hide broken image, show initials fallback
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Initials fallback */}
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-text-secondary font-[family-name:var(--font-heading)]">
              BB
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-heading)] text-text-primary">
            Bhavya Barri
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed">
            Side projects are how I think.{" "}
            <span className="text-text-primary">
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
          <div className="flex flex-col items-center gap-2 text-text-secondary">
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
