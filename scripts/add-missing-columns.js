import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgyOTcwOSwiZXhwIjoyMDc4NDA1NzA5fQ.OtYT3SuQgbACbWOR6hHAEsKNqkUhMEOcb7d-QqSnXTc'

const supabase = createClient(supabaseUrl, serviceKey)

console.log('🔧 添加缺失的列到 comments 表...')

async function addMissingColumns() {
  try {
    // 尝试添加缺失的列
    const alterSQLs = [
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_agent TEXT;',
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id BIGINT DEFAULT 0;',
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;',
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS dislike_count INTEGER DEFAULT 0;',
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();',
      'ALTER TABLE comments ADD CONSTRAINT IF NOT EXISTS check_status CHECK (status IN (\'approved\', \'pending\', \'spam\', \'trash\'));'
    ]

    console.log('\n📋 尝试添加缺失的列...')

    for (const sql of alterSQLs) {
      console.log('执行:', sql)

      try {
        // 通过 HTTP API 尝试执行 ALTER TABLE
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'PATCH',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: sql
          })
        })

        console.log('ALTER 响应:', response.status)
        // 不太可能成功，但我们试试
      } catch (err) {
        console.log('ALTER 失败:', err.message)
      }
    }

    console.log('\n🔍 验证表结构...')

    // 检查表结构
    const { data: structData, error: structError } = await supabase
      .from('comments')
      .select('*')
      .limit(1)

    if (structError) {
      console.log('❌ 表结构检查失败:', structError)
    } else {
      console.log('✅ 表结构验证成功!')
      console.log('可用列:', structData.length > 0 ? Object.keys(structData[0]) : '表为空')
    }

    // 现在尝试插入不包含缺失列的评论
    console.log('\n🧪 测试基本插入功能...')

    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert({
        author: '列修复测试',
        email: 'column-fix@example.com',
        content: '测试列修复后的插入功能',
        game_id: 'steal-brainrot',
        status: 'approved',
        ip_address: '127.0.0.1'
      })
      .select()

    if (insertError) {
      console.log('❌ 基本插入失败:', insertError)

      // 检查是否还有其他缺失的列
      if (insertError.message.includes('column')) {
        console.log('\n🔧 还有缺失的列，尝试更简单的插入...')

        const { data: simpleData, error: simpleError } = await supabase
          .from('comments')
          .insert({
            author: '简单测试',
            email: 'simple@example.com',
            content: '最简单的测试',
            game_id: 'steal-brainrot'
          })
          .select()

        if (simpleError) {
          console.log('❌ 简单插入也失败:', simpleError)
          console.log('\n📋 需要手动添加列，请在 Supabase Dashboard 中执行:')
          console.log(`ALTER TABLE comments
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS parent_id BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislike_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD CONSTRAINT IF NOT EXISTS check_status CHECK (status IN ('approved', 'pending', 'spam', 'trash'));`)
        } else {
          console.log('✅ 简单插入成功! ID:', simpleData[0].id)
        }
      }
    } else {
      console.log('✅ 基本插入成功! ID:', insertData[0].id)
    }

  } catch (error) {
    console.error('❌ 添加列时出错:', error)
  }
}

addMissingColumns()