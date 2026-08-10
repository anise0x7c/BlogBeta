// Central place for site-wide, editor-editable constants.

export const SITE = {
  title: "80ml Spice Jar",
  description:
    "Personal Site/Blog 由于几乎 100% 由 AI 谁知道下一秒会不会爆炸呢 😉",
  author: "80CentsAnise",
} as const;

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
