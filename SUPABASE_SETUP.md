# Supabase 评论系统设置指南

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目，命名为 "steal-brainrot-comments"

## 2. 配置环境变量

在 `.env.local` 文件中填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

这些密钥可以在 Supabase 项目的 Settings > API 中找到。

## 3. 创建数据库表

1. 在 Supabase 项目中，进入 SQL Editor
2. 复制 `supabase/comments_table.sql` 中的内容
3. 粘贴到 SQL Editor 中并执行

这将创建：
- `comments` 表：存储评论数据
- `comment_votes` 表：存储评论投票
- 相关索引和 RLS 策略

## 4. 启用 RLS (Row Level Security)

评论系统已经配置了 RLS 策略：
- 所有人可以查看已批准的评论
- 所有人可以提交评论（需要审核）
- 投票功能基于 IP 地址限制

## 5. 测试功能

启动开发服务器：
```bash
npm run dev
```

测试评论功能：
1. 访问首页
2. 填写评论表单
3. 提交评论
4. 查看 Supabase Dashboard 中的数据

## 6. 可选配置

### 自动审核评论
如果你想要自动批准评论，可以修改 `app/api/make-comment.ajax/route.js` 中的：
```javascript
status: 'approved', // 改为 'approved' 自动批准
```

### 添加邮件通知
可以使用 Supabase Edge Functions 发送邮件通知。

### 添加垃圾评论过滤
可以集成第三方服务如 Akismet 或简单的关键词过滤。

## 7. 生产环境部署

在生产环境中：
1. 确保环境变量正确设置
2. 考虑添加速率限制
3. 监控数据库使用情况
4. 定期备份评论数据

## 8. 数据管理

你可以在 Supabase Dashboard 中：
- 查看所有评论
- 手动审核待批准的评论
- 删除垃圾评论
- 查看投票统计
- 导出数据