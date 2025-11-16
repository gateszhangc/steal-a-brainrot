# Requirements Document

## 背景
- `homepage-preview.html` 是新的 Steal Brainrot 首页高保真稿，已经过业务确认。页面涵盖布局、配色、文案和交互行为，等同于最终要交付的视觉效果。
- 现有的 Next.js 首页仍然使用 `data/home-body.html` 的旧内容，需要重建才能匹配新的稿件，并完全脱离 `steal-brainrot.io` 品牌。

## 成功标准
1. 在桌面和移动端上访问 `app/page.tsx` 时，看到的内容与 `homepage-preview.html` 在结构、配色、间距和文案上保持 1:1，对比差异不超过 2px/2pt。
2. 所有锚点、按钮和链接均可用（滚动、全屏、剧院模式、评论跳转、移动菜单）。
3. Lighthouse Performance ≥ 85、Accessibility ≥ 95、Best Practices ≥ 95、SEO ≥ 95（桌面模式）。
4. 项目中的 SEO/结构化数据、Footer 链接、域名、图标等全部使用 `stealabrainrot.quest` 信息。

## 范围
### 在范围内
- 使用 Next.js 14（App Router）重建首页 UI，包含 Header、Game Player、推荐滑轨、信息网格、长篇内容、评论区、Footer。
- 将游戏数据、推荐列表、富文本写入结构化 JSON/MDX（`data/` 目录）供组件消费。
- 为评论表单接入既有 Supabase API（`/api/comments`）。
- 更新页面 `<head>` 信息（title、meta、OG、JSON-LD、canonical）。

### 不在范围
- 变更其他独立页面（About/Privacy 等）的文案内容，除非 Footer 链接指向时发现 404。
- 修改评论服务的数据库结构（沿用既有表结构即可）。

## 功能需求
### R1. 视觉与品牌一致性
**User Story**: 作为访客，我希望立即识别 Steal Brainrot 品牌，并看到与预览稿完全一致的深色 UI。
- 背景色 `#0C0D14`，主要卡片 `#1A1B26`，辅助面板 `#2A2B36`，强调色 `#41E161`，字体使用 `Nunito`/系统字体堆栈。
- 页面最大宽度 1400px，左右保持 2rem 内边距，卡片圆角 12px，按钮圆角 6-8px。
- 全站不再出现 `steal-brainrot.io`，品牌名称统一为 `STEAL BRAINROT`，域名为 `stealabrainrot.quest`。

### R2. Header 与顶部导航
**User Story**: 作为访客，我需要一个固定在顶部的导航来查找其它游戏或搜索。
- Header 固定在顶部（sticky），背景 `#1A1B26`，阴影 `0 2px 10px rgba(0,0,0,0.3)`。
- 左侧 Logo 为绿色胶囊，文字 `STEAL BRAINROT`，点击返回首页。
- 桌面导航包含两个链接：`Steal Brainrot Online`、`67 Clicker`，hover 时字体颜色变为强调绿。
- 中间是搜索条：输入框 placeholder “Search games”，右侧按钮包含放大镜图标（emoji/图标均可），输入后回车或点击按钮触发搜索事件（先调用空的 onSearch 回调，后续接 API）。
- 右侧为汉堡按钮，≥768px 隐藏，移动端显示并可展开侧滑菜单（覆盖全屏，含遮罩和关闭按钮）。

### R3. 游戏播放器与控制条
**User Story**: 作为玩家，我希望在打开页面时立即看到可交互的游戏 iframe 和控制按钮。
- 主播放器占据 16:9 比例容器，默认加载 `https://stealabrainrot.quest/embed`（后续可配置），加载前显示 Emoji 占位符。
- 底部浮动控制条半透明（背景 `rgba(12,13,20,0.85)` + 模糊），左侧显示评分星星 `⭐⭐⭐⭐☆` 与数值 `4.2`；右侧按钮依次为“💬 评论”“🖥️ 剧院模式”“⛶ 全屏”。
- “💬 评论”触发平滑滚动到评论区；“剧院模式”在同一页面切换更高的 iframe 容器（72vh）并调整背景；“全屏”调用浏览器 Fullscreen API。
- 控制按钮有 hover 状态（亮度 +10%），支持键盘焦点。

### R4. 推荐游戏横向滑轨
**User Story**: 作为访客，我希望快速浏览其它热门 Brainrot 游戏。
- 推荐区标题为“🎮 推荐游戏”，内部为横向滚动容器，滚动条样式与预览一致（绿色拇指，高度 8px）。
- 至少渲染 12 张卡片，文案与顺序固定为：Steal Brainrot Online、Los Bros、Xlope、2v2.io、Plants vs Brainrots、Mr Flips、Growden.io、Ragdoll Playground、67 Clicker、Slope Rider、Stumble Guys、Merge Rot。
- 卡片尺寸 140×? px，含 100px 高缩略图占位，hover 时上移 8px 并显示绿色阴影。
- 点击卡片跳转到对应 slug（`/games/{slug}`），slug 在数据文件中维护。

