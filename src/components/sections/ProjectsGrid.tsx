import { projects } from "@/data/projects";
import CatalogLabel from "@/components/ui/CatalogLabel";
import Stamp from "@/components/ui/Stamp";
import StampGrid from "@/components/ui/StampGrid";

// Sort: featured first, then original order.
const sortedProjects = [...projects].sort(
  (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
);

export default function ProjectsGrid() {
  return (
    <section id="projects" className="py-20 md:py-32 bg-grid">
      <div className="mx-auto max-w-6xl px-6">
        <CatalogLabel number="01" className="mb-6">The Album</CatalogLabel>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-normal text-text-primary mb-4 md:mb-6 leading-[1.05] tracking-tight">
          Side Quests, filed.
        </h2>
        <p className="text-text-secondary text-base md:text-lg mb-12 md:mb-16 max-w-2xl leading-relaxed">
          {projects.length} side projects across AI tools, Claude skills, and creative
          experiments. Each one is a stamp in the album. Open any to read its dispatch.
        </p>

        <StampGrid className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
          {sortedProjects.map((project, i) => (
            <div key={project.slug} data-stamp>
              <Stamp
                imageSrc={project.imagePath}
                imageAlt={project.title}
                catalogNo={`No. ${String(i + 1).padStart(2, "0")}`}
                title={project.title}
                caption={project.tagline}
                href={`/projects/${project.slug}`}
                featured={project.featured}
                priority={i < 3}
              />
            </div>
          ))}
        </StampGrid>
      </div>
    </section>
  );
}
