async function testWebpageComment() {
  console.log('🌐 测试网页页面评论功能...')

  // 当前服务器运行在 3001 端口
  const serverUrl = 'http://localhost:3001'
  const apiUrl = `${serverUrl}/api/make-comment.ajax`

  console.log('服务器地址:', serverUrl)
  console.log('API 地址:', apiUrl)

  try {
    // 1. 检查服务器是否运行
    console.log('\n1️⃣ 检查服务器状态...')
    const serverResponse = await fetch(serverUrl)
    console.log('服务器响应状态:', serverResponse.status)

    if (!serverResponse.ok) {
      console.log('❌ 服务器未运行或不正常')
      return
    }

    // 2. 获取页面内容，检查是否有评论表单
    console.log('\n2️⃣ 检查页面是否有评论表单...')
    const pageContent = await serverResponse.text()

    const hasCommentForm = pageContent.includes('comment_form') ||
                         pageContent.includes('comment_content') ||
                         pageContent.includes('make-comment')

    if (hasCommentForm) {
      console.log('✅ 页面包含评论表单')
    } else {
      console.log('❌ 页面未找到评论表单')
      console.log('页面内容片段:', pageContent.substring(0, 500))
    }

    // 3. 直接测试 API 接口（模拟表单提交）
    console.log('\n3️⃣ 测试评论 API 接口...')

    const commentData = {
      author: '网页测试用户',
      email: 'webpage-test@example.com',
      content: '这是一条通过脚本模拟网页表单提交的测试评论，用于验证网页评论功能是否正常工作',
      game_id: 'steal-brainrot'
    }

    console.log('提交数据:', commentData)

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Webpage Test Script)',
        'X-Forwarded-For': '127.0.0.1',
        'Referer': serverUrl
      },
      body: JSON.stringify(commentData)
    })

    console.log('API 响应状态:', apiResponse.status)
    console.log('API 响应头:', Object.fromEntries(apiResponse.headers.entries()))

    const apiResult = await apiResponse.text()
    console.log('API 响应内容:', apiResult)

    if (apiResponse.ok) {
      try {
        const parsedResult = JSON.parse(apiResult)
        console.log('✅ API 调用成功!')
        console.log('返回的评论数据:', parsedResult)
      } catch (err) {
        console.log('⚠️ API 返回的不是有效的 JSON')
      }
    } else {
      console.log('❌ API 调用失败')
    }

    // 4. 检查是否有评论相关的 JavaScript 代码
    console.log('\n4️⃣ 检查页面 JavaScript 代码...')

    const hasCommentJS = pageContent.includes('make-comment.ajax') ||
                        pageContent.includes('comment_form') ||
                        pageContent.includes('comment_content')

    if (hasCommentJS) {
      console.log('✅ 页面包含评论相关的 JavaScript 代码')
    } else {
      console.log('⚠️ 页面可能缺少评论相关的 JavaScript 代码')
    }

    // 5. 生成测试报告
    console.log('\n📋 测试报告:')
    console.log('- 服务器状态:', serverResponse.ok ? '✅ 正常' : '❌ 异常')
    console.log('- 页面评论表单:', hasCommentForm ? '✅ 存在' : '❌ 缺失')
    console.log('- API 接口:', apiResponse.ok ? '✅ 正常' : '❌ 异常')
    console.log('- JavaScript 代码:', hasCommentJS ? '✅ 存在' : '❌ 缺失')

    if (serverResponse.ok && apiResponse.ok) {
      console.log('\n🎉 网页评论功能基本正常!')
      console.log('📱 可以在浏览器中访问', serverUrl, '进行手动测试')
    } else {
      console.log('\n⚠️ 网页评论功能可能存在问题，需要进一步检查')
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message)
    console.log('\n🔧 可能的解决方案:')
    console.log('1. 确保开发服务器正在运行 (npm run dev)')
    console.log('2. 检查服务器端口是否正确')
    console.log('3. 验证 API 路由是否存在')
  }
}

testWebpageComment()