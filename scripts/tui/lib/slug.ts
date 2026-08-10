import { existsSync } from "node:fs";
import { join } from "node:path";
import { BLOG_DIR } from "./paths";

/** Turn a human title into a kebab-case slug. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** True if no file/folder post currently occupies this slug. */
export function isSlugAvailable(slug: string): boolean {
  const candidates = [
    `${slug}.md`,
    `${slug}.mdx`,
    join(slug, "index.md"),
    join(slug, "index.mdx"),
  ];
  return candidates.every((c) => !existsSync(join(BLOG_DIR, c)));
}
