# 美术风格指南 · 手账拟物风 (Journal Skeuomorphic)

> 本文件是站点的**美术单一真相源 (single source of truth)**。第 1–6 章讲「为什么与怎么想」，第 7 章给出可直接粘贴进 `src/styles/global.css` 的 CSS 落地块。任何视觉改动都应先回到本指南核对。

---

## 1. 风格概览与关键词

### 一句话定位
把网站做成一本**摊开的彩色手账本**：奶油色纸张、层层叠叠的便签卡片、和纸胶带、手写体批注、圆滚滚的可爱元素——干净、温暖、有呼吸感，又带着真实的纸面层次。

### 关键词

| 关键词 | 在本风格中的含义 |
| --- | --- |
| **拟物 Skeuomorphic** | 纸张、胶带、阴影、折角等真实物件隐喻，元素像物理卡片一样有重量 |
| **手账 / 笔记 Journal** | 奶油纸面、点阵/横纹背景、虚线分割、页边距感、贴纸标签 |
| **卡片 Card** | 卡片是原子单位；多层卡片错落叠放构成「剪贴簿」感 |
| **层次感 Depth** | 多级暖色阴影 + 元素重叠 + 微旋转，营造 z 轴纵深 |
| **手写 Handwritten** | 手写体仅用于点睛（标题装饰、日期、标签批注），正文不用 |
| **多彩 Colorful** | 一组柔和却鲜明的「贴纸色」做强调与分类，不喧宾夺主 |
| **清新 Fresh** | 大量留白、低饱和底色、通透感，避免厚重沉闷 |
| **可爱 Cute** | 大圆角、圆润字形、友好形状、克制的俏皮（微旋转/弹簧动效） |
| **圆角 Rounded** | 圆角刻度整体偏大，越重要的容器越圆 |

### 设计理念三原则
1. **纸感优先**：背景是「纸」而非「屏」。所有阴影偏暖棕色（不是纯黑），让画面像被暖光照着。
2. **克制的俏皮**：手写体与大圆角提供可爱感，但**只用在点睛处**；正文保持清爽可读，避免「幼稚化」。
3. **多彩但有秩序**：一个主强调色（草莓粉）统领交互，其余贴纸色用于**分类与点缀**，绝不平均用力。

---

## 2. 色彩系统（语义 token）

### 2.1 命名约定
沿用现有架构：`:root` / `.dark` 放**原始色值**，`@theme inline` 别名成 `--color-*` 供 Tailwind 工具类消费。组件**只引用语义名**，绝不碰原始值。

### 2.2 明色板（Light · 奶油纸）
> 底色是带暖度的奶油白（不是冷灰），墨色是暖棕黑（不是纯黑）——这是「纸感 vs 屏感」的关键。

| Token (`:root`) | 值 | 语义 | 用途 |
| --- | --- | --- | --- |
| `--canvas` | `#FAF5EC` | 纸面 / 页面底色 | `<body>` 背景 |
| `--surface` | `#FFFFFF` | 卡片面 | 卡片、浮层、便签 |
| `--surface-2` | `#F3ECE0` | 内陷面 / 凹槽 | 代码块底、嵌套区、输入框 |
| `--surface-hover` | `#F6F0E5` | 卡片悬停 | 列表项 hover |
| `--text` | `#322B23` | 主墨色 | 正文、标题 |
| `--text-muted` | `#6A5F52` | 次墨色 | 描述、次要文字 |
| `--text-subtle` | `#A89B8B` | 弱墨色 | 日期、占位、元信息 |
| `--accent` | `#FF6B8D` | 主强调（草莓粉） | 链接、主按钮、焦点 |
| `--accent-strong` | `#F24E73` | 强调悬停 | 主按钮 hover |
| `--accent-contrast` | `#FFFFFF` | 强调上的前景 | 主按钮文字 |
| `--accent-soft` | `rgba(255,107,141,0.14)` | 强调淡底 | 标签 chip、高亮块 |
| `--border` | `#EADFCB` | 纸边 | 卡片描边、分割线 |
| `--border-strong` | `#D8C9AE` | 强纸边 | 强调分隔、hover 描边 |

