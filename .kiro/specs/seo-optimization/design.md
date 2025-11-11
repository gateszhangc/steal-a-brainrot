# SEO优化设计文档

## 概述

本设计文档描述了Steal a Brainrot游戏网站的SEO优化系统架构。系统将基于Next.js 14的App Router架构，利用其内置的元数据API、动态路由和服务端渲染能力，结合SEMrush关键词数据，实现全面的搜索引擎优化。

核心设计原则：
- **数据驱动**: 所有SEO配置基于SEMrush数据和配置文件
- **自动化**: 最小化手动配置，自动生成元标签和结构化数据
- **可维护性**: 集中管理SEO配置，便于更新和扩展
- **性能优先**: 利用Next.js的静态生成和增量静态再生成
- **标准合规**: 遵循schema.org、Open Graph等标准规范

## 架构设计

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     SEO优化系统                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ SEMrush数据  │─────▶│ 关键词解析器 │                    │
│  │  (Excel)     │      │              │                    │
│  └──────────────┘      └──────┬───────┘                    │
│                               │                             │
│                               ▼                             │
│                        ┌──────────────┐                    │
│                        │ SEO配置文件  │                    │
│                        │  (JSON)      │                    │
│                        └──────┬───────┘                    │
│                               │                             │
│         ┌─────────────────────┼─────────────────────┐      │
│         │                     │                     │      │
│         ▼                     ▼                     ▼      │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐│
│  │ 元数据生成器│      │ Schema生成器│      │ FAQ组件     ││
│  │             │      │             │      │             ││
│  └──────┬──────┘      └──────┬──────┘      └──────┬──────┘│
│         │                    │                    │       │
│         └────────────────────┼────────────────────┘       │
│                              │                             │
│                              ▼                             │
│                       ┌──────────────┐                    │
│                       │  Next.js页面 │                    │
│                       │              │                    │
│                       └──────┬───────┘                    │
│                              │                             │
│                              ▼                             │
│                       ┌──────────────┐                    │
│                       │  HTML输出    │                    │
│                       │ (含SEO标签)  │                    │
│                       └──────────────┘                    │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ Sitemap生成器│      │ SEO审计工具  │                    │
│  │              │      │              │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
steal-a-brainrot/
├── seo/                          # SEO数据源
│   ├── *.xlsx                    # SEMrush Excel文件
│   └── keywords.json             # 解析后的关键词数据
├── lib/
│   └── seo/                      # SEO工具库
│       ├── keywords.ts           # 关键词解析和管理
│       ├── metadata.ts           # 元数据生成器
│       ├── schema.ts             # Schema标记生成器
│       ├── sitemap.ts            # Sitemap生成工具
│       └── config.ts             # SEO配置管理
├── components/
│   └── seo/                      # SEO组件
│       ├── FAQ.tsx               # FAQ组件
│       ├── SchemaMarkup.tsx      # Schema标记组件
│       └── RelatedGames.tsx      # 相关游戏组件
├── app/
│   ├── layout.tsx                # 根布局（全局元数据）
│   ├── page.tsx                  # 首页（含FAQ）
│   └── [game]/
│       ├── layout.tsx            # 游戏页面布局
│       └── page.tsx              # 游戏页面
├── scripts/
│   ├── parseSEMrush.js           # 解析SEMrush数据
│   ├── generateSitemap.js        # 生成sitemap
│   └── seoAudit.js               # SEO审计
└── public/
    └── sitemap.xml               # 生成的sitemap
```

## 组件和接口设计

### 1. 关键词解析器 (lib/seo/keywords.ts)

**职责**: 解析SEMrush Excel文件，提取和处理关键词数据

**接口设计**:

```typescript
// 关键词数据类型
interface Keyword {
  keyword: string;           // 关键词文本
  searchVolume: number;      // 月搜索量
  keywordDifficulty: number; // 关键词难度 (0-100)
  cpc: number;              // 每次点击成本
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  isQuestion: boolean;       // 是否为问题型关键词
}

// 页面关键词映射
interface PageKeywords {
  path: string;              // 页面路径
  primaryKeyword: Keyword;   // 主关键词
  secondaryKeywords: Keyword[]; // 次要关键词 (2-3个)
  relatedQuestions: string[]; // 相关问题
}

// 解析SEMrush数据
function parseSEMrushData(filePath: string): Keyword[]

// 识别问题型关键词
function identifyQuestions(keywords: Keyword[]): Keyword[]

