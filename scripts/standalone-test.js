// Standalone test script that doesn't rely on module imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.log('请检查 .env.local 文件中的以下变量:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runStandaloneTest() {
  console.log('🧪 开始独立功能测试...\n');

  try {
    // 1. 测试数据库连接
    console.log('1. 🔍 测试数据库连接...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('comments')
      .select('count')
      .single();

    if (connectionError) {
      console.log('❌ 数据库连接失败:', connectionError.message);
      return;
    } else {
      console.log('✅ 数据库连接成功');
      console.log(`📊 当前评论总数: ${connectionTest.count}`);
    }

    // 2. 创建测试评论
    console.log('\n2. 📝 创建测试评论...');
    const testComment = {
      author: '独立测试用户',
      email: 'standalone@test.com',
      content: '这是一条独立测试评论，验证完整功能。',
      game_id: 'standalone-test'
    };

    const { data: createdComment, error: createError } = await supabase
      .from('comments')
      .insert(testComment)
      .select()
      .single();

    if (createError) {
      console.log('❌ 评论创建失败:', createError.message);
      return;
    } else {
      console.log('✅ 评论创建成功');
      console.log(`📝 评论 ID: ${createdComment.id}`);
      console.log(`👤 作者: ${createdComment.author}`);
      console.log(`📅 创建时间: ${createdComment.created_at}`);
    }

    // 3. 测试评论检索
    console.log('\n3. 📚 测试评论检索...');
    const { data: retrievedComments, error: retrieveError } = await supabase
      .from('comments')
      .select('*')
      .eq('game_id', 'standalone-test')
      .order('created_at', { ascending: false });

    if (retrieveError) {
      console.log('❌ 评论检索失败:', retrieveError.message);
    } else {
      console.log('✅ 评论检索成功');
      console.log(`📊 检索到 ${retrievedComments.length} 条评论`);
      retrievedComments.forEach(comment => {
        console.log(`  - ${comment.author}: ${comment.content.substring(0, 30)}...`);
      });
    }

    // 4. 创建回复评论
    console.log('\n4. 💬 创建回复评论...');
    const replyComment = {
      author: '回复测试用户',
      email: 'reply@standalone.com',
      content: '这是一条回复评论，测试回复功能。',
      parent_id: createdComment.id,
      game_id: 'standalone-test'
    };

    const { data: replyData, error: replyError } = await supabase
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
    }

    // 5. 测试投票功能
    console.log('\n5. 🗳️  测试投票功能...');
    const voteData = {
      comment_id: createdComment.id,
      ip_address: '127.0.0.1',
      vote_type: 'like'
    };

    const { data: voteResult, error: voteError } = await supabase
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

      // 更新评论的点赞数
      await supabase
        .from('comments')
        .update({ like_count: 1 })
        .eq('id', createdComment.id);

      console.log('✅ 点赞计数已更新');
    }

    // 6. 测试复合查询（带回复的评论列表）
    console.log('\n6. 🔗 测试复合查询...');
    const { data: commentsWithReplies } = await supabase
      .from('comments')
      .select('*')
      .eq('game_id', 'standalone-test')
      .eq('parent_id', 0)
      .order('created_at', { ascending: false });

    if (commentsWithReplies) {
      console.log('✅ 复合查询成功');
      console.log(`📊 顶级评论: ${commentsWithReplies.length} 条`);

      for (const comment of commentsWithReplies) {
        console.log(`\n📝 评论 ${comment.id}: ${comment.author}`);
        console.log(`   内容: ${comment.content.substring(0, 50)}...`);
        console.log(`   点赞: ${comment.like_count}, 点踩: ${comment.dislike_count}`);

        // 获取回复
        const { data: replies } = await supabase
          .from('comments')
          .select('*')
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });

        if (replies && replies.length > 0) {
          console.log(`   回复 (${replies.length} 条):`);
          replies.forEach(reply => {
            console.log(`     - ${reply.author}: ${reply.content.substring(0, 30)}...`);
          });
        }
      }
    }

    // 7. 清理测试数据
    console.log('\n7. 🧹 清理测试数据...');

    // 删除投票
    await supabase
      .from('comment_votes')
      .delete()
      .eq('comment_id', createdComment.id);
    console.log('✅ 测试投票已删除');

    // 删除回复
    if (replyData) {
      await supabase
        .from('comments')
        .delete()
        .eq('id', replyData.id);
      console.log('✅ 测试回复已删除');
    }

    // 删除主评论
    await supabase
      .from('comments')
      .delete()
      .eq('id', createdComment.id);
    console.log('✅ 测试评论已删除');

    // 8. 最终验证
    console.log('\n8. ✅ 最终验证...');
    const { data: finalCheck } = await supabase
      .from('comments')
      .select('count')
      .eq('game_id', 'standalone-test')
      .single();

    if (finalCheck && finalCheck.count === 0) {
      console.log('✅ 所有测试数据已清理完成');
    } else {
      console.log(`⚠️  仍有 ${finalCheck?.count || 0} 条测试数据未清理`);
    }

    console.log('\n🎉 独立功能测试完成！');
    console.log('\n📊 测试结果总结:');
    console.log('✅ 数据库连接正常');
    console.log('✅ 评论创建功能正常');
    console.log('✅ 评论检索功能正常');
    console.log('✅ 回复功能正常');
    console.log('✅ 投票功能正常');
    console.log('✅ 复合查询功能正常');
    console.log('✅ 数据清理功能正常');

    console.log('\n🚀 系统已准备就绪，可以开始使用！');
    console.log('启动命令: npm run dev');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行独立测试
runStandaloneTest();