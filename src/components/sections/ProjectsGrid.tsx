"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

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
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-4">
          Side Quests
        </h2>
        <p className="text-text-secondary text-lg mb-12 max-w-2xl">
          11 projects across AI tools, Claude skills, and creative experiments.
        </p>

        <MotionDiv
          {...(!prefersReducedMotion && {
            variants: containerVariants,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, amount: 0.1 },
          })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        className={`group block rounded-xl overflow-hidden border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-accent/30 ${
          project.featured
            ? "border-accent/20 shadow-sm"
            : "border-border"
        } bg-white`}
      >
        {/* Project image */}
        <div className="relative aspect-video bg-bg-surface overflow-hidden">
          <Image
            src={project.imagePath}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient fallback when no image */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-accent/20 font-[family-name:var(--font-heading)]">
              {project.title.charAt(0)}
            </span>
          </div>
          {project.featured && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-accent text-white rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Card content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-primary group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
            {project.tagline}
          </p>
        </div>
      </Link>
    </Wrapper>
  );
}
