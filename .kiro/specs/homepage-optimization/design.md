# 设计文档

## 1. 概述
本设计将把批准的 `homepage-preview.html` 视觉稿落实到 Next.js 14 应用中。目标是：
- 维持 1:1 的布局/配色/文案，同时改造为组件化、数据驱动的实现。
- 减少 `dangerouslySetInnerHTML`，改用类型安全的数据模型 + React 组件。
- 引入必要的客户端交互（移动菜单、评论跳转、剧院/全屏、横向滚动）。
- 提升 SEO（meta、OG、JSON-LD）与可访问性。

## 2. 页面蓝图（参考 `homepage-preview.html`）
1. **Sticky Header**：Logo、导航、搜索、移动菜单按钮。
2. **Game Player**：16:9 iframe + 半透明控制条（评分 + 三个按钮）。
3. **Recommended Rail**：12 张卡片的横向滑轨，支持滚动/拖动。
4. **Game Info Grid**：6 个关键指标的响应式网格。
5. **Content Section**：目录卡片 + 多个章节（What is、Overview 表格、How to Play、Tips、Characters 表格、FAQs、CTA）。
6. **Comments**：表单 + 评论列表。
7. **Footer**：Logo、链接、免责声明。

## 3. 技术架构
### 3.1 渲染策略
- `app/page.tsx` 作为 Server Component，调用 `getHomepageData()` 读取 JSON/MDX 并把静态数据传给子组件。
- 与用户交互相关的组件（Header/MobileMenu、GamePlayer、CommentsSection）使用 Client Component。
- 评论列表通过 `useSWR` 或自定义 hook 打到 `/api/comments`，保持最新。

### 3.2 组件树
```
app/page.tsx (Server)
└── Homepage (Server)
    ├── Header (Client)
    │   ├── DesktopNav
    │   ├── SearchBar
    │   └── MobileMenu (Client)
    ├── Main (Server)
    │   ├── GamePlayer (Client)
    │   │   └── PlayerControls (Client)
    │   ├── RecommendedRail (Server -> Client cards)
    │   ├── GameInfoGrid (Server)
    │   ├── ContentSection (Server)
    │   │   ├── TableOfContents
    │   │   ├── GameOverviewTable
    │   │   ├── HowToPlay
    │   │   ├── TipsList
    │   │   ├── CharactersTable
    │   │   └── FAQList
    │   └── CommentsSection (Client)
    └── Footer (Server)
```

### 3.3 数据流
- `lib/homepage/getHomepageData.ts`：读取 `data/homepage-optimization/summary.json`、`recommended.json`、`content.mdx`、`faq.json` 等，合并为 `HomepageData`。
- `HomepageData` 通过 props 下发到 Server Components；Client Components 取需要的切片。
- 评论：`CommentsSection` 初始 prop 为 `initialComments`（SSR），挂载后调用 `/api/comments?limit=10` 以 SWR 方式刷新。

### 3.4 样式策略
- Tailwind CSS 作为主要样式（配置主题色、字体、阴影、max-width）。
- 对特殊组件（比如横向滑轨、自定义滚动条）可补充 CSS Modules 或 `@layer components`。
- 统一 spacing（`px-8`, `py-4` 等），封装 `card`/`pill` 工具类。

### 3.5 状态管理
- Header：`useState<boolean>` 控制移动菜单，`useLockBodyScroll` 自定义 hook 防止底层滚动。
- GamePlayer：`theaterMode` 布尔值 + `handleFullscreen()`（使用 `requestFullscreen`/`exitFullscreen`）。
- Comments：`useForm` hook 处理输入、校验与 loading 状态。

## 4. 组件规格
### 4.1 Header
```ts
interface HeaderProps {
  nav: NavigationLink[];
  searchPlaceholder: string;
}
```
- 桌面：Flex 布局，Logo/导航/搜索/按钮；滚动时保持 sticky。
- 移动菜单：`<dialog>` 或自定义 `<aside>`，含列表与关闭按钮，点击遮罩/ESC 关闭。
- 搜索：`<form role="search">`，提交后触发 `onSearch(term)`（暂时只在控制台打印，预留 API）。

### 4.2 GamePlayer
```ts
interface GamePlayerProps {
  embedUrl: string;
  rating: number;
  votes: number;
}
```
- iframe 使用 `loading="lazy"`，提供 `title="Play Steal A Brainrot"`。
- 控制条按钮列表：`[{id:'comments', label:'💬 评论', onClick:scrollToComments}, ...]`。
- 剧院模式通过在父容器添加 `className={isTheater ? 'theater' : ''}` 切换高度/阴影。
- 全屏流程：若 iframe 支持，调用其 `requestFullscreen()`；否则对父容器执行。

