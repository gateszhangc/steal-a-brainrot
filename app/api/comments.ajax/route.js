import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 5
    const sort = searchParams.get('sort') || 'newest'
    const game_id = searchParams.get('game_id') || 'steal-brainrot'

    // 计算偏移量
    const offset = (page - 1) * limit

    // 构建查询 - 只获取顶级评论 (parent_id = 0)
    let query = supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('game_id', game_id)
      .eq('parent_id', 0) // 只获取顶级评论
      .eq('status', 'approved') // 只获取已批准的评论

    // 排序
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else if (sort === 'popular') {
      query = query.order('like_count', { ascending: false })
    }

    // 分页
    const { data: comments, error, count } = await query
      .range(offset, offset + limit - 1)

    console.log('🔍 查询调试信息:');
    console.log('- game_id:', game_id);
    console.log('- limit:', limit);
    console.log('- offset:', offset);
    console.log('- 查询错误:', error);
    console.log('- 查询结果:', comments);
    console.log('- 总数:', count);

    if (error) {
      console.error('❌ 加载评论失败:', error)
      return NextResponse.json(
        { success: false, error: '加载评论失败' },
        { status: 500 }
      )
    }

    // 获取回复评论
    const commentIds = comments.map(c => c.id)
    let replies = []

    if (commentIds.length > 0) {
      const { data: repliesData } = await supabaseAdmin
        .from('comments')
        .select('*')
        .in('parent_id', commentIds)
        .eq('status', 'approved') // 只获取已批准的回复
        .order('created_at', { ascending: true })

      replies = repliesData || []
    }

    // 组合数据
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      date: new Date(comment.created_at).toLocaleDateString(),
      replies: replies.filter(reply => reply.parent_id === comment.id)
    }))

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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