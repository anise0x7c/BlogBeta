/**
 * Frontmatter shape for the `blog` content collection.
 *
 * Mirrors the Zod schema in src/content.config.ts — keep in sync manually.
 * We deliberately avoid importing `astro:content` here so the TUI stays a
 * lightweight, standalone Node script (no Astro runtime / Vite needed).
 */
export interface BlogFrontmatter {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  draft: boolean;
  cover?: string;
  coverAlt?: string;
}

export interface Post {
  /** Display slug, e.g. "hello-world" or "post-with-cover". */
  slug: string;
  /** Absolute path to the Markdown/MDX source file. */
  filePath: string;
  /** True for the folder layout: src/content/blog/<slug>/index.md. */
  isFolder: boolean;
  frontmatter: BlogFrontmatter;
}
