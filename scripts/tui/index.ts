import { select } from "@inquirer/prompts";
import { createPost } from "./actions/create";
import { deletePost } from "./actions/delete";
import { editFrontmatter } from "./actions/edit";
import { listPosts } from "./actions/list";
import { openEditor } from "./actions/open-editor";
import { toggleDraft } from "./actions/toggle-draft";
import { getPosts } from "./lib/posts";

type Action = "list" | "create" | "edit" | "toggle" | "editor" | "delete" | "exit";

const BANNER = `
  ┌──────────────────────────────────────────┐
  │   80ml Spice Jar · Post Manager          │
  └──────────────────────────────────────────┘`;

async function run(): Promise<void> {
  console.log(BANNER);

  while (true) {
    const action = await select<Action>({
      message: "What do you want to do?",
      choices: [
        { name: "List posts", value: "list" },
        { name: "Create post", value: "create" },
        { name: "Edit frontmatter", value: "edit" },
        { name: "Toggle draft", value: "toggle" },
        { name: "Open in $EDITOR", value: "editor" },
        { name: "Delete post", value: "delete" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (action === "exit") {
      console.log("\n  bye.\n");
      break;
    }

    try {
      const posts = await getPosts();
      switch (action) {
        case "list":
          listPosts(posts);
          break;
        case "create":
          await createPost();
          break;
        case "edit":
          await editFrontmatter(posts);
          break;
        case "toggle":
          await toggleDraft(posts);
          break;
        case "editor":
          await openEditor(posts);
          break;
        case "delete":
          await deletePost(posts);
          break;
      }
    } catch (err) {
      console.error(`\n  ✗ ${(err as Error).message}\n`);
    }
  }
}

run().catch((err) => {
  // Ctrl+C / Ctrl+D inside a prompt → @inquirer/prompts ExitPromptError.
  if (err && typeof err === "object" && err.name === "ExitPromptError") {
    console.log("\n  aborted.\n");
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
