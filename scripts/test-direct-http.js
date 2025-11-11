async function testDirectHTTP() {
  const supabaseUrl = 'https://ptukqwqbpjzqpqzvlrle.supabase.co'
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWtxd3FicGp6cXBxenZscmxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjgyOTcwOSwiZXhwIjoyMDc4NDA1NzA5fQ.OtYT3SuQgbACbWOR6hHAEsKNqkUhMEOcb7d-QqSnXTc'

  console.log('🔍 直接通过 HTTP API 测试 Supabase...')

  try {
    // 1. 测试获取表信息
    console.log('\n📋 测试获取 comments 表...')
    const response = await fetch(`${supabaseUrl}/rest/v1/comments?select=count()`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    })

    console.log('状态码:', response.status)
    console.log('响应头:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('响应内容:', responseText)

    if (response.ok) {
      console.log('✅ GET 请求成功!')

      // 2. 测试插入数据
      console.log('\n📝 测试插入评论...')
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          author: 'HTTP API 测试',
          email: 'http-api@example.com',
          content: '通过直接 HTTP API 插入的测试评论',
          game_id: 'steal-brainrot',
          status: 'approved',
          ip_address: '127.0.0.1'
        })
      })

      console.log('插入状态码:', insertResponse.status)
      const insertResult = await insertResponse.text()
      console.log('插入响应:', insertResult)

      if (insertResponse.ok) {
        console.log('✅ 插入成功!')
        const insertedData = JSON.parse(insertResult)
        console.log('插入的数据:', insertedData[0])
      } else {
        console.log('❌ 插入失败')

        // 3. 如果插入失败，尝试列出所有表
        console.log('\n📋 尝试列出所有表...')
        const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`
          }
        })

        if (tablesResponse.ok) {
          console.log('✅ 获取表列表成功')
          const tablesInfo = await tablesResponse.text()
          console.log('可用表信息:', tablesInfo)
        } else {
          console.log('❌ 获取表列表失败')
        }
      }
    } else {
      console.log('❌ GET 请求失败')

      // 尝试获取根路径信息
      console.log('\n📋 测试根路径...')
      const rootResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        }
      })

      console.log('根路径状态码:', rootResponse.status)
      const rootResult = await rootResponse.text()
      console.log('根路径响应:', rootResult)
    }

  } catch (error) {
    console.error('❌ HTTP 测试失败:', error.message)
  }
}

testDirectHTTP()