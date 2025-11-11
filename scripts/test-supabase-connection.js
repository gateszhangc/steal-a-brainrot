import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
// 注意：这里需要填入实际的 anon key
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔍 测试 comments 表连接...')

    // 测试基本连接
    const { data, error } = await supabase
      .from('comments')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Connection test failed:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))

      // 如果表不存在，尝试创建表
      if (error.message.includes('relation "comments" does not exist') || error.code === 'PGRST205') {
        console.log('\n📋 comments 表不存在，需要在 Supabase Dashboard 中创建')
        console.log('请访问: https://supabase.com/dashboard/project/ptukqwqbpjzqpqzvlrle/sql')
        console.log('然后复制粘贴 supabase/comments_table.sql 中的内容并执行')
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('Current comments count:', data)

      // 测试插入一条评论
      console.log('\n🧪 测试插入评论...')
      const { data: insertData, error: insertError } = await supabase
        .from('comments')
        .insert({
          author: '连接测试',
          email: 'test@example.com',
          content: '这是一条连接测试评论',
          game_id: 'steal-brainrot',
          status: 'approved',
          ip_address: '127.0.0.1'
        })
        .select()

      if (insertError) {
        console.log('❌ 插入评论失败:', insertError)
      } else {
        console.log('✅ 测试评论插入成功!')
        console.log('评论ID:', insertData[0].id)
      }
    }

  } catch (err) {
    console.error('❌ Test failed:', err.message)
  }
}

testConnection()