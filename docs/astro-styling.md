# Astro 样式与 CSS 速查

> 参考来源：[Astro 官方 Styles and CSS 指南](https://docs.astro.build/en/guides/styling/)。本文档为本仓库的实际配置做了标注。

## 一、核心心智模型

| 机制 | 说明 |
| --- | --- |
| **`<style>` 默认 scoped** | `.astro` 组件里的 `<style>` 会自动加 `data-astro-cid-*` 属性，不泄漏、不影响其他组件/页面。因此可放心使用低特异性选择器（如 `h1 {}`、`p {}`）。它**不会**作用于子组件；要影响子组件需包一层 `<div>` 或用 `:global()`。 |
| **全局样式** | `<style is:global>` 全局；或在同一个 `<style>` 里用 `:global()` 做局部混合。官方建议：scoped 优先，全局按需使用。 |
| **外部样式** | 用 ESM import 写在组件 frontmatter **顶部**（`import '../styles/utils.css'`），路径相对当前组件；npm 包样式若不带扩展名需在 `vite.ssr.noExternal` 登记；`<link>` 只用于 `/public` 静态文件或外链（会跳过打包/优化）。 |
| **`class:list`** | `.astro` 专用的动态拼 class 属性，支持对象/数组。 |
| **`define:vars`** | 把 frontmatter 变量作为 CSS 变量注入 `<style>`。 |
| **传 class 给子组件** | `class` **不会自动透传**。子组件需 `const { class: className, ...rest } = Astro.props;` 并在根元素写 `class={className} {...rest}`（默认 scoped 策略下 `...rest` 用来携带 cid；若 `scopedStyleStrategy` 设为 `'class'`/`'where'` 则不需要）。 |

## 二、级联顺序（从低到高）

```
<link> 标签  <  导入的样式(import)  <  scoped 样式(最高)
```

- 同特异性时，**后导入的胜出**。
- 导入的 CSS 会“泄漏”：即使组件未被使用，只要被 import，其 CSS 就会生效。
- 常见模式：在**布局组件**里 import 全局 CSS，且放在其他 import 之前，使其优先级最低。

## 三、本仓库的配置对照

- **Tailwind v4 已正确接线**：`astro.config.mjs` 有 `@tailwindcss/vite` 插件；`src/styles/global.css` 为 `@import "tailwindcss";` —— 这是 v4 的标准做法（**无 `tailwind.config.js`**，主题用 CSS `@theme`）。
- **Svelte 组件**：本仓库的 Svelte 岛屿按 Svelte 原生方式写 `<style>` 即可，Astro 不干预。
- **⚠️ 生效前提**：Tailwind 的 CSS 必须在页面里被 import 才会生效。官方建议在布局组件里 import `global.css`，这样所有共享该布局的页面都能用 Tailwind 类。

## 四、生产打包

- CSS 按页分块 + 共享块；`< 4kB` 默认内联进 `<style>`。
- 调整内联阈值：`vite.build.assetsInlineLimit`（字节）。
- 强制全部外链/内联：`build.inlineStylesheets`（`'auto' | 'never' | 'always'`）。

## 五、预处理器 / PostCSS（按需）

- Sass/SCSS、Stylus、Less：安装对应包后用 `<style lang="scss">` 等；Svelte 组件内同理。
- PostCSS：在项目根放 `postcss.config.cjs`。
- LightningCSS：`vite.css.transformer = "lightningcss"`。

## 六、进阶（少用）

- `?raw` 导入：原样读取 CSS、跳过打包（`import x from './main.css?raw'` + `<style is:inline set:html={x}>`）。
- `?url` 导入：拿到 CSS 文件的 URL 引用，跳过合并优化。
