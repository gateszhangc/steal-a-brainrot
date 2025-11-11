import CommentsSystem from '@/components/CommentsSystem'

export default function CommentsDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          评论系统演示
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">欢迎来到评论系统演示</h2>
          <p className="text-gray-600 mb-4">
            这是一个基于 Supabase 的评论系统演示。您可以：
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>发表新评论</li>
            <li>回复其他用户的评论</li>
            <li>对评论进行点赞或点踩</li>
            <li>按最新、最早或最热门排序</li>
            <li>分页浏览评论</li>
          </ul>
        </div>

        <CommentsSystem gameId="comments-demo" />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>此演示使用 Next.js 14 + Supabase 构建</p>
          <p>所有评论数据都存储在 Supabase 云数据库中</p>
        </div>
      </div>
    </div>
  )
}