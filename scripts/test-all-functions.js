// Complete functionality test for the comments system
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase-admin.js';

async function testAllFunctions() {
  console.log('🧪 开始完整功能测试...\n');

  let testResults = {
    databaseConnection: false,
    commentCreation: false,
    commentRetrieval: false,
    votingSystem: false,
    replySystem: false,
    pagination: false,
    sorting: false
  };

  try {
    // 1. 测试数据库连接
    console.log('1. 🔍 测试数据库连接...');
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('comments')
      .select('count')
      .single();

    if (connectionError) {
      console.log('❌ 数据库连接失败:', connectionError.message);
    } else {
      console.log('✅ 数据库连接成功');
      console.log(`📊 当前评论总数: ${connectionTest.count}`);
      testResults.databaseConnection = true;
    }

    // 2. 测试评论创建
    console.log('\n2. 📝 测试评论创建...');
    const testComment = {
      author: '测试用户',
      email: 'test@example.com',
      content: '这是一条测试评论，用于验证评论系统的功能。',
      game_id: 'test-game'
    };

    const { data: createdComment, error: createError } = await supabaseAdmin
      .from('comments')
      .insert(testComment)
      .select()
      .single();

    if (createError) {
      console.log('❌ 评论创建失败:', createError.message);
    } else {
      console.log('✅ 评论创建成功');
      console.log(`📝 评论 ID: ${createdComment.id}`);
      console.log(`👤 作者: ${createdComment.author}`);
      testResults.commentCreation = true;

      // 3. 测试评论检索
      console.log('\n3. 📚 测试评论检索...');
      const { data: retrievedComments, error: retrieveError } = await supabaseAdmin
        .from('comments')
        .select('*')
        .eq('game_id', 'test-game')
        .order('created_at', { ascending: false })
        .limit(5);

      if (retrieveError) {
        console.log('❌ 评论检索失败:', retrieveError.message);
      } else {
        console.log('✅ 评论检索成功');
        console.log(`📊 检索到 ${retrievedComments.length} 条评论`);
        testResults.commentRetrieval = true;
      }

      // 4. 测试回复系统
      console.log('\n4. 💬 测试回复系统...');
      const replyComment = {
        author: '回复用户',
        email: 'reply@example.com',
        content: '这是一条回复评论，测试回复功能。',
        parent_id: createdComment.id,
        game_id: 'test-game'
      };

      const { data: replyData, error: replyError } = await supabaseAdmin
        .from('comments')
        .insert(replyComment)
        .select()
        .single();

      if (replyError) {
        console.log('❌ 回复创建失败:', replyError.message);
      } else {
        console.log('✅ 回复创建成功');
        console.log(`💬 回复 ID: ${replyData.id}`);
        console.log(`🔗 父评论 ID: ${replyData.parent_id}`);
        testResults.replySystem = true;
      }

      // 5. 测试投票系统
      console.log('\n5. 🗳️  测试投票系统...');
      const voteData = {
        comment_id: createdComment.id,
        vote_type: 'like'
      };

      const { data: voteResult, error: voteError } = await supabaseAdmin
        .from('comment_votes')
        .insert(voteData)
        .select()
        .single();

      if (voteError) {
        console.log('❌ 投票失败:', voteError.message);
      } else {
        console.log('✅ 投票成功');
        console.log(`🗳️  投票 ID: ${voteResult.id}`);
        console.log(`👍 投票类型: ${voteResult.vote_type}`);
        testResults.votingSystem = true;

        // 更新评论的点赞数
        await supabaseAdmin
          .from('comments')
          .update({ like_count: 1 })
          .eq('id', createdComment.id);

        // 测试投票查询
        const { data: voteCount } = await supabaseAdmin
          .from('comment_votes')
          .select('vote_type')
          .eq('comment_id', createdComment.id);

        if (voteCount) {
          const likeCount = voteCount.filter(v => v.vote_type === 'like').length;
          const dislikeCount = voteCount.filter(v => v.vote_type === 'dislike').length;
          console.log(`📊 当前投票统计: 👍 ${likeCount} 👎 ${dislikeCount}`);
        }
      }

      // 6. 测试分页
      console.log('\n6. 📄 测试分页功能...');
      const { data: page1, error: page1Error } = await supabaseAdmin
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('game_id', 'test-game')
        .order('created_at', { ascending: false })
        .range(0, 2); // 前3条

      if (page1Error) {
        console.log('❌ 分页测试失败:', page1Error.message);
      } else {
        console.log('✅ 分页功能正常');
        console.log(`📄 第1页: ${page1.length} 条评论`);
        console.log(`📊 总数: ${page1.count || 0} 条`);
        testResults.pagination = true;
      }

      // 7. 测试排序
      console.log('\n7. 🔄 测试排序功能...');

      // 测试按时间排序
      const { data: newestComments } = await supabaseAdmin
        .from('comments')
        .select('created_at')
        .eq('game_id', 'test-game')
        .order('created_at', { ascending: false })
        .limit(3);

      // 测试按受欢迎程度排序
      const { data: popularComments } = await supabaseAdmin
        .from('comments')
        .select('like_count')
        .eq('game_id', 'test-game')
        .order('like_count', { ascending: false })
        .limit(3);

      if (newestComments && popularComments) {
        console.log('✅ 排序功能正常');
        console.log(`🕐 最新评论时间: ${newestComments[0]?.created_at}`);
        console.log(`👍 最高点赞数: ${popularComments[0]?.like_count || 0}`);
        testResults.sorting = true;
      } else {
        console.log('❌ 排序测试失败');
      }

      // 清理测试数据
      console.log('\n🧹 清理测试数据...');

      // 删除测试投票
      await supabaseAdmin
        .from('comment_votes')
        .delete()
        .eq('comment_id', createdComment.id);

      // 删除测试回复
      if (replyData) {
        await supabaseAdmin
          .from('comments')
          .delete()
          .eq('id', replyData.id);
      }

      // 删除测试评论
      await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', createdComment.id);

      console.log('✅ 测试数据清理完成');
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }

  // 输出测试结果
  console.log('\n📋 测试结果总结:');
  console.log('=====================================');

  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ 通过' : '❌ 失败';
    const testName = {
      databaseConnection: '数据库连接',
      commentCreation: '评论创建',
      commentRetrieval: '评论检索',
      votingSystem: '投票系统',
      replySystem: '回复系统',
      pagination: '分页功能',
      sorting: '排序功能'
    }[test];
    console.log(`${testName.padEnd(12)}: ${status}`);
  });

  const passedCount = Object.values(testResults).filter(Boolean).length;
  const totalCount = Object.keys(testResults).length;

  console.log('=====================================');
  console.log(`🎯 总体结果: ${passedCount}/${totalCount} 项测试通过`);

  if (passedCount === totalCount) {
    console.log('🎉 所有测试都通过了！评论系统已准备就绪！');
  } else {
    console.log('⚠️  部分测试失败，请检查相关功能');
  }

  console.log('\n🚀 下一步:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 访问网站测试用户界面');
  console.log('3. 测试完整的用户交互流程');
}

// 运行测试
testAllFunctions();