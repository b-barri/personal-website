import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProjectImage from "@/components/ui/ProjectImage";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { projects } from "@/data/projects";
import { getProjectContent } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — Bhavya's Side Quests`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [project.imagePath],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const fullContent = getProjectContent(slug);

  return (
    <main id="main" className="flex-1 pt-16 bg-bg-primary">
      {/* Hero image with title overlay */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-bg-surface overflow-hidden">
        <ProjectImage
          src={project.imagePath}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />

        {/* Title overlay on hero */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-4xl px-6 pb-16 w-full">
            {/* Back link */}
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to projects
            </Link>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[1.05] drop-shadow-lg">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md font-[family-name:var(--font-inter)]">
              {project.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Tools */}
        {project.tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full uppercase tracking-wide font-[family-name:var(--font-inter)]"
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.links.demo || project.links.github || project.links.other) && (
          <div className="flex flex-wrap gap-3 mb-12 pb-12 border-b border-border">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm"
              >
                Live Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-white rounded-lg text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {project.links.other?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-white rounded-lg text-sm font-semibold text-text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {link.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Full content from markdown OR fallback to description */}
        {fullContent ? (
          <MarkdownContent content={fullContent} />
        ) : (
          <>
            <p className="text-text-primary text-lg leading-relaxed mb-12">
              {project.description}
            </p>

            {project.features.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text-primary mb-4">
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-text-primary"
                    >
                      <svg
                        className="w-5 h-5 text-accent mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Footer back link */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all projects
          </Link>
        </div>
      </div>
    </main>
  );
}