### 2.3 暗色板（Dark · 夜读牛皮）
> 页面底色取近黑（`#121212`），但卡片、墨色、纸边仍保留暖棕调——黑底暖纸，像夜里摊开的深色牛皮手账。强调色提亮以保证对比度。

| Token (`.dark`) | 值 | 语义 |
| --- | --- | --- |
| `--canvas` | `#121212` | 夜纸面（近黑） |
| `--surface` | `#1E1A16` | 卡片面（抬起，暖纸） |
| `--surface-2` | `#171410` | 内陷面 |
| `--surface-hover` | `#2A231D` | 卡片悬停 |
| `--text` | `#F0E8DC` | 羊皮纸墨色 |
| `--text-muted` | `#B3A695` | 次墨色 |
| `--text-subtle` | `#847666` | 弱墨色 |
| `--accent` | `#FF8FAB` | 草莓粉（提亮） |
| `--accent-strong` | `#FFADC2` | 强调悬停 |
| `--accent-contrast` | `#3D1521` | 强调上的前景（深底） |
| `--accent-soft` | `rgba(255,143,171,0.16)` | 强调淡底 |
| `--border` | `#38302A` | 纸边 |
| `--border-strong` | `#4A3F37` | 强纸边 |

### 2.4 多彩贴纸色（Sticker palette · 跨主题）
> 用于分类标签、分类色点、贴纸点缀。明色板用**实色**，暗色板用**同色提亮 10–15%**（见落地块）。命名稳定，不随主题变。

| Token | 明色 | 暗色 | 名称 |
| --- | --- | --- | --- |
| `--c-mint` | `#34C9A3` | `#5FDDB6` | 薄荷 |
| `--c-sky` | `#4DA9E6` | `#74C0F0` | 晴空 |
| `--c-lemon` | `#F5C24B` | `#FFD27A` | 柠檬 |
| `--c-grape` | `#A982E8` | `#C2A4F2` | 葡萄 |
| `--c-peach` | `#FF9C73` | `#FFB595` | 蜜桃 |
| `--c-berry` | `#E85A8C` | `#F47FA6` | 莓红（次强调） |

### 2.5 配色用法规则
- **主强调 `--accent`**：承载所有「可交互/需引导」语义（链接、主按钮、当前激活、焦点环）。
- **贴纸色**：仅用于**信息分类**（不同标签用不同色）与**装饰点缀**（贴纸、彩点），**不可**用于主按钮或正文链接，以免抢戏。
- **对比度**：正文 `--text` on `--canvas` 明色 ≥ 9:1，暗色 ≥ 11:1，满足 AAA。`--text-subtle` 仅用于非关键元信息。
- **勿用纯黑纯白**：暗色不用 `#000`，明色卡片白可用纯白但纸面一律奶油色。

---

## 3. 字体与排版

### 3.1 字体栈（`@theme` 中定义）

| Token | 栈 | 用途 |
| --- | --- | --- |
| `--font-sans` | `"Nunito", "PingFang SC", "Noto Sans SC", system-ui, sans-serif` | 正文 / 界面（圆润无衬线） |
| `--font-display` | `"Caveat", "Ma Shan Zheng", cursive` | 手写点睛（标题装饰/日期/批注） |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | 代码 |

> 字体加载为后续步骤：通过 `<link>` 引入 Google Fonts（Nunito, Caveat）与中文手写（Ma Shan Zheng / ZCOOL KuaiLe）。在接入前，`system-ui` 作为兜底；手写体兜底为 `cursive`。

### 3.2 手写体用法（**克制**，违例即幼稚）
**用于**：hero 的 eyebrow、章节小标题、日期戳、标签批注、空状态的一句手写问候、贴纸说明。
**禁用于**：正文段落、长标题主体、按钮文字、导航、表格数据。
> 规则：单页手写体出现不超过 3–4 处，且永远是「装饰而非信息载体」。

### 3.3 字号刻度（1.2 模数）

| Token | 值 | 典型用途 |
| --- | --- | --- |
| `--text-xs` | `0.75rem` | 元信息、标签 |
| `--text-sm` | `0.875rem` | 次要文字、卡片 meta |
| `--text-base` | `1rem` | 正文 |
| `--text-lg` | `1.125rem` | 引导文字 |
| `--text-xl` | `1.375rem` | 卡片标题、h3 |
| `--text-2xl` | `1.75rem` | h2 |
| `--text-3xl` | `2.25rem` | 页面标题 |
| `--text-4xl` | `clamp(2rem, 5vw, 3rem)` | hero h1 |
| `--text-display` | `clamp(3rem, 8vw, 4.5rem)` | hero 装饰大字（可叠手写体） |

