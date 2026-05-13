"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import SectionLabel from "@/components/ui/SectionLabel";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

// Sort: featured first, then original order
const sortedProjects = [...projects].sort(
  (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
);

export default function ProjectsGrid() {
  const prefersReducedMotion = useReducedMotion();
  const MotionDiv = prefersReducedMotion ? "div" : motion.div;

  return (
    <section id="projects" className="py-20 md:py-32 bg-grid">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel number="01" label="Selected Work" />
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
          Side Quests
        </h2>
        <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
          13 projects across AI tools, Claude skills, and creative experiments.
        </p>

        <MotionDiv
          {...(!prefersReducedMotion && {
            variants: containerVariants,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, amount: 0.1 },
          })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-14"
        >
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  prefersReducedMotion,
}: {
  project: (typeof projects)[number];
  prefersReducedMotion: boolean;
}) {
  const Wrapper = prefersReducedMotion ? "div" : motion.div;

  return (
    <Wrapper
      {...(!prefersReducedMotion && { variants: cardVariants })}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block tilt-card rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary outline-none"
      >
        {/* Project image */}
        <div className={`relative aspect-[4/3] bg-bg-surface overflow-hidden rounded-2xl border transition-all duration-300 ${
          project.featured ? "border-accent/20" : "border-border"
        } group-hover:border-accent/40 group-hover:shadow-xl`}>
          <Image
            src={project.imagePath}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient fallback when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center -z-10">
            <span className="text-4xl font-normal text-accent/20 font-[family-name:var(--font-playfair)] italic">
              {project.title.charAt(0)}
            </span>
          </div>
          {project.featured && (
            <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-medium bg-bg-primary dark:bg-bg-surface/95 backdrop-blur-sm text-text-primary rounded-full uppercase tracking-widest">
              Featured
            </span>
          )}
        </div>

        {/* Card content */}
        <div className="pt-5 pb-2">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-normal text-text-primary group-hover:text-accent transition-colors leading-tight">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
            View
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </Link>
    </Wrapper>
  );
}