### R5. 游戏信息网格
**User Story**: 作为访客，我需要一眼看到评分、玩法信息等关键事实。
- 信息网格显示 6 项：评分 `4.3 (609 votes)`、播放次数 `294,473`、开发者 `Brazilian Spyder`、发布日期 `May 16, 2025`、技术 `HTML5`、分类 `Roblox, Meme, Brainrot, Casual`。
- 网格在 ≥1024px 时至少 3 列，768px-1024px 显示 2 列，移动端 1 列。
- 标签标题（评分/播放次数等）使用强调绿色，数值使用 #fff。

### R6. 内容章节骨架与目录
**User Story**: 作为读者，我需要清晰的目录来跳转到内容块。
- 所有长篇内容放在带圆角的深色卡片中，顶部显示目录卡片（背景 #3B444E）。
- 目录标题 “📋 目录导航”，列表包含并按顺序锚定以下 ID：`#what-is`、`#overview`、`#how-to-play`、`#tips`、`#characters`、`#faq`。
- 点击目录项时需平滑滚动到对应标题，URL hash 更新。

### R7. 内容文案与数据化
**User Story**: 作为访客，我希望获得与预览稿一致的 Steal Brainrot 介绍、攻略和 FAQ。
1. **What is Steal A Brainrot?** 两段正文，逐字采用预览稿内容，强调 7 个稀有度 tier。
2. **Game Overview** 表格两列：左列标题（Developer、Release Date、Game rules and objects、Brainrots lineup、Idle Income、How to control、Visual graphics），右列填充对应描述/强调标签。
3. **How to Play and Collect Rewards…** 一段引言 + 3 个小节（`buy-first`, `get-funds`, `steal`）分别描述 Noobini Pizzanini、新资金循环、偷取机制，包含加粗提示。
4. **Bonus: 5 Pro Tips…** 有序列表 5 条，文案逐字一致。
5. **List of Brainrot characters…** 表格列：Character、Tier、Income Rate、Price；需要渲染 7 行（Noobini Pizzanini、Tim Chesse、Tung Tung Tung Sahur、Capuchino Assassino、Burbaloni Loliloli、Orangutini Ananassini、Tralalero Tralala）及对应稀有度 pill 样式和收益/价格数值。
6. **FAQs** 5 组问答，问题标题使用 H3，与预览文案一致，包括播放链接 `https://stealabrainrot.quest`。
7. **CTA** 收尾标题 “It's Time to Steal a Brainrot!” 与段落，提示玩家立即游玩。
- 所有段落、表格、列表需要支持从 JSON/MDX 读取，方便日后更新。

### R8. 评论区
**User Story**: 作为访客，我希望能留下评论并浏览其他玩家观点。
- 评论区标题 “💬 发表评论”，表单包含“你的名字”“你的邮箱”两个输入框和多行文本，右下角按钮文字“提交评论”。
- 表单校验：必填字段为空时禁用提交；邮箱需通过基础正则；提交后调用 `/api/comments` 写入 Supabase，再刷新列表（乐观更新）。
- 表单下方显示“已有评论”标题和至少两条示例评论。每条评论包含头像 Emoji、昵称、时间戳、正文，背景 #2A2B36。
- “💬 评论”按钮滚动到此区域。

### R9. Footer
**User Story**: 作为访客，我需要在页脚快速跳转到政策页面并看到版权信息。
- Footer 背景 #1A1B26，内边距 3rem/2rem/2rem，与预览稿一致。
- 上部显示绿色 Logo 块和链接列表（About Us、Privacy Policy、Term Of Use、Contact Us、Copyright），点击分别跳转到 `/about-us`、`/privacy-policy`、`/term-of-use`、`/contact-us`、`/copyright-infringement-notice-procedure`。
- 底部说明文字与预览稿一致：Copyright 行 + 中文免责声明。

## 交互与非功能需求
### R10. 响应式与交互
- ≥1200px：保持两列/多列布局；768-1199px：推荐卡片宽度 120px，信息网格 2 列；<768px：导航折叠、表单栅格堆叠、Footer 垂直排列。
- 所有滚动和模式切换需要平滑过渡（CSS transition 200-300ms）。
- Recommended 区横向滚动支持鼠标滚轮+拖动；移动端支持触摸滑动。
- TOC、评论按钮、移动菜单需可通过键盘触发（Enter/Space）。

### R11. SEO、可访问性与性能
- `<head>` 中包含：`<title>Steal Brainrot | Play Steal A Brainrot Online</title>`、meta description（150±10 字符）、keywords、OG/Twitter tags、canonical `https://stealabrainrot.quest/`。
- 添加 JSON-LD（`WebSite` + `Game` + `FAQPage`）反映页面内容。
- 语义化标签：`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`，标题层级不跳级。
- 控件需 aria-label/title（如剧院/全屏按钮），表格添加 `<caption>` 或 `aria-describedby`。
- 图片/iframe 提供 `title`、`alt`，懒加载非首屏资源。
- 运行 eslint、stylelint（如适用）并通过 CI。

### R12. 数据与可维护性
- 推荐列表、信息网格、正文、FAQ、角色、评论示例等写入 `data/homepage-optimization/*.json` 或 `.mdx`。页面渲染时自 `lib/homepage.ts` 读取，便于复用。
- 所有文案在单一来源维护，不得再硬编码在组件里。
- 设置类型定义（TypeScript）确保字段完整，缺失字段在构建时提示。
