# SEO优化需求文档

## 简介

本文档定义了为Steal a Brainrot游戏网站实施全面SEO优化的需求。项目将利用seo目录下SEMrush提供的长尾关键词数据和常见问题，通过优化元数据、实施结构化数据、创建FAQ内容、改进网站架构等方式，提升网站在搜索引擎中的可见性和排名，增加自然流量。

## 术语表

- **SEO优化系统**: 包含元数据管理、结构化数据、内容优化的完整搜索引擎优化实施方案
- **长尾关键词**: 搜索量适中、竞争度较低、转化率较高的多词组合搜索词（如"steal a brainrot unblocked"）
- **Schema标记**: JSON-LD格式的结构化数据，帮助搜索引擎理解页面内容类型和关系
- **元标签生成器**: 自动为每个页面生成优化的title、description等meta标签的组件
- **FAQ组件**: 展示常见问题及答案的React组件，包含FAQPage schema标记
- **关键词映射文件**: 将SEMrush关键词数据映射到具体页面的配置文件
- **动态Sitemap**: 根据游戏页面自动生成和更新的XML站点地图
- **Open Graph标签**: 用于社交媒体分享预览的og:前缀元标签
- **Next.js元数据API**: Next.js 13+提供的metadata对象和generateMetadata函数

## 需求

### 需求 1: 解析SEMrush关键词数据

**用户故事:** 作为开发者，我需要从SEMrush Excel文件中提取关键词数据，以便将这些数据应用到网站优化中

#### 验收标准

1. THE SEO优化系统 SHALL 读取seo目录下的Excel文件（steal-a-brainrot_broad-match_us_2025-11-11.xlsx和steal-a-brainrot_broad-match_us_2025-11-11-quest.xlsx）
2. THE SEO优化系统 SHALL 提取每个关键词的搜索量、关键词难度、CPC等数据
3. THE SEO优化系统 SHALL 将提取的数据转换为JSON格式存储在配置文件中
4. THE SEO优化系统 SHALL 识别问题型关键词（包含what、how、where、when、why等）用于FAQ生成
5. THE SEO优化系统 SHALL 按搜索量和关键词难度对关键词进行优先级排序

### 需求 2: 动态元标签优化

**用户故事:** 作为网站访问者，当我通过搜索引擎找到网站时，我希望看到准确、吸引人的标题和描述，以便判断是否点击

#### 验收标准

1. THE SEO优化系统 SHALL 为每个游戏页面生成包含游戏名称和相关长尾关键词的唯一meta title
2. THE SEO优化系统 SHALL 确保meta title长度在50-60个字符之间
3. THE SEO优化系统 SHALL 为每个页面生成包含关键词和游戏特色的meta description
4. THE SEO优化系统 SHALL 确保meta description长度在150-160个字符之间
5. WHEN 游戏页面加载时, THE SEO优化系统 SHALL 使用Next.js的metadata API或generateMetadata函数动态生成元标签

### 需求 3: 结构化数据实施

**用户故事:** 作为搜索引擎爬虫，我需要理解页面内容的结构和类型，以便在搜索结果中展示富媒体摘要

#### 验收标准

1. THE SEO优化系统 SHALL 在每个游戏页面实施VideoGame类型的JSON-LD schema标记
2. THE SEO优化系统 SHALL 在schema中包含游戏名称、描述、类型、发布日期、游戏URL等属性
3. WHERE 游戏有评分数据时, THE SEO优化系统 SHALL 在schema中包含aggregateRating属性
4. THE SEO优化系统 SHALL 在首页实施WebSite类型的schema标记，包含网站名称和搜索功能
5. THE SEO优化系统 SHALL 使用script标签将JSON-LD数据注入到页面head中

### 需求 4: FAQ页面和组件

**用户故事:** 作为网站访问者，我希望快速找到关于游戏的常见问题答案，以便了解游戏玩法和特点

#### 验收标准

1. THE SEO优化系统 SHALL 基于SEMrush问题型关键词创建FAQ条目
2. THE SEO优化系统 SHALL 在首页创建FAQ部分展示通用问题（如"什么是steal a brainrot"、"如何玩steal a brainrot"）
3. THE SEO优化系统 SHALL 实施FAQPage类型的JSON-LD schema标记，包含所有问题和答案
4. THE SEO优化系统 SHALL 创建可复用的FAQ React组件，支持展开/折叠功能
5. WHERE 特定游戏有专属FAQ时, THE SEO优化系统 SHALL 在游戏页面显示游戏特定的FAQ部分

### 需求 5: 关键词映射和内容优化

**用户故事:** 作为内容管理员，我需要将长尾关键词合理分配到各个页面，以便最大化SEO效果

#### 验收标准

1. THE SEO优化系统 SHALL 创建关键词映射配置文件（如seo-keywords.json），将关键词分配给对应页面
2. THE SEO优化系统 SHALL 为每个页面分配1个主关键词和2-3个次要关键词
3. THE SEO优化系统 SHALL 优先将高搜索量、低难度的关键词分配给重要页面
4. THE SEO优化系统 SHALL 在页面H1标题中自然融入主关键词
5. THE SEO优化系统 SHALL 在页面内容中自然分布次要关键词，避免关键词堆砌

### 需求 6: 动态Sitemap生成

**用户故事:** 作为搜索引擎爬虫，我需要一个完整的网站地图来发现和索引所有页面

#### 验收标准

1. THE SEO优化系统 SHALL 创建动态sitemap生成脚本，扫描app目录下所有游戏页面
2. THE SEO优化系统 SHALL 为每个URL生成包含loc、lastmod、changefreq、priority的sitemap条目
3. THE SEO优化系统 SHALL 将首页priority设置为1.0，游戏页面设置为0.8，其他页面设置为0.5
4. THE SEO优化系统 SHALL 将生成的sitemap.xml保存到public目录
5. WHEN 添加新游戏页面时, THE SEO优化系统 SHALL 提供命令或脚本重新生成sitemap

### 需求 7: Open Graph和社交媒体标签

**用户故事:** 作为在社交媒体分享链接的用户，我希望链接预览显示吸引人的图片和描述

#### 验收标准

1. THE SEO优化系统 SHALL 为每个页面实施Open Graph标签（og:title、og:description、og:image、og:url、og:type）
2. THE SEO优化系统 SHALL 为每个页面实施Twitter Card标签（twitter:card、twitter:title、twitter:description、twitter:image）
3. THE SEO优化系统 SHALL 确保og:image和twitter:image使用至少1200x630像素的图片
4. THE SEO优化系统 SHALL 将首页og:type设置为"website"，游戏页面设置为"article"
5. WHERE 游戏有专属封面图时, THE SEO优化系统 SHALL 使用游戏封面作为社交媒体分享图片


### 需求 10: SEO监控和报告

**用户故事:** 作为网站管理员，我需要了解SEO优化效果，以便持续改进

#### 验收标准

1. THE SEO优化系统 SHALL 创建SEO审计脚本，检查所有页面的元标签完整性
2. THE SEO优化系统 SHALL 生成SEO报告，列出缺失meta标签、重复标题、过长/过短描述的页面
3. THE SEO优化系统 SHALL 验证所有页面的结构化数据是否符合schema.org规范
4. THE SEO优化系统 SHALL 检查sitemap.xml是否包含所有游戏页面
5. THE SEO优化系统 SHALL 输出优化建议清单，包括需要改进的页面和具体改进方向
