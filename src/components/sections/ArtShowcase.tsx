"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { artworks } from "@/data/artworks";

gsap.registerPlugin(useGSAP);

const AUTO_PLAY_INTERVAL = 4000;
const RESUME_DELAY = 6000;

export default function ArtShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewportRef = useRef(false);
  const isPausedRef = useRef(false);
  const prefersReducedMotion = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const total = artworks.length;

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  // Get the indices for the visible 5-card spread: far-left, left, center, right, far-right
  const getVisibleIndices = useCallback(
    (center: number) => ({
      farLeft: (center - 2 + total) % total,
      left: (center - 1 + total) % total,
      center,
      right: (center + 1) % total,
      farRight: (center + 2) % total,
    }),
    [total]
  );

  // Position config for each slot
  const getSlotStyle = (
    slot: "farLeft" | "left" | "center" | "right" | "farRight"
  ) => {
    switch (slot) {
      case "farLeft":
        return {
          x: "-130%",
          scale: 0.45,
          rotateY: 35,
          opacity: 0,
          zIndex: 1,
        };
      case "left":
        return {
          x: "-72%",
          scale: 0.7,
          rotateY: 25,
          opacity: 0.6,
          zIndex: 2,
        };
      case "center":
        return {
          x: "0%",
          scale: 1,
          rotateY: 0,
          opacity: 1,
          zIndex: 4,
        };
      case "right":
        return {
          x: "72%",
          scale: 0.7,
          rotateY: -25,
          opacity: 0.6,
          zIndex: 2,
        };
      case "farRight":
        return {
          x: "130%",
          scale: 0.45,
          rotateY: -35,
          opacity: 0,
          zIndex: 1,
        };
    }
  };

  // Apply position to a card element
  const applySlotPosition = useCallback(
    (el: HTMLElement | null, slot: string, animate: boolean) => {
      if (!el) return;
      const style = getSlotStyle(
        slot as "farLeft" | "left" | "center" | "right" | "farRight"
      );
      if (!style) return;

      if (animate && !prefersReducedMotion.current) {
        gsap.to(el, {
          xPercent: parseFloat(style.x),
          scale: style.scale,
          rotateY: style.rotateY,
          opacity: style.opacity,
          zIndex: style.zIndex,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            el.style.zIndex = String(style.zIndex);
          },
        });
      } else {
        gsap.set(el, {
          xPercent: parseFloat(style.x),
          scale: style.scale,
          rotateY: style.rotateY,
          opacity: style.opacity,
          zIndex: style.zIndex,
        });
      }
    },
    []
  );

  // Position all cards based on current active index
  const positionCards = useCallback(
    (center: number, animate: boolean) => {
      const visible = getVisibleIndices(center);
      const slotMap: Record<string, number> = {
        farLeft: visible.farLeft,
        left: visible.left,
        center: visible.center,
        right: visible.right,
        farRight: visible.farRight,
      };

      // Hide all cards first, then show visible ones
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        const slot = Object.entries(slotMap).find(
          ([, idx]) => idx === i
        )?.[0];
        if (slot) {
          el.style.visibility = "visible";
          applySlotPosition(el, slot, animate);
        } else {
          el.style.visibility = "hidden";
          gsap.set(el, { opacity: 0 });
        }
      });
    },
    [getVisibleIndices, applySlotPosition]
  );

  // Initial positioning
  useGSAP(
    () => {
      positionCards(activeIndex, false);
    },
    { scope: containerRef, dependencies: [] }
  );

  // --- Navigation ---

  const goTo = useCallback(
    (direction: "next" | "prev") => {
      if (isAnimating || total <= 1) return;
      setIsAnimating(true);

      const nextIndex =
        direction === "next"
          ? (activeIndex + 1) % total
          : (activeIndex - 1 + total) % total;

      positionCards(nextIndex, true);

      // Wait for animation to finish
      const dur = prefersReducedMotion.current ? 0 : 600;
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setIsAnimating(false);
      }, dur);
    },
    [activeIndex, isAnimating, total, positionCards]
  );

  const goNext = useCallback(() => goTo("next"), [goTo]);

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
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [startAutoPlay, clearAutoPlay]);

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

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      pointerStart.current = null;

      if (Math.abs(dx) > 50 && Math.abs(dy) < 30) {
        handleManualAdvance(dx < 0 ? "next" : "prev");
      }
    },
    [handleManualAdvance]
  );

  return (
    <section id="art" className="py-20 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionLabel number="04" label="Art" />
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
            Pixels &amp; palettes.
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
            Digital illustrations from the sketchbook.
          </p>
        </ScrollReveal>

        {/* 3D Carousel */}
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Digital art showcase"
          tabIndex={0}
          className="relative mx-auto outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary rounded-2xl"
          style={{
            height: "clamp(22rem, 45vw, 32rem)",
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {artworks.map((artwork, i) => {
            const isCenter = i === activeIndex;
            return (
              <div
                key={artwork.id}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={artwork.alt}
                aria-hidden={!isCenter}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
                style={{
                  width: "clamp(16rem, 35vw, 26rem)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  visibility: "hidden",
                }}
                onClick={
                  isCenter
                    ? () => handleManualAdvance("next")
                    : undefined
                }
              >
                {/* Card frame — matted gallery style */}
                <div
                  className="relative rounded-xl overflow-hidden transition-shadow duration-300"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(0,0,0,0.03))",
                    boxShadow: isCenter
                      ? "0 25px 60px -12px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                      : "0 10px 30px -8px rgba(0,0,0,0.2), 0 4px 12px -4px rgba(0,0,0,0.1)",
                    padding: "0.625rem",
                  }}
                >
                  {/* Inner image with subtle border */}
                  <div className="relative rounded-lg overflow-hidden ring-1 ring-black/[0.06] dark:ring-white/[0.06]">
                    <Image
                      src={artwork.imagePath}
                      alt={artwork.alt}
                      width={artwork.width}
                      height={artwork.height}
                      className="w-full h-auto block"
                      style={{ aspectRatio: `${artwork.width}/${artwork.height}` }}
                      priority={i <= 2}
                      loading={i <= 4 ? "eager" : "lazy"}
                    />
                    {/* Subtle inner vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 30px rgba(0,0,0,0.06)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Click zones for side cards */}
          <button
            aria-label="Previous artwork"
            className="absolute left-0 top-0 w-[30%] h-full z-[3] cursor-pointer bg-transparent border-none"
            onClick={() => handleManualAdvance("prev")}
          />
          <button
            aria-label="Next artwork"
            className="absolute right-0 top-0 w-[30%] h-full z-[3] cursor-pointer bg-transparent border-none"
            onClick={() => handleManualAdvance("next")}
          />
        </div>

        {/* Controls */}
        {total > 1 && (
          <div className="flex items-center justify-center mt-8 gap-6">
            <button
              aria-label="Previous artwork"
              className="w-10 h-10 rounded-full border border-border bg-bg-primary hover:border-accent hover:text-accent flex items-center justify-center text-text-secondary transition-all duration-200"
              onClick={() => handleManualAdvance("prev")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="translate-x-[-1px]"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {artworks.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to artwork ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 h-1.5 bg-accent"
                      : "w-1.5 h-1.5 bg-border hover:bg-text-secondary"
                  }`}
                  onClick={() => {
                    if (i === activeIndex || isAnimating) return;
                    pauseAutoPlay();
                    setIsAnimating(true);
                    positionCards(i, true);
                    setTimeout(() => {
                      setActiveIndex(i);
                      setIsAnimating(false);
                    }, prefersReducedMotion.current ? 0 : 600);
                    scheduleResume();
                  }}
                />
              ))}
            </div>

            <button
              aria-label="Next artwork"
              className="w-10 h-10 rounded-full border border-border bg-bg-primary hover:border-accent hover:text-accent flex items-center justify-center text-text-secondary transition-all duration-200"
              onClick={() => handleManualAdvance("next")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="translate-x-[1px]"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Live region for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing artwork {activeIndex + 1} of {total}:{" "}
          {artworks[activeIndex]?.alt}
        </div>
      </div>
    </section>
  );
}
