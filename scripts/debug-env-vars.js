import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// 尝试加载环境变量
config({ path: '.env.local' })

console.log('🔍 调试环境变量加载...')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '存在' : '不存在')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY 长度:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0)
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '存在' : '不存在')
console.log('SUPABASE_SERVICE_ROLE_KEY 长度:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)

// 验证密钥格式
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (anonKey) {
  try {
    const decoded = JSON.parse(atob(anonKey.split('.')[1]))
    console.log('Anon Key 解析:', {
      role: decoded.role,
      iss: decoded.iss,
      exp: new Date(decoded.exp * 1000).toLocaleString()
    })
  } catch (err) {
    console.log('❌ Anon Key 格式错误:', err.message)
  }
}

if (serviceKey) {
  try {
    const decoded = JSON.parse(atob(serviceKey.split('.')[1]))
    console.log('Service Key 解析:', {
      role: decoded.role,
      iss: decoded.iss,
      exp: new Date(decoded.exp * 1000).toLocaleString()
    })
  } catch (err) {
    console.log('❌ Service Key 格式错误:', err.message)
  }
}

// 测试客户端创建
console.log('\n🧪 测试 Supabase 客户端创建...')

try {
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  console.log('✅ Anon 客户端创建成功')

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  console.log('✅ Service 客户端创建成功')

} catch (err) {
  console.log('❌ 客户端创建失败:', err.message)
}