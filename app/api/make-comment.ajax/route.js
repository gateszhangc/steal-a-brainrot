import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Supabase is not configured. Set the required environment variables to enable comments.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      author,
      email,
      content,
      parent_id = 0,
      game_id = 'steal-brainrot'
    } = body

    console.log('📝 创建评论:', { author, email, content: content?.substring(0, 50) + '...', parent_id, game_id })

    // 验证必填字段
    if (!author || !email || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '邮箱格式无效' },
        { status: 400 }
      )
    }

    // 插入评论到数据库
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        author: author.trim(),
        email: email.toLowerCase().trim(),
        content: content.trim(),
        parent_id: parent_id,
        game_id,
        status: 'approved', // 直接设置为已批准状态
        ip_address: request.headers.get('x-forwarded-for') || request.ip
        // user_agent: request.headers.get('user-agent') // 暂时注释，等待数据库表结构更新
      })
      .select()
      .single()

    if (error) {
      console.error('❌ 保存评论失败:', error)
      return NextResponse.json(
        { success: false, error: '保存评论失败' },
        { status: 500 }
      )
    }

    console.log('✅ 评论创建成功:', { id: data.id, author: data.author })

    return NextResponse.json({
      success: true,
      comment: {
        id: data.id,
        author: data.author,
        content: data.content,
        date: new Date(data.created_at).toLocaleDateString(),
        status: data.status,
        parent_id: data.parent_id
      }
    })

  } catch (error) {
    console.error('❌ API 错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
