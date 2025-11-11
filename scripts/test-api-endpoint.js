async function testCommentAPI() {
  try {
    console.log('🧪 测试评论 API 接口...')

    // 测试数据
    const testComment = {
      author: 'API 测试用户',
      email: 'api-test@example.com',
      content: '这是一条通过 API 接口提交的测试评论',
      game_id: 'steal-brainrot'
    }

    // 发送 POST 请求到评论接口
    const response = await fetch('http://localhost:3000/api/make-comment.ajax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testComment)
    })

    console.log('📤 API 响应状态:', response.status)
    console.log('📤 API 响应头:', Object.fromEntries(response.headers.entries()))

    const result = await response.text()
    console.log('📤 API 响应内容:', result)

    if (response.ok) {
      console.log('✅ API 接口测试成功!')
    } else {
      console.log('❌ API 接口测试失败!')
    }

  } catch (error) {
    console.error('❌ API 测试出错:', error.message)
  }
}

testCommentAPI()