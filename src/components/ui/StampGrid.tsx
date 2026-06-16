"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// StampGrid — the album sleeve. As each stamp scrolls into view it "gets
// placed": a settle (scale + slight rotate → rest), like pressing a stamp onto
// an album page. IntersectionObserver (not ScrollTrigger) so lazy-loaded images
// shifting the layout can't leave rows stuck invisible. Reduced-motion just
// shows them.
//
// Each child stamp wrapper must carry data-stamp.
export default function StampGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-stamp]", root);
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, clearProps: "transform" });
      return;
    }

    // resting-but-hidden start state
    items.forEach((el) =>
      gsap.set(el, { opacity: 0, y: 16, scale: 1.12, rotate: gsap.utils.random(-3, 3) })
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.55,
            ease: "back.out(1.4)",
            overwrite: true,
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
