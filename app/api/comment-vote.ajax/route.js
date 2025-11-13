import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const body = await request.json()
    const { comment_id, vote_type } = body

    console.log('🗳️ 处理投票请求:', { comment_id, vote_type })

    if (!comment_id || !vote_type || !['like', 'dislike'].includes(vote_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    // 获取当前评论的投票数
    const { data: comment } = await supabaseAdmin
      .from('comments')
      .select('like_count, dislike_count')
      .eq('id', comment_id)
      .single()

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    // 根据投票类型增加对应的计数
    const updateData = vote_type === 'like'
      ? { like_count: (comment.like_count || 0) + 1 }
      : { dislike_count: (comment.dislike_count || 0) + 1 }

    // 更新评论表中的投票计数
    const { data: updatedComment } = await supabaseAdmin
      .from('comments')
      .update(updateData)
      .eq('id', comment_id)
      .select('like_count, dislike_count')
      .single()

    return NextResponse.json({
      success: true,
      counts: {
        like: updatedComment.like_count,
        dislike: updatedComment.dislike_count
      }
    })

  } catch (error) {
    console.error('❌ 投票 API 错误:', error)
    return NextResponse.json(
      { success: false, error: '处理投票失败' },
      { status: 500 }
    )
  }
}