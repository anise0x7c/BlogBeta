import { openInEditor } from "../lib/editor";
import { pickPost } from "../lib/ui";
import type { Post } from "../types";

/** Open a chosen post's source file in $EDITOR. */
export async function openEditor(posts: Post[]): Promise<void> {
  const post = await pickPost(posts, "Open which post?");
  await openInEditor(post.filePath);
}
