# Supabase 评论系统测试指南

## 概述

本文档描述了如何测试已实现的基于 Supabase 的评论系统后端功能。

## 功能清单

### ✅ 已完成功能

1. **Supabase 配置和连接**
   - ✅ 环境变量配置
   - ✅ Supabase 客户端设置
   - ✅ 数据库表创建脚本

2. **API 端点实现**
   - ✅ `POST /api/make-comment.ajax` - 创建评论
   - ✅ `GET /api/comments.ajax` - 获取评论列表
   - ✅ `POST /api/comment-vote.ajax` - 投票功能

3. **核心功能**
   - ✅ 评论提交（包含姓名、邮箱、内容）
   - ✅ 评论回复（支持 parent_id）
   - ✅ 评论投票（点赞/点踩）
   - ✅ 分页显示（每页5条评论）
   - ✅ 排序功能（最新、最旧、最受欢迎）
   - ✅ 游戏ID隔离（不同游戏页面的评论）

4. **安全功能**
   - ✅ IP 地址记录
   - ✅ 用户代理记录
   - ✅ 邮箱格式验证
   - ✅ RLS 策略配置
   - ✅ 投票防刷（基于IP）

5. **前端集成**
   - ✅ 评论表单组件
   - ✅ 评论列表显示
   - ✅ 投票按钮组件
   - ✅ JavaScript API 集成

## 测试步骤

### 1. 环境准备

确保以下环境变量已正确配置在 `.env.local` 文件中：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. 数据库设置

1. 在 Supabase Dashboard 中执行 `supabase/comments_table.sql`
2. 验证表和索引创建成功
3. 确认 RLS 策略已启用

### 3. 服务器启动

```bash
npm run dev
```

### 4. API 测试

运行 API 测试脚本：

```bash
node scripts/test-api-endpoints.js
```

### 5. 功能测试

#### 评论提交测试

1. 访问游戏页面
2. 填写评论表单（姓名、邮箱、内容）
3. 勾选同意条款
4. 提交评论
5. 验证评论出现在列表中

#### 评论回复测试

1. 点击现有评论的"回复"按钮
2. 填写回复内容
3. 提交回复
4. 验证回复显示在父评论下方

#### 投票测试

1. 点击评论的"👍"按钮
2. 验证点赞计数增加
3. 再次点击相同按钮
4. 验证投票被取消
5. 点击"👎"按钮
6. 验证点踩计数增加

#### 分页测试

1. 检查每页显示5条评论
2. 点击"Load more"按钮
3. 验证加载更多评论
4. 验证分页信息正确

#### 排序测试

1. 在排序下拉框中选择"最新"
2. 验证评论按时间倒序排列
3. 选择"最旧"
4. 验证评论按时间正序排列
5. 选择"最受欢迎"
6. 验证评论按点赞数排列

#### 游戏隔离测试

1. 在不同游戏页面提交评论
2. 验证评论只显示在对应游戏页面
3. 验证 game_id 参数正确传递

## 预期结果

### API 响应格式

#### 创建评论响应
```json
{
  "success": true,
  "comment": {
    "id": 123,
    "author": "用户名",
    "content": "评论内容",
    "date": "2025-01-11",
    "status": "approved",
    "parent_id": 0
  }
}
```

#### 获取评论响应
```json
{
  "success": true,
  "comments": [
    {
      "id": 123,
      "author": "用户名",
      "content": "评论内容",
      "date": "2025-01-11",
      "like_count": 5,
      "dislike_count": 1,
      "replies": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "totalPages": 5
  }
}
```

#### 投票响应
```json
{
  "success": true,
  "vote_result": {
    "action": "added",
    "vote_type": "like"
  },
  "counts": {
    "like": 6,
    "dislike": 1
  }
}
```

## 故障排除

### 常见问题

1. **环境变量未设置**
   - 检查 `.env.local` 文件是否存在
   - 验证 Supabase URL 和密钥是否正确

2. **数据库连接失败**
   - 确认 Supabase 项目正在运行
   - 验证服务角色密钥权限

3. **RLS 策略阻止访问**
   - 检查 RLS 策略是否正确配置
   - 确认匿名用户有读取权限

4. **API 请求失败**
   - 检查网络连接
   - 验证请求格式和参数

### 调试方法

1. 查看浏览器控制台错误
2. 检查服务器日志
3. 使用 Supabase Dashboard 监控查询
4. 测试 API 端点响应

## 性能考虑

- 评论列表使用分页减少数据传输
- 数据库索引优化查询性能
- RLS 策略确保数据安全
- 投票计数实时更新但缓存结果

## 下一步改进

1. 实现评论编辑功能
2. 添加评论举报系统
3. 集成用户认证
4. 添加评论审核功能
5. 实现实时更新（WebSocket）
6. 添加图片上传支持
7. 实现评论搜索功能