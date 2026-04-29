import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const SITE_URL = "https://bhavya-barri-portfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectEntries = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [{ url: SITE_URL, lastModified: new Date() }, ...projectEntries];
}