// 为页面分配关键词
function assignKeywordsToPages(
  keywords: Keyword[], 
  pages: string[]
): PageKeywords[]

// 按优先级排序关键词
function prioritizeKeywords(keywords: Keyword[]): Keyword[]
```

**实现要点**:
- 使用xlsx或exceljs库解析Excel文件
- 识别包含what/how/where/when/why/can/is/does等的问题型关键词
- 优先级算法: `score = searchVolume / (keywordDifficulty + 1)`
- 将高优先级关键词分配给首页和主要游戏页面

### 2. 元数据生成器 (lib/seo/metadata.ts)

**职责**: 为每个页面生成优化的元数据

**接口设计**:

```typescript
import { Metadata } from 'next';

// 元数据配置
interface MetadataConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

// 生成页面元数据
function generateMetadata(config: {
  pagePath: string;
  gameTitle?: string;
  pageKeywords: PageKeywords;
  baseUrl: string;
}): Metadata

// 生成首页元数据
function generateHomeMetadata(
  primaryKeyword: Keyword,
  baseUrl: string
): Metadata

// 生成游戏页面元数据
function generateGameMetadata(
  gameTitle: string,
  gameSlug: string,
  pageKeywords: PageKeywords,
  baseUrl: string
): Metadata

// 优化标题长度
function optimizeTitle(title: string, maxLength: number = 60): string

// 优化描述长度
function optimizeDescription(desc: string, maxLength: number = 160): string
```

**实现要点**:
- 标题格式: `{游戏名称} - {主关键词} | Steal a Brainrot`
- 描述格式: 包含主关键词、游戏特色、行动号召
- 自动截断过长的标题和描述，保持完整单词
- 包含Open Graph和Twitter Card标签
- 使用Next.js的Metadata API

### 3. Schema标记生成器 (lib/seo/schema.ts)

**职责**: 生成符合schema.org规范的JSON-LD结构化数据

**接口设计**:

```typescript
// VideoGame Schema
interface VideoGameSchema {
  '@context': 'https://schema.org';
  '@type': 'VideoGame';
  name: string;
  description: string;
  genre: string[];
  gamePlatform: string[];
  url: string;
  datePublished?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    ratingCount: number;
  };
}

// FAQPage Schema
interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// WebSite Schema
interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

// 生成VideoGame schema
function generateVideoGameSchema(game: {
  name: string;
  description: string;
  genre: string[];
  url: string;
  rating?: { value: number; count: number };
}): VideoGameSchema

// 生成FAQPage schema
function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>): FAQPageSchema

// 生成WebSite schema
function generateWebSiteSchema(
  siteName: string,
  siteUrl: string
): WebSiteSchema
```

**实现要点**:
- 所有schema使用JSON-LD格式
- 通过`<script type="application/ld+json">`注入到页面
- 验证schema符合Google Rich Results Test要求
- 支持多个schema在同一页面

### 4. FAQ组件 (components/seo/FAQ.tsx)

**职责**: 展示常见问题，包含FAQPage schema标记

**接口设计**:

```typescript
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  includeSchema?: boolean; // 是否包含schema标记
}

export function FAQ({ items, title, includeSchema = true }: FAQProps): JSX.Element
```

**UI设计**:
- 手风琴式展开/折叠
- 默认全部折叠，点击展开
- 使用Tailwind CSS样式
- 响应式设计，移动端友好
- 包含+/-图标指示展开状态

**实现要点**:
- 使用React useState管理展开状态
- 自动生成并注入FAQPage schema
- 支持键盘导航（Enter/Space展开）
- 使用semantic HTML（details/summary或自定义）

### 5. Sitemap生成器 (lib/seo/sitemap.ts)

**职责**: 扫描页面并生成XML sitemap

**接口设计**:

```typescript
interface SitemapEntry {
  loc: string;           // URL
  lastmod: string;       // 最后修改日期 (ISO 8601)
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;      // 0.0 - 1.0
}

// 扫描app目录获取所有页面
function scanPages(appDir: string): string[]

// 生成sitemap条目
function generateSitemapEntries(
  pages: string[],
  baseUrl: string
): SitemapEntry[]

// 生成XML sitemap
function generateSitemapXML(entries: SitemapEntry[]): string