### 3.4 字重 / 行高
- 正文 `font-weight: 400`，行高 `1.7`；标题 `700–800`，行高 `1.2–1.3`、字距 `-0.01em ~ -0.03em`。
- 手写体 `font-weight: 600`，行高 `1.1`。
- 正文最大行宽 **≤ 44rem**（已有 `--container-prose`），守可读性。

---

## 4. 圆角、阴影与层次（拟物核心）

### 4.1 圆角刻度（整体偏大）

| Token | 值 | 用途 |
| --- | --- | --- |
| `--radius-sm` | `0.5rem` | 行内徽标、代码 inline |
| `--radius-md` | `0.9rem` | 按钮、输入框 |
| `--radius-lg` | `1.25rem` | 卡片、便签 |
| `--radius-xl` | `1.75rem` | hero / 特色大卡片 |
| `--radius-2xl` | `2.25rem` | 模态、超特色容器 |
| `--radius-pill` | `999px` | 标签 chip、胶囊按钮 |

### 4.2 阴影层次（暖棕色基底，非纯黑）
> 拟物的灵魂是**多层阴影**：一层柔光（大范围模糊）+ 一层接触（贴边锐利），让卡片像「轻轻搁在纸上」。

| Token | 明色值（暗色用 `rgba(0,0,0,.x)` 加深） | 层级 |
| --- | --- | --- |
| `--shadow-flat` | `0 1px 0 rgba(120,90,50,0.06)` | 平贴（分割/纸边） |
| `--shadow-sticky` | `0 2px 4px rgba(120,90,50,0.10), 0 1px 1px rgba(120,90,50,0.08)` | 便签（轻浮起） |
| `--shadow-card` | `0 4px 12px rgba(120,90,50,0.10), 0 2px 4px rgba(120,90,50,0.08)` | 标准卡片 |
| `--shadow-float` | `0 12px 28px rgba(120,90,50,0.16), 0 4px 8px rgba(120,90,50,0.10)` | 悬浮/悬停态 |
| `--shadow-press` | `inset 0 1px 3px rgba(120,90,50,0.14)` | 按下/内陷 |

### 4.3 纸张与胶带质感（拟物细节）
- **点阵纸背景**：`--canvas` 上叠加极低透明度点阵（`radial-gradient` 圆点，间距 `1.25rem`，颜色 `--text` @ 4%），营造笔记本纸。
- **和纸胶带 (washi tape)**：特色卡片左/右上角用 `::before` 画一段 6–8rem 宽、1rem 高的半透明贴纸色条带，旋转 `-4° ~ 4°`，`opacity: 0.7`，边缘可加轻微锯齿（`mask` 或 `clip-path` 内凹三角）。
- **折角**：featured 卡片右下角用 `clip-path` 或双层 `::after` 做小三角折角，露出 `--surface-2`。
- **缝线/虚线分隔**：列表分隔、TOC 边线优先用 `border-style: dashed` + `--border`，呼应笔记本分隔线。
- **卡片微旋转**：在「剪贴簿」式区块（如首页 recent posts 的第一张）允许 `transform: rotate(-0.8deg ~ 1.2deg)`，制造手贴感；**正文区/表格不旋转**。

---

## 5. 布局与组件

### 5.1 布局原则
- 容器宽度复用既有 token：`--container-page 72rem` / `--container-article 64rem` / `--container-prose 44rem`。
- 卡片是**原子单位**：信息块优先包成卡片（白底 + `--shadow-card` + `--radius-lg` + `1.25–1.5rem` 内边距 + `--border`）。
- 层次叠放：featured 区可用 2–3 张卡片**错位重叠**（负 margin + 不同阴影层级 + 微旋转）做剪贴簿。
- 留白慷慨：区块垂直间距 `3–4rem`，卡片内边距 `1.25–1.5rem`。

### 5.2 组件清单与规格

