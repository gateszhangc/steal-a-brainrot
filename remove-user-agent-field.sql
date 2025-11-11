-- 移除 user_agent 字段（如果存在）

-- 检查是否存在 user_agent 字段
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'comments'
        AND column_name = 'user_agent'
    ) THEN
        -- 删除 user_agent 字段
        ALTER TABLE comments DROP COLUMN IF EXISTS user_agent;
        RAISE NOTICE 'user_agent 字段已删除';
    ELSE
        RAISE NOTICE 'user_agent 字段不存在，无需删除';
    END IF;
END $$;

-- 显示当前的表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;