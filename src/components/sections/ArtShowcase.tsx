"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { artworks } from "@/data/artworks";

gsap.registerPlugin(useGSAP);

// Precompute stable rotation offsets per card position in the stack
const STACK_ROTATIONS = [0, -2, 1.5, -1, 2.5];
const STACK_OFFSETS = [0, 3, 6, 9, 12]; // px translate for depth
const AUTO_PLAY_INTERVAL = 4000; // ms
const RESUME_DELAY = 6000; // ms after interaction before auto-play resumes
const ANIMATION_DURATION = 0.5;

export default function ArtShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewportRef = useRef(false);
  const isPausedRef = useRef(false);
  const prefersReducedMotion = useRef(false);

  // Pointer tracking for swipe
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const total = artworks.length;

  // Check reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  // --- Navigation ---

  const goTo = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating || total <= 1) return;

      const cardEl = containerRef.current?.querySelector(
        `[data-card-index="${activeIndex}"]`
      ) as HTMLElement | null;

      const nextIndex =
        direction === "next"
          ? (activeIndex + 1) % total
          : (activeIndex - 1 + total) % total;

      if (!cardEl || prefersReducedMotion.current) {
        // Reduced motion: instant swap
        setActiveIndex(nextIndex);
        return;
      }

      setIsAnimating(true);
      const xTarget = direction === "next" ? -120 : 120;

      gsap.to(cardEl, {
        x: xTarget,
        rotation: direction === "next" ? -15 : 15,
        opacity: 0,
        duration: ANIMATION_DURATION,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(nextIndex);
          setIsAnimating(false);
          // Reset the card that just animated out
          gsap.set(cardEl, { x: 0, rotation: 0, opacity: 1 });
        },
      });
    },
    [activeIndex, isAnimating, total]
  );

  const goNext = useCallback(() => goTo("next"), [goTo]);
  const goPrev = useCallback(() => goTo("prev"), [goTo]);

  // --- Auto-play ---

  const clearAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (prefersReducedMotion.current || total <= 1) return;
    clearAutoPlay();
    autoPlayRef.current = setTimeout(() => {
      if (isInViewportRef.current && !isPausedRef.current) {
        goNext();
        startAutoPlay();
      }
    }, AUTO_PLAY_INTERVAL);
  }, [clearAutoPlay, goNext, total]);

  const pauseAutoPlay = useCallback(() => {
    clearAutoPlay();
    clearResumeTimer();
  }, [clearAutoPlay, clearResumeTimer]);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      if (isInViewportRef.current && !isPausedRef.current) {
        startAutoPlay();
      }
    }, RESUME_DELAY);
  }, [clearResumeTimer, startAutoPlay]);

  // --- IntersectionObserver ---

  useEffect(() => {
    const section = containerRef.current?.closest("section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !isPausedRef.current) {
          startAutoPlay();
        } else {
          clearAutoPlay();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [startAutoPlay, clearAutoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoPlay();
      clearResumeTimer();
    };
  }, [clearAutoPlay, clearResumeTimer]);

  // --- Interaction handlers ---

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
    pauseAutoPlay();
  }, [pauseAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    startAutoPlay();
  }, [startAutoPlay]);

  const handleFocus = useCallback(() => {
    isPausedRef.current = true;
    pauseAutoPlay();
  }, [pauseAutoPlay]);

  const handleBlur = useCallback(() => {
    isPausedRef.current = false;
    startAutoPlay();
  }, [startAutoPlay]);

  const handleManualAdvance = useCallback(
    (direction: "next" | "prev") => {
      pauseAutoPlay();
      goTo(direction);
      scheduleResume();
    },
    [pauseAutoPlay, goTo, scheduleResume]
  );

  const handleClick = useCallback(() => {
    handleManualAdvance("next");
  }, [handleManualAdvance]);

  // --- Keyboard ---

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleManualAdvance("next");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleManualAdvance("prev");
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        // Toggle pause
        isPausedRef.current = !isPausedRef.current;
        if (isPausedRef.current) {
          pauseAutoPlay();
        } else {
          startAutoPlay();
        }
      }
    },
    [handleManualAdvance, pauseAutoPlay, startAutoPlay]
  );

  // --- Pointer/Swipe ---

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerStart.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      pointerStart.current = null;

      // Check if it's a swipe (>50px horizontal, <30px vertical drift)
      if (Math.abs(dx) > 50 && Math.abs(dy) < 30) {
        if (dx < 0) {
          handleManualAdvance("next");
        } else {
          handleManualAdvance("prev");
        }
      } else if (Math.abs(dx) <= 10 && Math.abs(dy) <= 10) {
        // Tap — treat as click to advance
        handleManualAdvance("next");
      }
    },
    [handleManualAdvance]
  );

  // --- Render stack ---
  // Show the active card on top, with up to 4 cards visible behind it
  const getStackOrder = () => {
    const stack: number[] = [];
    for (let i = 0; i < Math.min(5, total); i++) {
      stack.push((activeIndex + i) % total);
    }
    return stack;
  };

  const stackOrder = getStackOrder();

  return (
    <section id="art" className="py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="04" label="Art" />
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
            Pixels &amp; palettes.
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
            Digital illustrations from the sketchbook.
          </p>

          {/* Card stack */}
          <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Digital art showcase"
            tabIndex={0}
            className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary rounded-2xl"
            style={{ height: "28rem" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {stackOrder.map((artIndex, stackPosition) => {
              const artwork = artworks[artIndex];
              const isTop = stackPosition === 0;
              const rotation = STACK_ROTATIONS[stackPosition] ?? 0;
              const yOffset = STACK_OFFSETS[stackPosition] ?? 0;
              const zIndex = 10 - stackPosition;
              const scale = 1 - stackPosition * 0.03;

              return (
                <div
                  key={artwork.id}
                  data-card-index={artIndex}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={artwork.alt}
                  aria-hidden={!isTop}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-border cursor-pointer select-none"
                  style={{
                    zIndex,
                    transform: `rotate(${rotation}deg) translateY(${yOffset}px) scale(${scale})`,
                    transition: isTop ? "none" : "transform 0.4s ease-out",
                    pointerEvents: isTop ? "auto" : "none",
                  }}
                  onClick={isTop ? handleClick : undefined}
                >
                  <Image
                    src={artwork.imagePath}
                    alt={artwork.alt}
                    width={artwork.width}
                    height={artwork.height}
                    className="w-full h-full object-contain bg-bg-surface"
                    priority={artIndex === 0}
                    loading={artIndex <= 2 ? "eager" : "lazy"}
                  />
                </div>
              );
            })}
          </div>

          {/* Counter */}
          {total > 1 && (
            <div className="flex items-center justify-center mt-6 gap-4">
              <button
                aria-label="Previous artwork"
                className="text-text-secondary hover:text-accent transition-colors text-lg"
                onClick={() => handleManualAdvance("prev")}
              >
                ←
              </button>
              <span
                className="text-sm text-text-secondary font-[family-name:var(--font-inter)] tabular-nums"
                aria-live="polite"
              >
                {activeIndex + 1} / {total}
              </span>
              <button
                aria-label="Next artwork"
                className="text-text-secondary hover:text-accent transition-colors text-lg"
                onClick={() => handleManualAdvance("next")}
              >
                →
              </button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