| 组件 | 规格 |
| --- | --- |
| **卡片 Card** | `bg:--surface` · `border:1px --border` · `--radius-lg` · `--shadow-card` · hover→`--shadow-float`+`translateY(-2px)` |
| **便签 Sticky note** | 卡片变体；`--radius-md` 偏小、顶部贴和纸胶带、轻微旋转、用贴纸色作底 |
| **标签 Chip** | `--radius-pill` · `--accent-soft` 底 + `--accent` 字；分类标签按贴纸色着色（每类一色） |
| **按钮 Primary** | `--accent` 底 · `--accent-contrast` 字 · `--radius-md` · `--shadow-sticky` · hover `--accent-strong` · active `--shadow-press` |
| **按钮 Ghost** | 透明底 · `--border` 描边 · hover `--surface-hover` |
| **链接** | 正文链接 `--accent` + 下划线偏移 `0.15em` |
| **代码块** | `--surface-2` 底 · `--radius-lg` · `--shadow-flat` · `--font-mono` |
| **日期戳** | 手写体 `--font-display` + `--text-subtle`，呼应手账记日期 |
| **空状态** | 一句手写体问候 + 小贴纸插画位 |
| **TOC 侧栏** | `border-left: dashed --border`，激活项 `--accent` + 实线左条 |
| **顶栏 Header** | `position:sticky;top:0;z-index:50` · `bg:--canvas`（**实色不透明，非毛玻璃**） · `border-bottom:1px --border` · `--shadow-flat` · 内层 `max-width:--container-page`·`min-height:3.75rem`·两端对齐 `px-1.25rem py-0.75rem` · 品牌字 `--font-display`+`--accent` 标记 · 导航项 `--radius-md`·`--text-muted`·hover/active→`--text`+`--surface-hover` |
| **搜索框 Search** | 图标按钮触发（同 ThemeToggle 样式：`--radius-md`·`--border`·hover `--surface-hover`） · 点击弹出浮窗 `role="dialog"`：`bg:--surface`·`--radius-2xl`·`--shadow-float`·`max-width 36rem` · 内含输入框 `bg:--surface-2`（内陷面）·`--radius-md`·focus 环 `--accent-soft` + 实时结果列表 · 命中高亮 `<mark>` 用 `--accent-soft` 底 + `--accent-strong` 字 · 无结果 / 索引不可用（如 dev）有空态文案 · Esc / 背景点击关闭 · 打开时锁定 body 滚动 |

### 5.3 列表 / 网格
- 卡片网格沿用 `repeat(auto-fill, minmax(20rem,1fr))`。
- 纯文字列表用「横纹笔记本」感：每行底部 `border-bottom: 1px dashed --border`，行高足够像横线纸。

---

## 6. 动效