// 保存sitemap到public目录
function saveSitemap(xml: string, outputPath: string): void
```

**实现要点**:
- 扫描app目录下所有page.tsx文件
- 排除特殊路由（如_not-found、api等）
- 首页priority=1.0，游戏页面=0.8，其他=0.5
- changefreq: 首页和游戏页面=daily，其他=weekly
- lastmod使用文件修改时间或当前时间
- 生成符合sitemap.org规范的XML

### 6. SEO配置管理 (lib/seo/config.ts)

**职责**: 集中管理SEO配置和常量

**接口设计**:

```typescript
// SEO配置
interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOGImage: string;
  twitterHandle?: string;
  locale: string;
  keywords: {
    primary: string[];
    secondary: string[];
  };
}

// 获取SEO配置
export function getSEOConfig(): SEOConfig

// 获取页面关键词
export function getPageKeywords(pagePath: string): PageKeywords | null

// 获取FAQ数据
export function getFAQData(category?: string): FAQItem[]
```

**配置文件结构** (seo/keywords.json):

```json
{
  "config": {
    "siteName": "Steal a Brainrot",
    "siteUrl": "https://www.stealabrainrot.quest",
    "defaultOGImage": "/og-image.png"
  },
  "keywords": {
    "primary": ["steal a brainrot", "brainrot game", "roblox brainrot"],
    "secondary": ["meme game", "online game", "free game"]
  },
  "pages": {
    "/": {
      "primaryKeyword": "steal a brainrot",
      "secondaryKeywords": ["steal a brainrot game", "play steal a brainrot"],
      "title": "Steal a Brainrot - Play Free Online Brainrot Game",
      "description": "Play Steal a Brainrot online for free..."
    },
    "/steal-a-brainrot-unblocked": {
      "primaryKeyword": "steal a brainrot unblocked",
      "secondaryKeywords": ["unblocked games", "school games"],
      "title": "Steal a Brainrot Unblocked - Play at School",
      "description": "..."
    }
  },
  "faqs": [
    {
      "question": "What is Steal a Brainrot?",
      "answer": "Steal a Brainrot is a free online game..."
    }
  ]
}
```

## 数据模型

### 关键词数据模型

```typescript
// SEMrush原始数据
interface SEMrushRow {
  Keyword: string;
  'Search Volume': number;
  'Keyword Difficulty': number;
  CPC: number;
  'Competitive Density': number;
  'Number of Results': number;
  'Trends': string;
  'SERP Features': string;
}

// 处理后的关键词
interface ProcessedKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  priority: number;        // 计算得出
  isQuestion: boolean;
  category: string;        // 自动分类
  intent: KeywordIntent;
}

// 关键词意图
type KeywordIntent = 
  | 'informational'  // 信息查询 (what is, how to)
  | 'navigational'   // 导航查询 (brand name)
  | 'transactional'  // 交易查询 (buy, download)
  | 'commercial';    // 商业查询 (best, review)
```

### 元数据模型

```typescript
// Next.js Metadata对象
interface PageMetadata {
  title: string | {
    default: string;
    template?: string;
  };
  description: string;
  keywords: string[];
  authors: Array<{ name: string }>;
  creator: string;
  publisher: string;
  openGraph: {
    type: 'website' | 'article';
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    locale: string;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    images: string[];
    creator?: string;
  };
  robots: {
    index: boolean;
    follow: boolean;
  };
  alternates: {
    canonical: string;
  };
}
```

## 错误处理

### 错误类型

1. **数据解析错误**
   - Excel文件不存在或格式错误
   - 处理: 记录错误日志，使用默认关键词配置

2. **关键词分配错误**
   - 页面数量超过可用关键词
   - 处理: 复用高优先级关键词，记录警告

3. **元数据生成错误**
   - 标题或描述为空
   - 处理: 使用默认值，记录警告

4. **Schema验证错误**
   - 生成的schema不符合规范
   - 处理: 记录错误，跳过该schema

5. **Sitemap生成错误**
   - 无法扫描页面或写入文件
   - 处理: 记录错误，保留旧sitemap

### 错误处理策略

```typescript
// 错误日志记录
function logSEOError(
  component: string,
  error: Error,
  context?: Record<string, any>
): void

// 降级策略
function getFallbackMetadata(pagePath: string): Metadata

