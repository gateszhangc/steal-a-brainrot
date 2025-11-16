# 实施计划

> 本实施计划覆盖 `.kiro/specs/homepage-optimization/requirements.md` 中的 R1–R12，目标在两轮迭代内交付新的首页体验。

## 阶段 0：数据与配置铺底
- [ ] 0.1 生成 `data/homepage-optimization/stats.json`
  - rating、votes、plays、developer、releaseDate、technology、categories。
  - _对应 R5, R12_
- [ ] 0.2 生成 `data/homepage-optimization/recommended.json`
  - 12 条卡片（name、slug、thumbnail 占位、category）。
  - _对应 R4, R12_
- [ ] 0.3 生成 `data/homepage-optimization/content.mdx`
  - `what-is` 至 CTA 的全部段落、表格、列表；插入组件占位符。
  - _对应 R6, R7, R12_
- [ ] 0.4 生成 `data/homepage-optimization/faq.json`
  - 5 个问答；include `cta` 对象。
  - _对应 R7, R12_
- [ ] 0.5 更新 `data/site-config.json`
  - Header 导航、Footer 链接、logo 文案、搜索 placeholder。
  - _对应 R1, R2, R9_
- [ ] 0.6 编写 `lib/homepage/getHomepageData.ts`
  - 读取以上文件，定义 `HomepageData` TypeScript 类型，暴露 `getHomepageData()`。
  - _对应 R12_

## 阶段 1：静态结构与样式
- [ ] 1.1 建立基础布局 (`app/page.tsx` + `components/layout/MainContainer.tsx`)
  - 设置 1400px 容器、深色背景、通用 Card 样式。
  - _对应 R1_
- [ ] 1.2 Header + Search + MobileMenu
  - 创建 `components/header/Header.tsx`、`DesktopNav.tsx`、`MobileMenu.tsx`、`SearchBar.tsx`。
  - 实现 sticky header、导航、搜索表单、移动菜单遮罩。
  - _对应 R2, R10_
- [ ] 1.3 GamePlayer + PlayerControls
  - 创建 `components/game/GamePlayer.tsx`、`PlayerControls.tsx`，加入 16:9 iframe、浮动控制条。
  - Buttons: `onScrollToComments`, `onToggleTheater`, `onToggleFullscreen`（留空实现）。
  - _对应 R3_
- [ ] 1.4 RecommendedRail + GameCard
  - 横向滚动、snap、hover 动画、自定义滚动条。
  - _对应 R4, R10_
- [ ] 1.5 GameInfoGrid
  - 响应式 Grid，标签 + 内容。
  - _对应 R5_
- [ ] 1.6 ContentSection + TableOfContents
  - MDX 渲染（`next-mdx-remote` 或 `mdx-bundler`），目录根据 heading 自动生成。
  - _对应 R6_
- [ ] 1.7 GameOverviewTable、HowToPlay、TipsList、CharactersTable、FAQList、Callout CTA
  - 子组件处理表格与列表的样式、移动端滚动、aria 属性。
  - _对应 R7_
- [ ] 1.8 Footer
  - Logo、链接、免责声明；响应式堆叠。
  - _对应 R9, R10_

## 阶段 2：交互与状态
- [ ] 2.1 Scroll/Hash 行为
  - `scrollToElement(id)` util；目录点击更新 hash。
  - Recommended 支持鼠标拖动（`pointerdown` + inertia，可选）。
  - _对应 R3, R4, R6, R10_
- [ ] 2.2 剧院模式状态
  - `useTheaterMode()` hook；在 Player 包裹容器切换 class；在按钮上显示当前状态。
  - _对应 R3, R10_
- [ ] 2.3 全屏控制
  - `useFullscreen(ref)` hook，处理浏览器兼容与 ESC 退出。
  - _对应 R3_
- [ ] 2.4 搜索回调
  - 提供 `onSearch(term)` 占位（console + toast），为后续 API 留出接口；校验空输入。
  - _对应 R2_

## 阶段 3：评论系统
- [ ] 3.1 API 路由 (`app/api/comments/route.ts`)
  - GET 支持分页，POST 校验 + 写入 Supabase。
  - _对应 R8_
- [ ] 3.2 Supabase SDK 封装 (`lib/comments.ts`)
  - `fetchComments`, `createComment`，集中异常处理与速率限制。
  - _对应 R8_
- [ ] 3.3 CommentsSection 组件
  - 表单验证、提交 loading、错误提示、成功提示、乐观更新。
  - “已有评论”列表 + “加载更多”分页。
  - _对应 R3, R8, R10_
- [ ] 3.4 将 GamePlayer 的“💬 评论”按钮连到 `scrollToComments`。
  - _对应 R3, R8_

## 阶段 4：SEO、可访问性、性能
- [ ] 4.1 `generateMetadata` + JSON-LD
  - Title/description/OG/Twitter/canonical；注入 WebSite/Game/FAQPage JSON-LD。
  - _对应 R11_
- [ ] 4.2 可访问性
  - 添加 aria-label、role、键盘焦点；对动效做 `prefers-reduced-motion`。
  - _对应 R10, R11_
- [ ] 4.3 性能与 QA
  - `next/image` 懒加载、iframe loading="lazy"、拆分组件 bundle。
  - 编写单元测试（TOC、GamePlayer、CommentsForm），运行 `npm run lint && npm run test`。
  - Lighthouse 桌面跑分 ≥ 85/95/95/95，记录截图。
  - _对应 成功标准_

## 交付清单
- 更新 `.kiro/specs/homepage-optimization/*`（本次已完成）。
- 代码改动：`app/page.tsx`、`components/*`、`lib/*`、`data/homepage-optimization/*`、`app/api/comments/*`、`app/layout.tsx`（meta）。
- 自测记录 & Lighthouse 截图。