| Token / 场景 | 值 | 用途 |
| --- | --- | --- |
| `--ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | 平滑出场（已有） |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 卡片 hover / 弹入（俏皮回弹） |
| 卡片 hover | `transform: translateY(-2px) rotate(0)` + `--shadow-float`，时长 `0.2s --ease-bounce` | — |
| 主题切换 | `background/color 0.25s --ease-spring` | 已有，保持 |
| 进入动画 | 可选：卡片 `fade+translateY(8px)`，`0.4s --ease-spring`，错峰 `delay` | 视情况启用 |

> 动效一律尊重 `prefers-reduced-motion`：开启时禁用旋转与位移，仅保留颜色过渡。

---

## 7. 落地映射（可直接粘贴进 `global.css`）

> 以下块**替换**现有 `@theme`、`@theme inline`、`:root`、`.dark` 中对应部分。新增 token 已标注。字体与贴纸色通过 `@theme` 暴露给 Tailwind 工具类（如 `font-display`、`text-mint`）。

### 7.1 `@theme`（静态：字体 / 圆角 / 阴影 / 动效 / 容器）
```css
@theme {
  /* 字体 */
  --font-sans: "Nunito", "PingFang SC", "Noto Sans SC", system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji";
  --font-display: "Caveat", "Ma Shan Zheng", cursive;     /* 新增：手写体 */
  --font-mono: "JetBrains Mono", ui-monospace, "Fira Code", Menlo, monospace;

  /* 圆角（整体上调） */
  --radius-sm: 0.5rem;
  --radius-md: 0.9rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.75rem;
  --radius-2xl: 2.25rem;
  --radius-pill: 999px;                                    /* 新增 */

  /* 阴影层次（暖棕基底，拟物多层） */
  --shadow-flat:   0 1px 0 rgba(120, 90, 50, 0.06);
  --shadow-sticky: 0 2px 4px rgba(120, 90, 50, 0.10), 0 1px 1px rgba(120, 90, 50, 0.08);
  --shadow-card:   0 4px 12px rgba(120, 90, 50, 0.10), 0 2px 4px rgba(120, 90, 50, 0.08);
  --shadow-float:  0 12px 28px rgba(120, 90, 50, 0.16), 0 4px 8px rgba(120, 90, 50, 0.10);
  --shadow-press:  inset 0 1px 3px rgba(120, 90, 50, 0.14);

  /* 动效 */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);        /* 新增 */

  /* 容器宽度（沿用既有） */
  --container-page: 72rem;
  --container-article: 64rem;
  --container-prose: 44rem;
}
```

### 7.2 `@theme inline`（语义色别名 + 贴纸色）
```css
@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);     /* 新增 */
  --color-surface-hover: var(--surface-hover);

  --color-text: var(--text);
  --color-muted: var(--text-muted);
  --color-subtle: var(--text-subtle);

  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-contrast: var(--accent-contrast);
  --color-accent-soft: var(--accent-soft); /* 新增 */

  --color-border: var(--border);
  --color-border-strong: var(--border-strong);

  /* 贴纸色（新增，跨主题稳定名称） */
  --color-mint: var(--c-mint);
  --color-sky: var(--c-sky);
  --color-lemon: var(--c-lemon);
  --color-grape: var(--c-grape);
  --color-peach: var(--c-peach);
  --color-berry: var(--c-berry);
}
```

### 7.3 `:root`（明色 · 奶油纸）
```css
:root {
  --canvas: #FAF5EC;
  --surface: #FFFFFF;
  --surface-2: #F3ECE0;
  --surface-hover: #F6F0E5;

  --text: #322B23;
  --text-muted: #6A5F52;
  --text-subtle: #A89B8B;

  --accent: #FF6B8D;
  --accent-strong: #F24E73;
  --accent-contrast: #FFFFFF;
  --accent-soft: rgba(255, 107, 141, 0.14);

  --border: #EADFCB;
  --border-strong: #D8C9AE;

  --c-mint: #34C9A3;
  --c-sky: #4DA9E6;
  --c-lemon: #F5C24B;
  --c-grape: #A982E8;
  --c-peach: #FF9C73;
  --c-berry: #E85A8C;

  color-scheme: light;
}
```

### 7.4 `.dark`（暗色 · 夜读牛皮）
```css
.dark {
  --canvas: #121212;
  --surface: #1E1A16;
  --surface-2: #171410;
  --surface-hover: #2A231D;

  --text: #F0E8DC;
  --text-muted: #B3A695;
  --text-subtle: #847666;

  --accent: #FF8FAB;
  --accent-strong: #FFADC2;
  --accent-contrast: #3D1521;
  --accent-soft: rgba(255, 143, 171, 0.16);

  --border: #38302A;
  --border-strong: #4A3F37;

  /* 贴纸色暗色板（提亮 10–15%） */
  --c-mint: #5FDDB6;
  --c-sky: #74C0F0;
  --c-lemon: #FFD27A;
  --c-grape: #C2A4F2;
  --c-peach: #FFB595;
  --c-berry: #F47FA6;

  color-scheme: dark;
}
```

### 7.5 暗色阴影覆盖（暖棕在暗底会发灰，单独加深）
```css
.dark {
  --shadow-flat:   0 1px 0 rgba(0, 0, 0, 0.30);
  --shadow-sticky: 0 2px 4px rgba(0, 0, 0, 0.35), 0 1px 1px rgba(0, 0, 0, 0.30);
  --shadow-card:   0 4px 12px rgba(0, 0, 0, 0.40), 0 2px 4px rgba(0, 0, 0, 0.32);
  --shadow-float:  0 12px 28px rgba(0, 0, 0, 0.50), 0 4px 8px rgba(0, 0, 0, 0.36);
  --shadow-press:  inset 0 1px 3px rgba(0, 0, 0, 0.40);
}
```
