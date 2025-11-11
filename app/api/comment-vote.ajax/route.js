import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const body = await request.json()
    const { comment_id, vote_type } = body

    if (!comment_id || !vote_type || !['like', 'dislike'].includes(vote_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    const clientIP = request.headers.get('x-forwarded-for') || request.ip

    // 检查用户是否已经投过票
    const { data: existingVote } = await supabaseAdmin
      .from('comment_votes')
      .select('*')
      .eq('comment_id', comment_id)
      .eq('ip_address', clientIP)
      .single()

    let voteResult

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // 取消投票
        await supabaseAdmin
          .from('comment_votes')
          .delete()
          .eq('comment_id', comment_id)
          .eq('ip_address', clientIP)

        voteResult = { action: 'removed', vote_type: existingVote.vote_type }
      } else {
        // 更改投票
        await supabaseAdmin
          .from('comment_votes')
          .update({ vote_type })
          .eq('comment_id', comment_id)
          .eq('ip_address', clientIP)

        voteResult = { action: 'changed', from: existingVote.vote_type, to: vote_type }
      }
    } else {
      // 新投票
      await supabaseAdmin
        .from('comment_votes')
        .insert({
          comment_id,
          vote_type,
          ip_address: clientIP
        })

      voteResult = { action: 'added', vote_type }
    }

    // 计算新的投票数
    const { data: votes } = await supabaseAdmin
      .from('comment_votes')
      .select('vote_type')
      .eq('comment_id', comment_id)

    const likeCount = votes?.filter(v => v.vote_type === 'like').length || 0
    const dislikeCount = votes?.filter(v => v.vote_type === 'dislike').length || 0

    // 更新评论表中的投票计数
    await supabaseAdmin
      .from('comments')
      .update({
        like_count: likeCount,
        dislike_count: dislikeCount
      })
      .eq('id', comment_id)

    return NextResponse.json({
      success: true,
      vote_result: voteResult,
      counts: {
        like: likeCount,
        dislike: dislikeCount
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