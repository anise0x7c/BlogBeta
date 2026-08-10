import { confirm } from "@inquirer/prompts";
import { writeFrontmatter } from "../lib/frontmatter";
import { pickPost } from "../lib/ui";
import type { Post } from "../types";

/** Flip the draft flag on a chosen post. */
export async function toggleDraft(posts: Post[]): Promise<void> {
  const post = await pickPost(posts, "Toggle draft for which post?");
  const nextDraft = !post.frontmatter.draft;

  const ok = await confirm({
    message: `Set draft = ${nextDraft} for "${post.frontmatter.title}"?`,
    default: true,
  });
  if (!ok) {
    console.log("\n  cancelled.\n");
    return;
  }

  await writeFrontmatter(post.filePath, { ...post.frontmatter, draft: nextDraft });
  console.log(`\n  ✓ ${post.slug}: draft = ${nextDraft}\n`);
}
