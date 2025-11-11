// 调试评论API
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testCommentAPI() {
  console.log('🧪 开始测试评论API...');

  const testComment = {
    author: "调试用户",
    email: "debug@example.com",
    content: "这是一条调试评论，测试数据库连接和权限",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: 'approved',
    ip_address: '127.0.0.1',
    user_agent: 'Debug Script'
  };

  try {
    console.log('📝 准备插入评论:', testComment);

    // 尝试插入评论
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert(testComment)
      .select()
      .single();

    if (error) {
      console.error('❌ 数据库插入失败:');
      console.error('错误代码:', error.code);
      console.error('错误详情:', error.details);
      console.error('错误信息:', error.message);
      console.error('完整错误对象:', error);
    } else {
      console.log('✅ 评论插入成功!');
      console.log('插入的评论:', data);
    }

    // 测试查询 - 查询所有评论
    console.log('\n🔍 测试查询评论...');
    const { data: comments, error: queryError } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (queryError) {
      console.error('❌ 查询失败:', queryError);
    } else {
      console.log('✅ 查询成功，找到', comments?.length || 0, '条评论');
      if (comments && comments.length > 0) {
        console.log('最新评论:', comments[0]);
        console.log('所有评论:');
        comments.forEach((comment, index) => {
          console.log(`  ${index + 1}. ID: ${comment.id}, Game: ${comment.game_id}, Author: ${comment.author}, Status: ${comment.status}`);
        });
      }
    }

    // 测试特定 game_id 查询
    console.log('\n🔍 测试查询 comments-demo 的评论...');
    const { data: demoComments, error: demoError } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('game_id', 'comments-demo')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (demoError) {
      console.error('❌ demo评论查询失败:', demoError);
    } else {
      console.log('✅ demo评论查询成功，找到', demoComments?.length || 0, '条评论');
    }

  } catch (err) {
    console.error('❌ 异常错误:', err);
  }
}

testCommentAPI().then(() => {
  console.log('\n✨ 测试完成');
  process.exit(0);
}).catch((err) => {
  console.error('\n💥 测试异常:', err);
  process.exit(1);
});