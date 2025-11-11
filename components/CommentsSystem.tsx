'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: number
  author: string
  content: string
  date: string
  like_count: number
  dislike_count: number
  parent_id: number
  replies?: Comment[]
}

interface CommentForm {
  author: string
  email: string
  content: string
  parent_id: number
}

interface CommentsSystemProps {
  gameId?: string
}

export default function CommentsSystem({ gameId = 'steal-brainrot' }: CommentsSystemProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [showForm, setShowForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const [form, setForm] = useState<CommentForm>({
    author: '',
    email: '',
    content: '',
    parent_id: 0
  })

  // 加载评论
  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/comments.ajax?game_id=${gameId}&page=${page}&limit=5&sort=${sort}`
      )
      const data = await response.json()

      if (data.success) {
        setComments(data.comments)
        setTotalPages(data.pagination.totalPages)
      } else {
        console.error('加载评论失败:', data.error)
      }
    } catch (error) {
      console.error('加载评论错误:', error)
    } finally {
      setLoading(false)
    }
  }

  // 提交评论
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.author || !form.email || !form.content) {
      alert('请填写所有必填字段')
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      alert('请输入有效的邮箱地址')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/make-comment.ajax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          game_id: gameId
        })
      })

      const data = await response.json()

      if (data.success) {
        // 重置表单
        setForm({ author: '', email: '', content: '', parent_id: 0 })
        setShowForm(false)
        setReplyingTo(null)

        // 重新加载评论
        loadComments()
        alert('评论提交成功！')
      } else {
        alert('提交失败: ' + data.error)
      }
    } catch (error) {
      console.error('提交评论错误:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 投票功能
  const handleVote = async (commentId: number, voteType: 'like' | 'dislike') => {
    try {
      const response = await fetch('/api/comment-vote.ajax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment_id: commentId,
          vote_type: voteType
        })
      })

      const data = await response.json()

      if (data.success) {
        // 更新评论计数
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                like_count: data.counts.like,
                dislike_count: data.counts.dislike
              }
            }
            // 更新回复中的计数
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, like_count: data.counts.like, dislike_count: data.counts.dislike }
                    : reply
                )
              }
            }
            return comment
          })
        )
      } else {
        console.error('投票失败:', data.error)
      }
    } catch (error) {
      console.error('投票错误:', error)
    }
  }

  // 开始回复
  const startReply = (commentId: number, authorName: string) => {
    setReplyingTo(commentId)
    setForm(prev => ({ ...prev, parent_id: commentId, content: '' }))
    setShowForm(true)
  }

  // 页面加载时获取评论
  useEffect(() => {
    loadComments()
  }, [gameId, page, sort])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">加载评论中...</div>
      </div>
    )
  }

  return (
    <div className="comments-system max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">评论 ({comments.length})</h3>

          {/* 控制栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showForm ? '取消' : '发表评论'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">排序:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'newest' | 'oldest' | 'popular')}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">最新</option>
                <option value="oldest">最早</option>
                <option value="popular">最热门</option>
              </select>
            </div>
          </div>

          {/* 评论表单 */}
          {showForm && (
            <form onSubmit={submitComment} className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="姓名 *"
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="邮箱 *"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <textarea
                placeholder={
                  replyingTo
                    ? `回复评论...`
                    : "写下你的评论..."
                }
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
              <div className="flex items-center justify-end mt-4 space-x-3">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null)
                      setForm(prev => ({ ...prev, parent_id: 0, content: '' }))
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    取消回复
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? '提交中...' : '提交评论'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 评论列表 */}
        <div className="p-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无评论，来发表第一条评论吧！
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                      </div>

                      <div className="text-gray-800 mb-3 whitespace-pre-wrap">{comment.content}</div>

                      {/* 投票和操作按钮 */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVote(comment.id, 'like')}
                            className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <span>👍</span>
                            <span>{comment.like_count}</span>
                          </button>
                          <button
                            onClick={() => handleVote(comment.id, 'dislike')}
                            className="flex items-center space-x-1 px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <span>👎</span>
                            <span>{comment.dislike_count}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => startReply(comment.id, comment.author)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          回复
                        </button>
                      </div>

                      {/* 回复列表 */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200">
                          {comment.replies.map((reply) => (
                            <div key={reply.id}>
                              <div className="flex items-start space-x-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900">{reply.author}</span>
                                      <span className="text-sm text-gray-500">{reply.date}</span>
                                    </div>
                                  </div>

                                  <div className="text-gray-800 mb-2 whitespace-pre-wrap">{reply.content}</div>

                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleVote(reply.id, 'like')}
                                      className="flex items-center space-x-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                      <span>👍</span>
                                      <span>{reply.like_count}</span>
                                    </button>
                                    <button
                                      onClick={() => handleVote(reply.id, 'dislike')}
                                      className="flex items-center space-x-1 px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                      <span>👎</span>
                                      <span>{reply.dislike_count}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                上一页
              </button>
              <span className="text-sm text-gray-600">
                第 {page} 页，共 {totalPages} 页
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}