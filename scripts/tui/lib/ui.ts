import { select } from "@inquirer/prompts";
import type { Post } from "../types";
import { formatDate } from "./frontmatter";

/** Compact one-line label for selection lists. */
export function formatPostLabel(post: Post): string {
  const flag = post.frontmatter.draft ? "[draft] " : "        ";
  const date = formatDate(post.frontmatter.pubDate);
  const tags = post.frontmatter.tags.length
    ? `  #${post.frontmatter.tags.join(" #")}`
    : "";
  return `${flag}${date}  ${post.slug}${tags}`;
}

/** Prompt the user to pick a post from a list. */
export async function pickPost(
  posts: Post[],
  message = "Select a post",
): Promise<Post> {
  if (posts.length === 0) {
    throw new Error("No posts found in src/content/blog.");
  }
  return select({
    message,
    choices: posts.map((p) => ({ name: formatPostLabel(p), value: p })),
    pageSize: 15,
  });
}
