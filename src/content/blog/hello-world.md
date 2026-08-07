---
title: "Hello, World"
description: "The obligatory first post — what this blog is and why it exists."
pubDate: 2026-08-01
tags: ["meta", "writing"]
draft: false
---

Welcome to the very first post on this freshly built corner of the internet.

This site is a small experiment in writing more in public. I plan to use it
for engineering notes, half-formed ideas, and the occasional deep dive that
doesn't fit in a single chat message.

## Why a personal site?

Social platforms come and go; this domain is mine. A static site means the
words stay legible for years without a database to maintain or a migration to
perform. The whole thing is built with [Astro](https://astro.build), rendered
to plain HTML at build time, and served as fast as the network allows.

## What's under the hood

- **Astro 7** content collections for type-safe Markdown authoring
- **Svelte 5** islands where a sprinkle of interactivity is needed
- **Tailwind v4** with a semantic token system so light/dark theming is a
  variable swap, not a class audit

Here's a tiny code sample to prove the syntax highlighting works:

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

That's all for now. More soon.
