# SEO优化实施任务列表

- [ ] 1. 创建SEO基础设施和配置文件
  - 创建lib/seo目录结构
  - 创建seo/keywords.json配置文件模板
  - 创建TypeScript类型定义文件
  - _需求: 1.3, 5.1_

- [ ] 2. 实现SEMrush数据解析器
  - [ ] 2.1 创建Excel解析脚本
    - 编写scripts/parseSEMrush.js脚本
    - 使用xlsx库读取Excel文件
    - 提取关键词、搜索量、难度、CPC等字段
    - _需求: 1.1, 1.2_

  - [ ] 2.2 实现关键词分类和优先级算法
    - 识别问题型关键词（包含what/how/where等）
    - 计算关键词优先级分数
    - 按搜索意图分类关键词
    - _需求: 1.4, 1.5_

  - [ ] 2.3 生成关键词配置JSON文件
    - 将解析的数据转换为JSON格式
    - 保存到seo/keywords.json
    - 为每个页面分配主关键词和次要关键词
    - _需求: 1.3, 5.1, 5.2_

- [ ] 3. 实现元数据生成系统
  - [ ] 3.1 创建元数据生成器工具库
    - 编写lib/seo/metadata.ts
    - 实现generateMetadata函数
    - 实现标题和描述长度优化函数
    - _需求: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.2 实现Open Graph和Twitter Card标签生成
    - 在元数据中添加og:标签
    - 添加twitter:标签
    - 确保图片尺寸符合要求
    - _需求: 7.1, 7.2, 7.3, 7.4_

  - [ ] 3.3 更新首页元数据
    - 修改app/layout.tsx使用动态元数据
    - 从关键词配置读取主关键词
    - 生成优化的title和description
    - _需求: 2.5_

  - [ ] 3.4 为游戏页面实现动态元数据
    - 为每个游戏页面添加generateMetadata函数
    - 基于游戏名称和关键词生成元标签
    - 确保每个页面有唯一的元数据
    - _需求: 2.1, 2.5_

- [ ] 4. 实现Schema结构化数据
  - [ ] 4.1 创建Schema生成器
    - 编写lib/seo/schema.ts
    - 实现VideoGame schema生成函数
    - 实现WebSite schema生成函数
    - 实现FAQPage schema生成函数
    - _需求: 3.1, 3.2, 3.4_

  - [ ] 4.2 创建Schema标记组件
    - 创建components/seo/SchemaMarkup.tsx
    - 接收schema对象并渲染为JSON-LD script标签
    - 确保JSON安全序列化
    - _需求: 3.5_

  - [ ] 4.3 在首页添加WebSite schema
    - 在app/page.tsx中添加WebSite schema
    - 包含网站名称和搜索功能
    - _需求: 3.4_

  - [ ] 4.4 在游戏页面添加VideoGame schema
    - 在每个游戏页面添加VideoGame schema
    - 包含游戏名称、描述、类型、URL
    - 如有评分数据，添加aggregateRating
    - _需求: 3.1, 3.2, 3.3_

- [ ] 5. 创建FAQ组件和内容
  - [ ] 5.1 实现FAQ React组件
    - 创建components/seo/FAQ.tsx
    - 实现手风琴式展开/折叠功能
    - 使用Tailwind CSS样式
    - 支持键盘导航
    - _需求: 4.4_

  - [ ] 5.2 生成FAQ数据
    - 从SEMrush问题型关键词提取FAQ
    - 创建至少15个FAQ条目
    - 编写清晰的问题和答案
    - 保存到seo/keywords.json的faqs字段
    - _需求: 4.1, 4.2_

  - [ ] 5.3 在首页集成FAQ组件
    - 在app/page.tsx添加FAQ部分
    - 从配置文件读取FAQ数据
    - 自动生成FAQPage schema标记
    - _需求: 4.2, 4.3_

  - [ ]* 5.4 为特定游戏页面添加FAQ
    - 识别有专属FAQ的游戏
    - 在游戏页面添加游戏特定FAQ
    - _需求: 4.5_

