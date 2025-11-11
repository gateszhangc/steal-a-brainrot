-- 修复评论表结构，添加缺少的字段

-- 添加 user_agent 字段
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT 'Unknown';

-- 检查表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;