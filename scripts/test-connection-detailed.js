import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Mjk3MDksImV4cCI6MjA3ODQwNTcwOX0.PH0-iJiSg7NVgTtNaLzpGisRGgR8iDcRHINI6q0EK7Q'

console.log('=== Supabase 连接测试 ===')
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseAnonKey.length)
console.log('Key starts with:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n1. 测试基本连接...')

    // 先测试一个简单的 API 调用
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    console.log('Response:', { data, error })

    if (error) {
      console.log('\n2. 分析错误类型...')
      console.log('Error code:', error.code)
      console.log('Error message:', error.message)
      console.log('Error hint:', error.hint)
      console.log('Error details:', error.details)

      // 尝试列出所有表
      console.log('\n3. 尝试获取表信息...')
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(10)

      console.log('Tables query:', { tables, tablesError })

    } else {
      console.log('✅ 连接成功！')
    }

  } catch (err) {
    console.error('❌ 测试失败:', err)
    console.error('Error type:', typeof err)
    console.error('Error message:', err.message)
  }
}

testConnection()