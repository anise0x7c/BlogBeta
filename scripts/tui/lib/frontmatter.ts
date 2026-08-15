import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";
import type { BlogFrontmatter } from "../types";

/** Format a Date as the bare YYYY-MM-DD style used by existing posts. */
export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD string into a Date (local time) or null if invalid. */
export function parseDateInput(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.valueOf()) ? null : d;
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.valueOf()) ? undefined : value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.valueOf()) ? undefined : d;
  }
  return undefined;
}

/** Coerce a loosely-typed gray-matter `data` object into BlogFrontmatter. */
export function normalizeFrontmatter(raw: Record<string, unknown>): BlogFrontmatter {
  return {
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    pubDate: toDate(raw.pubDate) ?? new Date(),
    updatedDate: toDate(raw.updatedDate),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    draft: Boolean(raw.draft),
    cover: raw.cover != null ? String(raw.cover) : undefined,
  };
}

/** Serialise frontmatter into a YAML-safe object (dates -> YYYY-MM-DD). */
function toSerialisable(fm: BlogFrontmatter): Record<string, unknown> {
  const data: Record<string, unknown> = {
    title: fm.title,
    description: fm.description,
    pubDate: formatDate(fm.pubDate),
    tags: fm.tags,
    draft: fm.draft,
  };
  if (fm.updatedDate) data.updatedDate = formatDate(fm.updatedDate);
  if (fm.cover) data.cover = fm.cover;
  return data;
}

/** Frontmatter keys managed by this tool (mirror of content.config.ts). */
const KNOWN_KEYS = [
  "title",
  "description",
  "pubDate",
  "updatedDate",
  "tags",
  "draft",
  "cover",
] as const;

/**
 * Render a full Markdown file string from frontmatter + body.
 *
 * Note: gray-matter delegates to js-yaml's default dumper, so dates are
 * emitted quoted (`'2026-08-01'`) and long scalars may fold. Both are valid
 * YAML and round-trip identically through Astro's content layer.
 */
export function renderFile(fm: BlogFrontmatter, body: string): string {
  return matter.stringify(body, toSerialisable(fm));
}

/**
 * Rewrite only the known frontmatter fields of a file.
 * - The body is preserved byte-for-byte.
 * - Unknown frontmatter keys (anything outside the schema) are preserved.
 * - Nullable fields (updatedDate/cover) are removed when unset.
 */
export async function writeFrontmatter(
  filePath: string,
  fm: BlogFrontmatter,
): Promise<void> {
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  const original = parsed.data as Record<string, unknown>;

  const merged: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(original)) {
    if (!(KNOWN_KEYS as readonly string[]).includes(key)) merged[key] = value;
  }
  Object.assign(merged, toSerialisable(fm));

  await writeFile(
    filePath,
    matter.stringify(parsed.content, merged),
    "utf8",
  );
}
