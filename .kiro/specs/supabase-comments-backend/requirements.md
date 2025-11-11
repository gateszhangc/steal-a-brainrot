# Requirements Document

## Introduction

本文档定义了基于 Supabase 的评论系统后端功能需求。该系统需要支持用户提交评论、查看评论、投票评论等核心功能，并确保数据安全性和性能。

## Glossary

- **Comment System**: 评论系统，允许用户对游戏页面发表评论和回复
- **Supabase**: 开源的 Firebase 替代品，提供数据库、认证和实时功能
- **API Route**: Next.js API 路由，处理客户端请求的服务器端端点
- **RLS**: Row Level Security，Supabase 的行级安全策略
- **Vote System**: 投票系统，允许用户对评论点赞或点踩
- **Game ID**: 游戏标识符，用于区分不同游戏页面的评论

## Requirements

### Requirement 1

**User Story:** 作为用户，我想要提交评论，以便分享我对游戏的看法

#### Acceptance Criteria

1. WHEN 用户提交包含姓名、邮箱和内容的评论表单
3. THE Comment System SHALL 将评论存储到 Supabase 数据库中
4. WHEN 评论成功保存，THE Comment System SHALL 返回包含评论 ID 和创建时间的成功响应

### Requirement 2

**User Story:** 作为用户，我想要查看游戏页面的评论列表，以便了解其他玩家的评价

#### Acceptance Criteria

1. WHEN 用户访问游戏页面，THE Comment System SHALL 加载该游戏评论列表
2. THE Comment System SHALL 支持按最新、最旧和最受欢迎排序评论
3. THE Comment System SHALL 实现分页功能，每页显示 5 条评论
4. WHEN 评论有回复，THE Comment System SHALL 在父评论下显示所有回复
5. THE Comment System SHALL 返回评论总数和分页信息

### Requirement 3

**User Story:** 作为用户，我想要对评论进行投票，以便表达我对评论的认同或反对

#### Acceptance Criteria

1. WHEN 用户点击点赞按钮，THE Comment System SHALL 记录该用户的投票
2. WHEN 用户已经投过票并再次点击相同按钮，THE Comment System SHALL 取消该投票
3. WHEN 用户已经投过票并点击相反按钮，THE Comment System SHALL 更改投票类型
4. THE Comment System SHALL 基于 IP 地址防止重复投票
5. WHEN 投票状态改变，THE Comment System SHALL 实时更新评论的点赞和点踩计数

### Requirement 6

**User Story:** 作为用户，我想要回复其他用户的评论，以便进行讨论

#### Acceptance Criteria

1. WHEN 用户点击回复按钮，THE Comment System SHALL 显示回复表单
2. WHEN 用户提交回复，THE Comment System SHALL 将 parent_id 设置为父评论的 ID
3. THE Comment System SHALL 在父评论下显示所有回复
4. THE Comment System SHALL 支持多级回复（至少两级）
5. WHEN 加载评论，THE Comment System SHALL 同时加载所有相关回复

### Requirement 7

**User Story:** 作为用户，我想要在不同游戏页面看到对应的评论，以便评论内容与游戏相关

#### Acceptance Criteria

1. THE Comment System SHALL 使用 game_id 参数区分不同游戏的评论
2. WHEN 加载评论，THE Comment System SHALL 只返回匹配当前 game_id 的评论
3. WHEN 提交评论，THE Comment System SHALL 自动关联当前页面的 game_id

