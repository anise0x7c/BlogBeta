import { spawn } from "node:child_process";

/**
 * Open a file in the user's preferred editor ($EDITOR / $VISUAL / vi).
 * Inherits stdio so the editor owns the terminal until it exits.
 */
export function openInEditor(filePath: string): Promise<void> {
  const cmd = (process.env.EDITOR || process.env.VISUAL || "vi").trim();
  const parts = cmd.split(/\s+/).filter(Boolean);
  const bin = parts[0] ?? "vi";
  const args = [...parts.slice(1), filePath];

  return new Promise<void>((resolve, reject) => {
    const child = spawn(bin, args, { stdio: "inherit" });
    child.on("error", () => reject(new Error(`Failed to launch editor: ${bin}`)));
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${bin} exited with code ${code}`));
    });
  });
}
