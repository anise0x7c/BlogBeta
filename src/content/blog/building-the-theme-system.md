---
title: "Building the Theme System"
description: "Notes on designing a semantic CSS token system that switches themes without a flash of unstyled content."
pubDate: 2026-08-05
tags: ["css", "astro", "frontend"]
draft: false
---

Good theming is mostly about indirection. Elements never talk to a raw color;
they talk to a *semantic name*, and the name resolves differently per theme.

## The indirection

Instead of this:

```css
.card {
  background: #ffffff;
}
.dark .card {
  background: #161618;
}
```

You do this:

```css
:root {
  --surface: #ffffff;
}
.dark {
  --surface: #161618;
}
.card {
  background: var(--surface);
}
```

Now the card markup is theme-agnostic. Swap the variables, the whole UI
follows.

## Tailwind v4

Tailwind v4's `@theme inline` directive lets you expose those variables as
first-class utilities (`bg-surface`) while keeping them *resolving* at the
use-site rather than baking in a static value. The result: a single class
like `bg-surface` works in both themes with zero `dark:` repetition.

## Avoiding the flash

A tiny inline script in `<head>` reads `localStorage` and stamps the
`.dark` class onto `<html>` **before the first paint**, so there's never a
flash of the wrong theme on reload.

> The toggle button itself is a Svelte 5 island — interactivity only where
> it earns its place.

And that's the whole system. Small, boring, and easy to maintain.
