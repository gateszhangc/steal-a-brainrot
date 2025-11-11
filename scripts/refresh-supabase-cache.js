import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgyOTcwOSwiZXhwIjoyMDc4NDA1NzA5fQ.OtYT3SuQgbACbWOR6hHAEsKNqkUhMEOcb7d-QqSnXTc'

// 创建具有管理权限的客户端
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function refreshCache() {
  try {
    console.log('🔄 尝试刷新 Supabase 缓存...')

    // 方法1: 尝试重新构建模式缓存
    console.log('📋 方法1: 重新加载模式...')
    const { data: reloadData, error: reloadError } = await supabase
      .rpc('reload_schema_cache')

    if (reloadError) {
      console.log('❌ reload_schema_cache 失败:', reloadError.message)
    } else {
      console.log('✅ 模式缓存重新加载成功')
    }

    // 方法2: 测试直接连接
    console.log('\n📋 方法2: 测试直接表访问...')
    const { data: tableData, error: tableError } = await supabase
      .from('comments')
      .select('*')
      .limit(1)

    if (tableError) {
      console.log('❌ 直接表访问失败:', tableError)

      // 方法3: 使用 SQL 查询
      console.log('\n📋 方法3: 使用 SQL 直接查询...')
      const { data: sqlData, error: sqlError } = await supabase
        .rpc('exec_sql', {
          sql_string: 'SELECT COUNT(*) as count FROM comments;'
        })

      if (sqlError) {
        console.log('❌ SQL 查询失败:', sqlError.message)

        // 方法4: 检查系统表
        console.log('\n📋 方法4: 检查系统表...')
        const { data: sysData, error: sysError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
          .eq('tablename', 'comments')

        if (sysError) {
          console.log('❌ 系统表查询失败:', sysError.message)
          console.log('\n🔧 建议手动解决方案:')
          console.log('1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/ptukqwqbpjzqpqzvlrle')
          console.log('2. 进入 Settings > API')
          console.log('3. 点击 "Reset project key" 或 "Reset database password"')
          console.log('4. 或者进入 SQL Editor 执行: SELECT 1;')
        } else {
          console.log('✅ 系统表查询结果:', sysData)
        }
      } else {
        console.log('✅ SQL 查询成功:', sqlData)
      }
    } else {
      console.log('✅ 直接表访问成功!')
      console.log('数据:', tableData)

      // 测试插入
      console.log('\n🧪 测试插入评论...')
      const { data: insertData, error: insertError } = await supabase
        .from('comments')
        .insert({
          author: '缓存刷新测试',
          email: 'cache-refresh@example.com',
          content: '通过缓存刷新脚本插入的测试评论',
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
    console.error('❌ 刷新缓存时出错:', err)
  }
}

refreshCache()