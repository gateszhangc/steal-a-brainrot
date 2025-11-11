import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 加载环境变量
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 配置检查:')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length || 0)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 环境变量配置错误')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testWithEnv() {
  try {
    console.log('\n🔍 使用环境变量测试连接...')

    // 测试基本连接
    const { data, error } = await supabase
      .from('comments')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ 连接失败:', error)

      if (error.code === 'PGRST205') {
        console.log('\n📋 需要创建 comments 表')
        console.log('请在 Supabase Dashboard 中执行以下操作:')
        console.log('1. 访问: https://supabase.com/dashboard/project/ptukqwqbpjzqpqzvlrle/sql')
        console.log('2. 复制 supabase/comments_table.sql 中的内容')
        console.log('3. 粘贴到 SQL 编辑器并点击 Run')
      }
    } else {
      console.log('✅ 连接成功!')
      console.log('当前评论数:', data)

      // 测试插入
      console.log('\n🧪 测试插入评论...')
      const { data: insertData, error: insertError } = await supabase
        .from('comments')
        .insert({
          author: '环境变量测试',
          email: 'env@example.com',
          content: '使用环境变量的测试评论',
          game_id: 'steal-brainrot',
          status: 'approved',
          ip_address: '127.0.0.1'
        })
        .select()

      if (insertError) {
        console.log('❌ 插入失败:', insertError)
      } else {
        console.log('✅ 插入成功! ID:', insertData[0].id)
      }
    }

  } catch (err) {
    console.error('❌ 测试失败:', err)
  }
}

testWithEnv()