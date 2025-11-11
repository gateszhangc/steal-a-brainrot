import { createClient } from '@supabase/supabase-js'

// 使用 anon key 测试（这是前端实际会用的配置）
const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Mjk3MDksImV4cCI6MjA3ODQwNTcwOX0.PH0-iJiSg7NVgTtNaLzpGisRGgR8iDcRHINI6q0EK7Q'

console.log('🎯 最终连接测试（使用 Anon Key）')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function finalTest() {
  try {
    console.log('\n📋 测试 1: 查询评论数量...')
    const { data: countData, error: countError } = await supabase
      .from('comments')
      .select('count', { count: 'exact', head: true })

    if (countError) {
      console.log('❌ 查询评论数量失败:', countError)

      if (countError.code === 'PGRST205') {
        console.log('\n🔧 建议解决方案:')
        console.log('1. 访问 Supabase Dashboard: https://supabase.com/dashboard/project/ptukqwqbpjzqpqzvlrle')
        console.log('2. 进入 Table Editor')
        console.log('3. 检查 comments 表是否存在')
        console.log('4. 如果不存在，进入 SQL Editor 执行 supabase/comments_table.sql')
      }
      return
    } else {
      console.log('✅ 评论数量查询成功!')
      console.log('当前评论数:', countData)
    }

    console.log('\n📝 测试 2: 插入一条测试评论...')
    const { data: insertData, error: insertError } = await supabase
      .from('comments')
      .insert({
        author: '最终测试用户',
        email: 'final-test@example.com',
        content: '这是一条最终测试评论，如果看到这条评论说明数据库连接完全正常！🎉',
        game_id: 'steal-brainrot',
        status: 'approved',
        ip_address: '127.0.0.1',
        user_agent: 'Node.js Test Script'
      })
      .select()

    if (insertError) {
      console.log('❌ 插入评论失败:', insertError)

      // 如果是权限问题，检查 RLS 策略
      if (insertError.code === '42501') {
        console.log('\n🔐 权限问题 - 检查 RLS 策略')
        console.log('建议检查 Supabase Dashboard 中的 RLS 策略设置')
      }
    } else {
      console.log('✅ 评论插入成功!')
      console.log('评论详情:')
      console.log('- ID:', insertData[0].id)
      console.log('- 作者:', insertData[0].author)
      console.log('- 内容:', insertData[0].content)
      console.log('- 状态:', insertData[0].status)
      console.log('- 创建时间:', insertData[0].created_at)
    }

    if (insertData && insertData[0]) {
      console.log('\n🔍 测试 3: 查询刚插入的评论...')
      const { data: queryData, error: queryError } = await supabase
        .from('comments')
        .select('*')
        .eq('id', insertData[0].id)
        .single()

      if (queryError) {
        console.log('❌ 查询评论失败:', queryError)
      } else {
        console.log('✅ 评论查询成功!')
        console.log('查询结果:', {
          id: queryData.id,
          author: queryData.author,
          status: queryData.status,
          like_count: queryData.like_count,
          dislike_count: queryData.dislike_count
        })
      }

      console.log('\n🗳️ 测试 4: 测试投票功能...')
      const { data: voteData, error: voteError } = await supabase
        .from('comment_votes')
        .insert({
          comment_id: insertData[0].id,
          ip_address: '127.0.0.1',
          vote_type: 'like'
        })
        .select()

      if (voteError) {
        console.log('❌ 投票插入失败:', voteError)
      } else {
        console.log('✅ 投票插入成功!')
        console.log('投票详情:', voteData[0])
      }
    }

    console.log('\n📊 测试 5: 查询所有已批准的评论...')
    const { data: approvedData, error: approvedError } = await supabase
      .from('comments')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (approvedError) {
      console.log('❌ 查询已批准评论失败:', approvedError)
    } else {
      console.log('✅ 查询成功!')
      console.log('已批准评论数量:', approvedData.length)
      if (approvedData.length > 0) {
        console.log('最新评论:', approvedData[0].author, '-', approvedData[0].content.substring(0, 50) + '...')
      }
    }

    console.log('\n🎉 数据库连接测试完成!')

  } catch (err) {
    console.error('❌ 测试过程中发生错误:', err)
  }
}

finalTest()