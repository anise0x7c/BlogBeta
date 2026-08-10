import { confirm, input, select } from "@inquirer/prompts";
import { formatDate, parseDateInput, writeFrontmatter } from "../lib/frontmatter";
import { pickPost } from "../lib/ui";
import type { BlogFrontmatter, Post } from "../types";

type EditableField =
  | "title"
  | "description"
  | "tags"
  | "pubDate"
  | "updatedDate"
  | "draft";

/** Edit a single frontmatter field of a chosen post. */
export async function editFrontmatter(posts: Post[]): Promise<void> {
  const post = await pickPost(posts, "Edit which post?");
  const fm = post.frontmatter;

  const field = await select<EditableField>({
    message: "Field to edit:",
    choices: [
      { name: `title        · ${fm.title}`, value: "title" },
      {
        name: `description  · ${fm.description || "—"}`,
        value: "description",
      },
      {
        name: `tags         · ${fm.tags.join(", ") || "—"}`,
        value: "tags",
      },
      { name: `pubDate      · ${formatDate(fm.pubDate)}`, value: "pubDate" },
      {
        name: `updatedDate  · ${fm.updatedDate ? formatDate(fm.updatedDate) : "—"}`,
        value: "updatedDate",
      },
      { name: `draft        · ${fm.draft}`, value: "draft" },
    ],
  });

  const next: BlogFrontmatter = { ...fm };

  switch (field) {
    case "title":
      next.title = await input({ message: "title:", default: fm.title });
      break;
    case "description":
      next.description = await input({
        message: "description:",
        default: fm.description,
      });
      break;
    case "tags": {
      const raw = await input({
        message: "tags (comma-separated):",
        default: fm.tags.join(", "),
      });
      next.tags = raw.split(",").map((t) => t.trim()).filter(Boolean);
      break;
    }
    case "pubDate": {
      const v = await input({
        message: "pubDate (YYYY-MM-DD):",
        default: formatDate(fm.pubDate),
        validate: (x) => (parseDateInput(x) ? true : "Invalid date"),
      });
      next.pubDate = parseDateInput(v)!;
      break;
    }
    case "updatedDate": {
      const v = await input({
        message: "updatedDate (blank to clear):",
        default: fm.updatedDate ? formatDate(fm.updatedDate) : "",
        validate: (x) => (!x || parseDateInput(x) ? true : "Invalid date"),
      });
      next.updatedDate = v ? parseDateInput(v)! : undefined;
      break;
    }
    case "draft":
      next.draft = await confirm({ message: "draft?", default: fm.draft });
      break;
  }

  await writeFrontmatter(post.filePath, next);
  console.log(`\n  ✓ Updated ${post.slug}\n`);
}
