import fs from "fs";
import path from "path";

export function getProjectContent(slug: string): string | null {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "projects",
    `${slug}.md`
  );
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
