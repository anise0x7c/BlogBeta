---
title: A Post With a Cover Image
description: >-
  A quick demo of co-located cover images — the folder layout keeps the cover
  right next to the post it belongs to.
pubDate: '2026-08-06'
tags:
  - meta
draft: false
cover: ./cover.png
coverAlt: A warm gradient cover image in the site's accent colours.
---

This post lives in a folder together with its cover image, demonstrating the
`src/content/blog/<slug>/index.md` + `cover.png` layout.

The cover is referenced in frontmatter as `cover: "./cover.png"`, relative to
this file. Astro resolves it with the `image()` schema helper and hands the
optimized result to the `<Image>` component — automatic resizing and modern
formats, no manual `<img>` sizing.

Plain flat files keep working too: a post without a `cover` field simply
renders without an image, both in the card grid and on its own page.
