---
title: A Post With a Cover Image
description: 带有封面的推文卡片，把模糊封面作为卡片背景，最喜欢的一集
pubDate: '2026-08-06'
tags:
  - meta
draft: false
cover: ./cover.jpg
---

## 结构
参考 Fuwari 通过文件夹实现，我觉得图片和文字放一起比较好，方便管理：
`src/content/blog/<slug>/index.md` + `cover.png`


## 优化
使用 Astro 的 `<Image>` 组件可以自动处理大小/画质压缩和 WebP 转化，还可以通过 eager load
来提升速度

## 踩坑
Firefox 在页面转换动画时会丢掉模糊效果，所以只能单独加一个 CSS 选择器
```css
.card-bg :global(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px);
  transform: scale(1.1);
}
```
把 blur 直接压到图片上，具体的原理参考这篇专门的 [踩坑日记](./firefox-vt-bug-with-backdrop-blur/)
