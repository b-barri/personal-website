import Hero from "@/components/sections/Hero";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import About from "@/components/sections/About";
import Writing from "@/components/sections/Writing";
import Resume from "@/components/sections/Resume";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <Marquee />
      <ProjectsGrid />
      <About />
      <Writing />
      <Resume />
      <Footer />
    </main>
  );
}