// 验证函数
function validateSchema(schema: any): boolean
function validateMetadata(metadata: Metadata): boolean
```

## 测试策略

### 单元测试

1. **关键词解析器测试**
   - 测试Excel解析正确性
   - 测试问题识别准确性
   - 测试优先级排序算法

2. **元数据生成器测试**
   - 测试标题长度优化
   - 测试描述长度优化
   - 测试关键词插入

3. **Schema生成器测试**
   - 测试JSON-LD格式正确性
   - 测试schema.org规范合规性

### 集成测试

1. **端到端SEO测试**
   - 验证每个页面都有元标签
   - 验证schema标记存在且有效
   - 验证sitemap包含所有页面

2. **SEO审计测试**
   - 运行Lighthouse SEO审计
   - 验证Google Rich Results Test
   - 检查元标签重复和缺失

### 测试工具

```typescript
// SEO审计脚本
interface SEOAuditResult {
  page: string;
  issues: Array<{
    type: 'error' | 'warning';
    message: string;
  }>;
  score: number;
}

function auditPage(url: string): SEOAuditResult
function auditAllPages(): SEOAuditResult[]
function generateAuditReport(results: SEOAuditResult[]): string
```

## 性能考虑

### 构建时优化

1. **静态生成**
   - 使用Next.js的`generateStaticParams`预生成所有游戏页面
   - 元数据在构建时生成，无运行时开销

2. **增量静态再生成 (ISR)**
   - 对于动态内容（如评分），使用ISR定期更新
   - 设置合理的revalidate时间（如3600秒）

3. **数据缓存**
   - 关键词数据在构建时加载一次
   - 使用内存缓存避免重复读取配置文件

### 运行时优化

1. **组件懒加载**
   - FAQ组件使用动态导入
   - Schema标记组件按需加载

2. **代码分割**
   - SEO工具库仅在构建时使用，不打包到客户端
   - 客户端组件最小化

## 部署和维护

### 部署流程

1. **构建前准备**
   ```bash
   # 解析SEMrush数据
   npm run seo:parse
   
   # 生成sitemap
   npm run seo:sitemap
   
   # 运行SEO审计
   npm run seo:audit
   ```

2. **构建和部署**
   ```bash
   npm run build
   npm run start
   ```

### 维护任务

1. **定期更新关键词**
   - 每月从SEMrush下载最新数据
   - 运行解析脚本更新配置
   - 重新构建和部署

2. **SEO监控**
   - 每周运行SEO审计
   - 检查Google Search Console
   - 监控关键词排名变化

3. **内容优化**
   - 根据审计结果优化元标签
   - 更新FAQ内容
   - 添加新的长尾关键词页面

### 脚本命令

```json
{
  "scripts": {
    "seo:parse": "node scripts/parseSEMrush.js",
    "seo:sitemap": "node scripts/generateSitemap.js",
    "seo:audit": "node scripts/seoAudit.js",
    "seo:all": "npm run seo:parse && npm run seo:sitemap && npm run seo:audit"
  }
}
```

## 技术栈

- **Next.js 14**: App Router, Metadata API, 静态生成
- **TypeScript**: 类型安全的代码
- **xlsx/exceljs**: Excel文件解析
- **Tailwind CSS**: FAQ组件样式
- **Playwright**: SEO审计和测试
- **schema-dts**: TypeScript schema.org类型定义

## 安全考虑

1. **输入验证**
   - 验证Excel文件格式和内容
   - 清理用户生成的内容（如评论）

2. **XSS防护**
   - 元标签内容转义
   - Schema JSON安全序列化

3. **数据隐私**
   - 不在客户端暴露敏感SEO数据
   - API密钥使用环境变量

## 扩展性

### 未来增强

1. **多语言支持**
   - 添加hreflang标签
   - 为每种语言生成独立sitemap

2. **A/B测试**
   - 测试不同的标题和描述
   - 跟踪点击率变化

3. **自动内容生成**
   - 基于关键词自动生成游戏描述
   - AI辅助FAQ内容创作

4. **高级分析**
   - 集成Google Analytics
   - 跟踪关键词转化率
   - 热力图分析

## 总结

本设计提供了一个完整、可扩展的SEO优化系统，核心特点：

- **自动化**: 从数据解析到元标签生成全自动
- **标准化**: 遵循Next.js、schema.org、Open Graph标准
- **可维护**: 集中配置，易于更新和扩展
- **性能优化**: 构建时生成，运行时零开销
- **质量保证**: 完整的测试和审计工具

通过实施本设计，网站将获得显著的SEO改进，提升搜索引擎排名和自然流量。