- [ ] 6. 实现动态Sitemap生成
  - [ ] 6.1 创建Sitemap生成脚本
    - 编写scripts/generateSitemap.js
    - 扫描app目录获取所有page.tsx文件
    - 排除特殊路由（_not-found、api等）
    - _需求: 6.1_

  - [ ] 6.2 生成Sitemap XML
    - 为每个页面生成sitemap条目
    - 设置正确的priority和changefreq
    - 添加lastmod时间戳
    - 生成符合sitemap.org规范的XML
    - _需求: 6.2, 6.3, 6.5_

  - [ ] 6.3 保存Sitemap到public目录
    - 将生成的sitemap.xml保存到public/
    - 替换现有的sitemap.xml
    - _需求: 6.4_

  - [ ] 6.4 添加npm脚本命令
    - 在package.json添加seo:sitemap命令
    - 在构建流程中集成sitemap生成
    - _需求: 6.5_

- [ ] 7. 实现关键词映射和内容优化
  - [ ] 7.1 创建关键词映射配置
    - 在seo/keywords.json中定义pages对象
    - 为每个页面分配主关键词和次要关键词
    - 包含优化的title和description模板
    - _需求: 5.1, 5.2_

  - [ ] 7.2 优化页面H1标题
    - 在首页和游戏页面中融入主关键词
    - 确保H1标题自然且吸引人
    - _需求: 5.4_

  - [ ] 7.3 优化页面内容关键词分布
    - 在页面描述中自然分布次要关键词
    - 避免关键词堆砌
    - 保持内容可读性
    - _需求: 5.3, 5.5_

- [ ] 8. 实现SEO审计和监控工具
  - [ ] 8.1 创建SEO审计脚本
    - 编写scripts/seoAudit.js
    - 检查所有页面的元标签完整性
    - 识别缺失、重复或过长/过短的标签
    - _需求: 10.1, 10.4_

  - [ ] 8.2 实现Schema验证
    - 验证所有页面的结构化数据
    - 检查是否符合schema.org规范
    - 使用Google Rich Results Test API（如可用）
    - _需求: 10.3_

  - [ ] 8.3 生成SEO审计报告
    - 输出详细的审计报告
    - 列出所有问题和警告
    - 提供优化建议
    - _需求: 10.2, 10.5_

  - [ ] 8.4 添加npm脚本命令
    - 在package.json添加seo:audit命令
    - 创建seo:all命令运行所有SEO任务
    - _需求: 10.1_

- [ ]* 9. 编写测试
  - [ ]* 9.1 编写关键词解析器单元测试
    - 测试Excel解析功能
    - 测试问题识别准确性
    - 测试优先级排序算法
    - _需求: 1.1, 1.4, 1.5_

  - [ ]* 9.2 编写元数据生成器单元测试
    - 测试标题长度优化
    - 测试描述长度优化
    - 测试关键词插入
    - _需求: 2.2, 2.4_

  - [ ]* 9.3 编写Schema生成器单元测试
    - 测试JSON-LD格式正确性
    - 测试schema.org规范合规性
    - _需求: 3.1, 3.5_

  - [ ]* 9.4 编写端到端SEO测试
    - 验证每个页面都有元标签
    - 验证schema标记存在且有效
    - 验证sitemap包含所有页面
    - _需求: 10.1, 10.3, 10.4_

- [ ] 10. 文档和部署准备
  - [ ] 10.1 创建SEO使用文档
    - 编写README说明如何使用SEO工具
    - 记录npm脚本命令
    - 提供关键词更新流程
    - _需求: 所有_

  - [ ] 10.2 更新package.json脚本
    - 添加所有SEO相关命令
    - 确保脚本在不同环境下可运行
    - _需求: 所有_

  - [ ] 10.3 运行完整SEO审计
    - 执行seo:all命令
    - 检查并修复所有问题
    - 验证Lighthouse SEO评分
    - _需求: 10.1, 10.2, 10.3, 10.4, 10.5_
