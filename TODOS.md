# 过渡动画系统审查报告
> 先说结论：整体架构是健康的，几个关键难点（脚本跨导航重绑、防 FOUC、reduced-motion、scroll 冲突）都处理对了，且我对照 Astro 7 源码和官方文档逐项验证过。但存在 1 个真实 bug、若干交互/文档问题。



## 架构现状
ClientRouter（SPA 路由）+ `<html transition:animate="none">`（关根动画）+ `<main transition:name="content">`（唯一动画组）+ before-swap 脚本按路径深度打 `data-nav="drill|back|sibling"` 标记 + 6 组 keyframes。`global.css:172-281`、`BaseLayout.astro:96-109`。



## 做对了的（已验证）
- transition:animate="none" 在 <html> 上的语义用法正确（官方文档确认，只关默认动画不影响具名组）
- html[data-astro-transition] 选择器在 Astro 7 仍有效（node_modules/astro/dist/transitions/router.js:29 确认 DIRECTION_ATTR 仍在）
- Header 主题切换、BlogPost TOC observer 都用 astro:page-load 重绑——这正是 VT 下脚本的正确姿势
- before-swap 预盖章 .dark 防“白闪”，比文档推荐的 after-swap 方案更强
- prefers-reduced-motion 用 animation: none !important 压制所有 VT 变体，正确



## 问题清单

### 真实 bug
- [x] 尾斜杠破坏深度分类 — BaseLayout.astro:89-94

### 设计缺陷 / 交互问题
- [x] PostCard hover 打架 .lift — PostCard.astro:56-60 vs global.css:45-58
.card:hover 的 rotate(-1deg) scale(1.06)（无层 scoped 样式，特异度碾压 utilities 层）完全覆盖了 .lift 的 translateY(-3px)，且 .lift 的 :active 按压反馈也被 hover 规则永久压制。卡片永远“不抬起、无按压”，与 ThemedButton 行为不一致。
- [ ] 主题切换“同步过渡”名不副实 — global.css:324-336
注释声称全体元素 0.4s 同步变色，但任何自带 transition 的元素都不同步：TOC 链接 0.2s（BlogPost.astro:258）、.lift 颜色 0.25s、Footer 0.2s（Footer.astro:67）。主题切换时是 0.2/0.25/0.4s 三速混跑。
- [ ] 格纹纸背景在主题切换时“格线瞬变” — global.css:307-316
网格线用 color-mix(var(--color-text) 5%) 画在 background-image 里，不可过渡且 --color-text 瞬间翻转 → 底色渐变 0.4s 期间格线已变色，短暂色调不匹配。
- [ ] drill/back 有 0.3s 空白期 — global.css:243,251,259
新页统一 delay 0.3s + both：旧页滑出后主区域有约 0.3s 只剩素色画布，整段过渡 0.8s 内 VT overlay 阻断交互。“旧走新来”的编排是有意的（artdesign.md §6.1），但节奏偏拖，可考虑缩短 delay 或改为轻微重叠。

### 边缘 / 卫生
- [ ] reduced-motion 只覆盖 VT：scroll-behavior: smooth、.lift 的 bounce 弹跳（cubic-bezier(0.5, 1.56, …) 会过冲）对减少动效用户仍然生效。颜色过渡保留是文档明示的设计（artdesign.md:206），但平滑滚动和弹跳未提及。
- [ ] 无 VT API 的旧浏览器：自定义动画全部挂在 ::view-transition-* 伪元素上，ClientRouter 的 fallback="animate" 模拟模式跑不了这些 keyframes → 旧 Safari/Firefox 退化为默认淡入淡出。属可接受的优雅降级，但与 artdesign.md 的“方向感知”承诺不符。
- [ ] data-nav 不清理：过渡结束后残留在 <html> 上。无 CSS 在 VT 外引用它，纯卫生问题。
- [x] 文档漂移：artdesign.md:190 写主题切换 0.25s，代码是 0.4s（global.css:333）。

