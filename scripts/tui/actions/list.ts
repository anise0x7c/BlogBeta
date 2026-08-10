import type { Post } from "../types";
import { formatDate } from "../lib/frontmatter";

/** Print a readable summary of all posts to the terminal. */
export function listPosts(posts: Post[]): void {
  if (posts.length === 0) {
    console.log("\n  (no posts yet — create one!)\n");
    return;
  }

  console.log("");
  for (const p of posts) {
    const flag = p.frontmatter.draft ? "DRAFT " : "      ";
    const date = formatDate(p.frontmatter.pubDate);
    const tags = p.frontmatter.tags.length
      ? `  · ${p.frontmatter.tags.join(", ")}`
      : "";
    const folder = p.isFolder ? " (folder)" : "";
    console.log(`  ${flag}${date}  ${p.slug}${folder}`);
    console.log(`           "${p.frontmatter.title}"${tags}`);
  }
  console.log(`\n  ${posts.length} post(s) total.\n`);
}
