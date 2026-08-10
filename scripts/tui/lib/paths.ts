import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// scripts/tui/lib/paths.ts is three levels below the project root.
const here = dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = resolve(here, "..", "..", "..");
export const BLOG_DIR = join(PROJECT_ROOT, "src", "content", "blog");
