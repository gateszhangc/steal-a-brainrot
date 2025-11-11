import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgyOTcwOSwiZXhwIjoyMDc4NDA1NzA5fQ.OtYT3SuQgbACbWOR6hHAEsKNqkUhMEOcb7d-QqSnXTc'

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('🔍 检查表权限和 RLS 策略...')

async function checkPermissions() {
  try {
    // 1. 检查 RLS 状态
    console.log('\n📋 检查 RLS 状态...')
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('exec_sql', {
        sql_string: `
          SELECT schemaname, tablename, rowsecurity
          FROM pg_tables
          WHERE tablename IN ('comments', 'comment_votes');
        `
      })

    if (rlsError) {
      console.log('❌ RLS 检查失败，尝试其他方法...')
    } else {
      console.log('✅ RLS 状态:', rlsData)
    }

    // 2. 检查 policies
    console.log('\n📋 检查 RLS Policies...')
    const { data: policiesData, error: policiesError } = await supabase
      .rpc('exec_sql', {
        sql_string: `
          SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
          FROM pg_policies
          WHERE tablename IN ('comments', 'comment_votes');
        `
      })

    if (policiesError) {
      console.log('❌ Policies 检查失败:', policiesError.message)
    } else {
      console.log('✅ RLS Policies:', policiesData)
    }

    // 3. 测试不同操作
    console.log('\n🧪 测试基本操作权限...')

    // 测试 SELECT
    console.log('🔍 测试 SELECT 权限...')
    const { data: selectData, error: selectError } = await supabase
      .from('comments')
      .select('*')
      .limit(1)

    if (selectError) {
      console.log('❌ SELECT 失败:', selectError.code, '-', selectError.message)
    } else {
      console.log('✅ SELECT 成功:', selectData)
    }

    // 测试 COUNT
    console.log('🔍 测试 COUNT 权限...')
    const { data: countData, error: countError } = await supabase
      .from('comments')
      .select('count', { count: 'exact', head: true })

    if (countError) {
      console.log('❌ COUNT 失败:', countError.code, '-', countError.message)
    } else {
      console.log('✅ COUNT 成功:', countData)
    }

    // 测试 INSERT
    console.log('🔍 测试 INSERT 权限...')
    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert({
        author: '权限测试',
        email: 'permission-test@example.com',
        content: '测试 INSERT 权限的评论',
        game_id: 'steal-brainrot',
        status: 'approved',
        ip_address: '127.0.0.1'
      })
      .select()

    if (insertError) {
      console.log('❌ INSERT 失败:', insertError.code, '-', insertError.message)

      // 如果 INSERT 失败，可能是权限问题，尝试修复
      if (insertError.code === 'PGRST205') {
        console.log('\n🔧 尝试修复权限问题...')

        // 暂时禁用 RLS 测试
        console.log('尝试暂时禁用 RLS...')
        const { error: disableRlsError } = await supabase
          .rpc('exec_sql', {
            sql_string: 'ALTER TABLE comments DISABLE ROW LEVEL SECURITY;'
          })

        if (disableRlsError) {
          console.log('❌ 禁用 RLS 失败:', disableRlsError.message)
        } else {
          console.log('✅ RLS 已暂时禁用，重新测试 INSERT...')

          // 重新测试 INSERT
          const { data: retryData, error: retryError } = await supabase
            .from('comments')
            .insert({
              author: '权限测试重试',
              email: 'permission-retry@example.com',
              content: 'RLS 禁用后的测试评论',
              game_id: 'steal-brainrot',
              status: 'approved',
              ip_address: '127.0.0.1'
            })
            .select()

          if (retryError) {
            console.log('❌ 重试 INSERT 仍然失败:', retryError.code, '-', retryError.message)
          } else {
            console.log('✅ 重试 INSERT 成功! ID:', retryData[0].id)
          }

          // 重新启用 RLS
          console.log('重新启用 RLS...')
          await supabase
            .rpc('exec_sql', {
              sql_string: 'ALTER TABLE comments ENABLE ROW LEVEL SECURITY;'
            })
        }
      }
    } else {
      console.log('✅ INSERT 成功! ID:', insertData[0].id)
    }

    // 4. 检查表结构
    console.log('\n📋 检查表结构...')
    const { data: structData, error: structError } = await supabase
      .rpc('exec_sql', {
        sql_string: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = 'comments'
          ORDER BY ordinal_position;
        `
      })

    if (structError) {
      console.log('❌ 表结构检查失败:', structError.message)
    } else {
      console.log('✅ comments 表结构:', structData)
    }

  } catch (err) {
    console.error('❌ 权限检查出错:', err)
  }
}

checkPermissions()