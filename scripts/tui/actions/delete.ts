import { confirm } from "@inquirer/prompts";
import { rm } from "node:fs/promises";
import { dirname } from "node:path";
import { pickPost } from "../lib/ui";
import type { Post } from "../types";

/** Permanently delete a post (file, or its whole folder if folder layout). */
export async function deletePost(posts: Post[]): Promise<void> {
  const post = await pickPost(posts, "Delete which post?");

  const ok = await confirm({
    message: `Permanently delete "${post.frontmatter.title}"?\n  ${post.filePath}`,
    default: false,
  });
  if (!ok) {
    console.log("\n  cancelled.\n");
    return;
  }

  if (post.isFolder) {
    await rm(dirname(post.filePath), { recursive: true, force: true });
  } else {
    await rm(post.filePath, { force: true });
  }

  console.log(`\n  ✓ Deleted ${post.slug}\n`);
}