___
Reduce Motion 一劳永逸管理方案
先定义“一劳永逸”的标准：① 现有动画全覆盖 ② 未来新增代码无法绕过（或有契约约束）③ 有文档可循。单靠一个全局 reset 做不到三者兼得——尤其你们 artdesign.md:206 明确写了“颜色过渡仍保留”，这排除了无差别 blanket reset 的路线。我建议分层防御体系。
现状盘点
动效	位置	reduce 下现状
页面过渡 keyframes	global.css:264-269	✅ 已覆盖
Astro 自带 fallback 动画	ClientRouter 内置	✅ 框架自理
scroll-behavior: smooth	global.css:290	❌ 仍平滑滚动
.lift 变换过渡（含 PostCard 倾斜缩放的节奏）	global.css:45-58	❌ 仍弹跳
颜色过渡（* 规则、TOC、Footer）	多处	按设计文档有意保留 ✅
未来新增动效	—	⚠️ 无任何约束
关键洞察：这个项目的动效架构其实已经天然分层——颜色系统由 * 通用规则承载（安全，保留），运动系统由 .lift 承载（需守卫）。守卫只需打在正确的层上。
方案：四层防御
Layer 1 — 定义点守卫（改 global.css，3 处）
a. .lift 工具类自带 reduce 守卫——所有消费者（ThemedButton、PostCard）自动继承：
@utility lift {
  transition:
    transform 0.4s var(--ease-bounce),
    /* ...现有列表不变 */
  @variant hover { transform: translateY(-3px); }
  @variant active { transform: translateY(0); }

  /* reduce：剔除运动属性，保留颜色/阴影（符合设计文档意图） */
  @variant motion-reduce {
    transition:
      box-shadow 0.4s var(--ease-bounce),
      border-color 0.25s var(--ease-spring),
      background-color 0.25s var(--ease-spring),
      color 0.25s var(--ease-spring);
  }
}
Tailwind v4 内置 motion-reduce variant，写在 @utility 里语义自包含。（若与 PostCard 方案 B 合并，则剔除的是 translate/rotate/scale。）
b. 平滑滚动改为“opt-in”模式——motion 规则住进 no-preference 查询，而不是事后打补丁：
@layer base {
  @media (prefers-reduced-motion: no-preference) {
    html { scroll-behavior: smooth; }
  }
}
c. hover 状态本身保留——reduce 下 translateY/rotate 瞬时应用而非动画。瞬时状态切换不是前庭触发源，且保住了交互反馈（这是可选项，见下面问题 2）。
Layer 2 — 全局兜底（新增 1 处）
只兜 keyframes 动画，不碰 transition（否则会杀掉有意保留的颜色过渡）：
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after,
  ::backdrop {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
未来任何人加 keyframes 动画（入场、装饰、loading）都被自动压制，漏不掉。0.01ms 而非 0 是为了 animationend 事件仍触发，不破坏依赖它的 JS。
Layer 3 — JS 契约（只写文档，当前无 JS 动画）
artdesign.md §6 新增小节，约定：
- 运动（位移/旋转/缩放）过渡必须经由 .lift 或带同款守卫的 motion 工具类，禁止散落裸写
- 新增 JS/Svelte 动画必须检查 matchMedia("(prefers-reduced-motion: reduce)")
- 无限循环动画需提供静态降级（兜底层会把迭代压到 1 次）
Layer 4 — 验证流程
1. Firefox about:config → ui.prefersReducedMotion = 1（上一轮讨论的方法）
2. 检查清单：页面导航瞬切 / TOC 锚点瞬跳 / 卡片 hover 无弹跳动画 / 主题切换颜色渐变仍在
3. pnpm astro check + 双模式（0/-1）各过一遍
改动汇总
全部集中在 global.css（2 处修改 + 1 处新增）+ docs/artdesign.md（新增小节）。约 30 行。