### 4.3 RecommendedRail
```ts
interface RecommendedGame {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
}
```
- 容器 `overflow-x-auto snap-x`，卡片 `snap-start`，hover/active 使用 `translate-y-2`。
- 自定义滚动条：在 `globals.css` 中添加 `::-webkit-scrollbar` 样式。

### 4.4 GameInfoGrid
- 接收 `GameStats` 对象并映射为 `InfoCard`。
- 使用 CSS Grid + `minmax(220px,1fr)`，移动端自动堆叠。

### 4.5 ContentSection
- `content.mdx` 中维护段落和表格，MDX 中插入 `GameOverviewTable`, `CharactersTable` 等组件以保持语义。
- TableOfContents 根据 `content.headings` 自动生成锚点；点击后调用 `scrollIntoView({behavior:'smooth'})` 并用 `history.pushState` 更新 hash。
- CharactersTable 增加 `<caption>` 描述，移动端 `overflow-x-auto`。

### 4.6 FAQ 与 CTA
- FAQ 组件输出 `<dl>` 或 `<section>` + `schema.org/FAQPage` JSON-LD。
- CTA 区域沿用 content 数据，封装 `Callout` 组件（绿色边框 + 内边距）。

### 4.7 CommentsSection
```ts
interface CommentsSectionProps {
  initialComments: Comment[];
}
interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}
```
- 表单字段：`name`, `email`, `body`，使用 `react-hook-form` 或自建验证。
- `onSubmit`: POST `/api/comments`，body 为 `{name,email,body}`；成功后把返回的 comment prepend 到列表。
- 评论列表可无限加载（“加载更多”按钮，分页参数 `cursor`）。

### 4.8 Footer
- 数据来自 `site-config.json`。
- 布局：`grid grid-cols-[auto,1fr]`（桌面），移动端改为 `flex-col`。

## 5. 数据模型
```ts
export interface HomepageData {
  hero: {
    embedUrl: string;
    rating: number;
    votes: number;
  };
  recommended: RecommendedGame[];
  stats: GameStats;
  content: MDXRemoteSerializeResult;
  toc: TocItem[];
  faq: FAQItem[];
  footer: SiteFooter;
}
```
- `data/homepage-optimization/stats.json`：评分、播放次数、开发者等。
- `data/homepage-optimization/recommended.json`：12 个卡片（name/slug/thumbnail）。
- `data/homepage-optimization/content.mdx`：章节排版，嵌入组件。
- `data/homepage-optimization/faq.json`：问题/答案数组。
- `site-config.json`：导航、Footer 链接、社交等。

## 6. SEO & 可访问性
- `app/layout.tsx` 中 `generateMetadata()` 读取 `HomepageData` 并返回 title/description/OG/Twitter。
- 添加 JSON-LD：`WebSite`, `Game`, `FAQPage`（在 `<script type="application/ld+json">` 中输出）。
- 所有按钮/链接有 `aria-label`（例如“切换剧院模式”），`role="navigation"` 等语义。
- 目录链接/评论按钮支持键盘 focus ring；遵守 `prefers-reduced-motion`，在 CSS 中为动画添加 `@media (prefers-reduced-motion: reduce)`。

## 7. 性能与质量
- 使用 `next/image`（如有真实缩略图）并懒加载。
- 共享 `Card` 组件减少重复 CSS；Tailwind `@apply` 组合 token。
- 添加单元测试：
  - `components/__tests__/table-of-contents.test.tsx`: 确保渲染所有 anchor。
  - `components/__tests__/game-player.test.tsx`: 验证按钮回调。
- 运行 `npm run lint`、`npm run test` 作为 CI 阶段门槛。

## 8. 评论 API 设计
- `app/api/comments/route.ts`
  - `GET`: `limit`, `cursor` 查询 Supabase (`comments` 表) 返回 `{data,nextCursor}`。
  - `POST`: 校验输入、写入 Supabase、返回 created row。
  - 统一错误处理（400/429/500），防抖 3 秒。
- 在 `.env` 使用 `SUPABASE_SERVICE_ROLE_KEY` 等环境变量。

## 9. 开发阶段
1. **数据建模**：整理 JSON/MDX，编写 `getHomepageData`。
2. **静态结构实现**：Header、Player、Rail、Info、Content、Footer。
3. **交互强化**：移动菜单、TOC 滚动、评论按钮、剧院/全屏。
4. **评论系统**：API + 前端 Hook。
5. **SEO/性能/测试**：meta、JSON-LD、Lighthouse、自测。
6. **验收**：对比 `homepage-preview.html`，截图核验，跑 Lighthouse，准备交付。
