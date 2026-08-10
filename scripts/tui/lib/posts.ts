import { readdir, readFile, stat } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import matter from "gray-matter";
import type { Post } from "../types";
import { BLOG_DIR } from "./paths";
import { normalizeFrontmatter } from "./frontmatter";

function slugFromRel(rel: string): { slug: string; isFolder: boolean } {
  const norm = rel.split(/[\\/]/).join("/");
  const file = basename(norm);
  const stem = file.slice(0, file.length - extname(file).length);
  if (stem === "index") {
    return { slug: basename(dirname(norm)), isFolder: true };
  }
  return { slug: stem, isFolder: false };
}

/**
 * Discover every blog post under src/content/blog.
 * Throws a friendly error if the content directory does not exist.
 */
export async function getPosts(): Promise<Post[]> {
  try {
    await stat(BLOG_DIR);
  } catch {
    throw new Error(`Blog directory not found: ${BLOG_DIR}`);
  }

  const entries = await readdir(BLOG_DIR, { recursive: true });
  const posts: Post[] = [];

  for (const rel of entries) {
    const ext = extname(rel);
    if (ext !== ".md" && ext !== ".mdx") continue;

    const filePath = join(BLOG_DIR, rel);
    const { slug, isFolder } = slugFromRel(rel);
    const raw = await readFile(filePath, "utf8");
    const parsed = matter(raw);

    posts.push({
      slug,
      filePath,
      isFolder,
      frontmatter: normalizeFrontmatter(parsed.data as Record<string, unknown>),
    });
  }

  return posts.sort(
    (a, b) => b.frontmatter.pubDate.valueOf() - a.frontmatter.pubDate.valueOf(),
  );
}
