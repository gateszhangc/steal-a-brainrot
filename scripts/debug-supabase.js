import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Mjk3MDksImV4cCI6MjA3ODQwNTcwOX0.PH0-iJiSg7NVgTtNaLzpGisRGgR8iDcRHINI6q0EK7Q'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgyOTcwOSwiZXhwIjoyMDc4NDA1NzA5fQ.OtYT3SuQgbACbWOR6hHAEsKNqkUhMEOcb7d-QqSnXTc'

console.log('🔍 调试 Supabase 配置...')

// 验证密钥格式
function decodeJWT(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT format')

    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (err) {
    console.log('❌ JWT 解析失败:', err.message)
    return null
  }
}

console.log('\n📋 Anon Key 分析:')
const anonDecoded = decodeJWT(anonKey)
if (anonDecoded) {
  console.log('- Role:', anonDecoded.role)
  console.log('- Project:', anonDecoded.iss)
  console.log('- Expires:', new Date(anonDecoded.exp * 1000).toLocaleString())
  console.log('- Valid:', anonDecoded.exp > Date.now() / 1000)
}

console.log('\n📋 Service Key 分析:')
const serviceDecoded = decodeJWT(serviceKey)
if (serviceDecoded) {
  console.log('- Role:', serviceDecoded.role)
  console.log('- Project:', serviceDecoded.iss)
  console.log('- Expires:', new Date(serviceDecoded.exp * 1000).toLocaleString())
  console.log('- Valid:', serviceDecoded.exp > Date.now() / 1000)
}

// 测试不同的客户端配置
console.log('\n🧪 测试客户端配置...')

const configs = [
  { name: 'Anon 客户端', key: anonKey },
  { name: 'Service 客户端', key: serviceKey }
]

for (const config of configs) {
  console.log(`\n📋 测试 ${config.name}:`)

  try {
    const client = createClient(supabaseUrl, config.key)
    console.log('✅ 客户端创建成功')

    // 测试系统信息查询
    console.log('🔍 测试系统信息查询...')
    const { data, error } = await client
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5)

    if (error) {
      console.log('❌ 系统表查询失败:', error.code, '-', error.message)
    } else {
      console.log('✅ 系统表查询成功:', data)
    }

    // 测试 comments 表
    console.log('🔍 测试 comments 表...')
    const { data: commentsData, error: commentsError } = await client
      .from('comments')
      .select('count', { count: 'exact', head: true })

    if (commentsError) {
      console.log('❌ comments 表查询失败:', commentsError.code, '-', commentsError.message)

      // 尝试列出所有表
      console.log('🔍 尝试列出所有可访问的表...')
      const { data: tablesData, error: tablesError } = await client
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10)

      if (tablesError) {
        console.log('❌ information_schema 查询失败:', tablesError.code, '-', tablesError.message)
      } else {
        console.log('✅ information_schema 查询成功:', tablesData)
      }
    } else {
      console.log('✅ comments 表查询成功! 评论数:', commentsData)

      // 测试插入
      console.log('🧪 测试插入评论...')
      const { data: insertData, error: insertError } = await client
        .from('comments')
        .insert({
          author: `${config.name} 测试`,
          email: `${config.name.toLowerCase().replace(' ', '-')}@test.com`,
          content: `通过 ${config.name} 插入的测试评论`,
          game_id: 'steal-brainrot',
          status: 'approved',
          ip_address: '127.0.0.1'
        })
        .select()

      if (insertError) {
        console.log('❌ 插入失败:', insertError.code, '-', insertError.message)
      } else {
        console.log('✅ 插入成功! ID:', insertData[0].id)
      }
    }

  } catch (err) {
    console.log('❌ 客户端操作失败:', err.message)
  }
}