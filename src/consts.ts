// Central place for site-wide, editor-editable constants.

export const SITE_TITLE = "Almanac";
export const SITE_DESCRIPTION =
  "A personal corner of the internet — notes, writing, and small experiments.";

export const SITE_AUTHOR = "Anise";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blog" },
] as const;

export const SOCIAL_LINKS = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://x.com", label: "Twitter" },
] as const;

// Sort posts by this frontmatter field, descending.
export const POSTS_PER_PAGE = 10;
