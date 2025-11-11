// Test script to verify API endpoints
const http = require('http');
const https = require('https');

const baseUrl = 'http://localhost:3000'; // Adjust if your server runs elsewhere

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testAPIEndpoints() {
  console.log('🔍 测试评论系统 API 端点...\n');

  try {
    // Test 1: 获取评论列表
    console.log('1. 测试 GET /api/comments.ajax');
    try {
      const commentsResponse = await makeRequest(`${baseUrl}/api/comments.ajax?page=1&limit=5&game_id=steal-brainrot`);
      console.log(`状态码: ${commentsResponse.status}`);
      if (commentsResponse.status === 200) {
        console.log('✅ 评论获取 API 正常工作');
        if (commentsResponse.data.success) {
          console.log(`📊 返回 ${commentsResponse.data.comments?.length || 0} 条评论`);
        }
      } else {
        console.log('❌ 评论获取 API 返回错误:', commentsResponse.data);
      }
    } catch (error) {
      console.log('❌ 评论获取 API 请求失败:', error.message);
    }

    console.log('\n2. 测试 POST /api/make-comment.ajax');
    try {
      const commentData = {
        author: 'Test User',
        email: 'test@example.com',
        content: 'This is a test comment for API verification',
        game_id: 'test-game'
      };

      const createResponse = await makeRequest(`${baseUrl}/api/make-comment.ajax`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });

      console.log(`状态码: ${createResponse.status}`);
      if (createResponse.status === 200 && createResponse.data.success) {
        console.log('✅ 评论创建 API 正常工作');
        console.log(`📝 创建评论 ID: ${createResponse.data.comment?.id}`);
      } else {
        console.log('❌ 评论创建 API 返回错误:', createResponse.data);
      }
    } catch (error) {
      console.log('❌ 评论创建 API 请求失败:', error.message);
    }

    console.log('\n3. 测试 POST /api/comment-vote.ajax');
    try {
      const voteData = {
        comment_id: 1, // 假设存在 ID 为 1 的评论
        vote_type: 'like'
      };

      const voteResponse = await makeRequest(`${baseUrl}/api/comment-vote.ajax`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });

      console.log(`状态码: ${voteResponse.status}`);
      if (voteResponse.status === 200 && voteResponse.data.success) {
        console.log('✅ 投票 API 正常工作');
        console.log(`🗳️  投票结果: ${voteResponse.data.vote_result?.action}`);
      } else {
        console.log('❌ 投票 API 返回错误:', voteResponse.data);
      }
    } catch (error) {
      console.log('❌ 投票 API 请求失败:', error.message);
    }

    console.log('\n🎉 API 测试完成!');
    console.log('\n💡 提示:');
    console.log('- 确保服务器在运行 (npm run dev)');
    console.log('- 确保环境变量已正确配置');
    console.log('- 确保数据库表已创建');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testAPIEndpoints();