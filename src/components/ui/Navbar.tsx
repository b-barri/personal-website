"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "#writing" },
  { label: "Art", href: "#art" },
  { label: "Resume", href: "#resume" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isScrollingRef = useRef(false);

  // Track scroll position for navbar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileOpen) return;
    const onScroll = () => setMobileOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      isScrollingRef.current = true;
      setActiveSection(href);

      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });

      const onScrollEnd = () => {
        isScrollingRef.current = false;
        window.removeEventListener("scrollend", onScrollEnd);
      };
      window.addEventListener("scrollend", onScrollEnd, { once: true });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    },
    []
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`text-xl font-normal italic font-[family-name:var(--font-playfair)] transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded ${
            scrolled ? "text-text-primary" : "text-white"
          }`}
        >
          Bhavya Barri
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-xs uppercase tracking-widest font-medium transition-all px-4 py-2 rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                activeSection === link.href
                  ? scrolled
                    ? "text-accent bg-accent/10"
                    : "text-white bg-white/15"
                  : scrolled
                    ? "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                    : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="ml-2 pl-2 border-l border-white/20 dark:border-white/10 flex items-center gap-1">
            <ThemeToggle scrolled={scrolled} />
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle scrolled={scrolled} />
          <button
            className={`flex flex-col justify-center items-center w-10 h-10 rounded-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors ${
              scrolled ? "hover:bg-bg-surface" : "hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-5 h-0.5 transition-all duration-200 ${
                scrolled ? "bg-text-primary" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 mt-1.5 transition-all duration-200 ${
                scrolled ? "bg-text-primary" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-bg-primary/95 backdrop-blur-md px-6 py-5">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm uppercase tracking-widest font-medium py-3 px-4 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                  activeSection === link.href
                    ? "text-accent bg-accent/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
