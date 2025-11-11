// 模拟 Next.js API 路由环境
import { createClient } from '@supabase/supabase-js'

console.log('🔍 调试 API 路由环境变量...')

// 检查环境变量
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '存在' : '不存在')

// 加载 .env.local
const fs = await import('fs')
const path = await import('path')

try {
  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  const envPath = path.join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')

  console.log('\n📋 .env.local 文件内容:')
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      // 隐藏敏感信息
      const [key, value] = line.split('=')
      if (value && value.length > 20) {
        console.log(`${key}=${value.substring(0, 20)}...`)
      } else {
        console.log(line)
      }
    }
  })

  // 手动设置环境变量
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key] = value.replace(/^["']|["']$/g, '') // 移除引号
    }
  })

  console.log('\n📋 手动设置后的环境变量:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '存在' : '不存在')

  // 使用设置后的环境变量创建客户端
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('\n🧪 使用手动设置的环境变量测试...')

  // 测试 COUNT
  const { data: countData, error: countError } = await supabase
    .from('comments')
    .select('count', { count: 'exact', head: true })

  console.log('COUNT 测试:', { data: countData, error: countError })

  // 测试 INSERT
  if (!countError) {
    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert({
        author: 'API 调试测试',
        email: 'api-debug@example.com',
        content: '通过 API 调试脚本插入的评论',
        game_id: 'steal-brainrot',
        status: 'approved',
        ip_address: '127.0.0.1'
      })
      .select()

    console.log('INSERT 测试:', { data: insertData, error: insertError })
  }

} catch (err) {
  console.error('❌ 调试失败:', err)
}