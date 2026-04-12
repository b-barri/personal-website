import Hero from "@/components/sections/Hero";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import About from "@/components/sections/About";
import Writing from "@/components/sections/Writing";
import ArtShowcase from "@/components/sections/ArtShowcase";
import Resume from "@/components/sections/Resume";
import Footer from "@/components/sections/Footer";
export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <ProjectsGrid />
      <About />
      <Writing />
      <ArtShowcase />
      <Resume />
      <Footer />
    </main>
  );
}
