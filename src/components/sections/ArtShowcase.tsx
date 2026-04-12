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

type Slot = "farLeft" | "left" | "center" | "right" | "farRight";

const SLOT_CONFIGS: Record<Slot, { xOffset: number; scale: number; rotateY: number; opacity: number; zIndex: number }> = {
  farLeft:  { xOffset: -1.3, scale: 0.5,  rotateY: 35,  opacity: 0,   zIndex: 1 },
  left:     { xOffset: -0.6, scale: 0.75, rotateY: 20,  opacity: 0.5, zIndex: 2 },
  center:   { xOffset: 0,    scale: 1,    rotateY: 0,   opacity: 1,   zIndex: 4 },
  right:    { xOffset: 0.6,  scale: 0.75, rotateY: -20, opacity: 0.5, zIndex: 2 },
  farRight: { xOffset: 1.3,  scale: 0.5,  rotateY: -35, opacity: 0,   zIndex: 1 },
};

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

  // Apply position using pixel-based x offset relative to container width
  const applySlotPosition = useCallback(
    (el: HTMLElement | null, slot: Slot, animate: boolean) => {
      if (!el) return;
      const config = SLOT_CONFIGS[slot];
      const container = containerRef.current;
      if (!container) return;

      const containerW = container.offsetWidth;
      const xPx = config.xOffset * containerW * 0.4; // 40% of container width per unit

      const props = {
        x: xPx,
        scale: config.scale,
        rotateY: config.rotateY,
        opacity: config.opacity,
        zIndex: config.zIndex,
      };

      if (animate && !prefersReducedMotion.current) {
        gsap.to(el, {
          ...props,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            el.style.zIndex = String(config.zIndex);
          },
        });
      } else {
        gsap.set(el, props);
      }
    },
    []
  );

  const positionCards = useCallback(
    (center: number, animate: boolean) => {
      const visible = getVisibleIndices(center);
      const slotMap: [Slot, number][] = [
        ["farLeft", visible.farLeft],
        ["left", visible.left],
        ["center", visible.center],
        ["right", visible.right],
        ["farRight", visible.farRight],
      ];

      const visibleSet = new Set(slotMap.map(([, idx]) => idx));

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        const entry = slotMap.find(([, idx]) => idx === i);
        if (entry) {
          el.style.visibility = "visible";
          applySlotPosition(el, entry[0], animate);
        } else if (!visibleSet.has(i)) {
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

  // Reposition on resize
  useEffect(() => {
    const handleResize = () => positionCards(activeIndex, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, positionCards]);

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
        if (isPausedRef.current) pauseAutoPlay();
        else startAutoPlay();
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
          <p className="text-text-secondary text-base md:text-lg mb-6 md:mb-8 max-w-2xl leading-relaxed">
            No models were prompted. Just Procreate, an Apple Pencil, and a free evening.
          </p>
        </ScrollReveal>

        {/* 3D Carousel */}
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Digital art showcase"
          tabIndex={0}
          className="relative mx-auto w-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary rounded-2xl"
          style={{
            height: "clamp(22rem, 45vw, 34rem)",
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
                className="absolute top-1/2 left-1/2 cursor-pointer select-none"
                style={{
                  width: "clamp(18rem, 38vw, 30rem)",
                  // Fixed centering — GSAP x is additive to this base position
                  transform: "translate(-50%, -50%)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  visibility: "hidden",
                }}
                onClick={
                  isCenter ? () => handleManualAdvance("next") : undefined
                }
              >
                {/* Card frame */}
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, var(--color-bg-surface), rgba(0,0,0,0.02))",
                    boxShadow: isCenter
                      ? "0 20px 50px -10px rgba(0,0,0,0.3), 0 8px 20px -6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)"
                      : "0 8px 24px -6px rgba(0,0,0,0.15), 0 4px 10px -4px rgba(0,0,0,0.08)",
                    padding: "0.5rem",
                  }}
                >
                  {/* Fixed aspect ratio image container */}
                  <div
                    className="relative rounded-lg overflow-hidden ring-1 ring-black/[0.06] dark:ring-white/[0.06]"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={artwork.imagePath}
                      alt={artwork.alt}
                      fill
                      sizes="(max-width: 768px) 64vw, 32vw"
                      className="object-cover"
                      priority={i <= 2}
                    />
                    {/* Inner vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clickable side zones */}
          <button
            aria-label="Previous artwork"
            className="absolute left-0 top-0 w-[28%] h-full z-[3] cursor-pointer bg-transparent border-none"
            onClick={() => handleManualAdvance("prev")}
          />
          <button
            aria-label="Next artwork"
            className="absolute right-0 top-0 w-[28%] h-full z-[3] cursor-pointer bg-transparent border-none"
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {artworks.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to artwork ${i + 1}`}
                  className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none ${
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing artwork {activeIndex + 1} of {total}: {artworks[activeIndex]?.alt}
        </div>
      </div>
    </section>
  );
}
