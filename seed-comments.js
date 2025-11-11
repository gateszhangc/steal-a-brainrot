// 种子评论数据脚本
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

// 假评论数据
const fakeComments = [
  {
    author: "游戏玩家小明",
    email: "xiaoming@gamer.com",
    content: "这个游戏太好玩了！我玩了一整天都停不下来。画面精美，玩法有趣，强烈推荐给大家！",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.100",
    like_count: 15,
    dislike_count: 2
  },
  {
    author: "休闲玩家",
    email: "casual@player.com",
    content: "虽然游戏不错，但是感觉有点简单了。希望后续能增加更多难度和关卡。",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.101",
    like_count: 8,
    dislike_count: 3
  },
  {
    author: "资深玩家",
    email: "veteran@game.com",
    content: "作为一个老玩家，我觉得这个游戏的新手引导做得很好，上手很快。但是游戏平衡性还有待提高。",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.102",
    like_count: 22,
    dislike_count: 5
  },
  {
    author: "新手玩家",
    email: "newbie@game.com",
    content: "第一次玩这种类型的游戏，感觉很新鲜！游戏教程很清晰，让我很快就掌握了基本操作。",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.103",
    like_count: 12,
    dislike_count: 1
  },
  {
    author: "游戏收藏家",
    email: "collector@games.com",
    content: "我已经收集了所有的角色和道具，游戏内容很丰富。期待后续更新！",
    parent_id: 0,
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.104",
    like_count: 18,
    dislike_count: 0
  }
];

// 回复数据
const fakeReplies = [
  {
    author: "小明粉丝",
    email: "fan@xiaoming.com",
    content: "我也觉得这个游戏很棒！小明说得很对。",
    parent_id: 1, // 回复第一条评论
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.105",
    like_count: 3,
    dislike_count: 0
  },
  {
    author: "游戏爱好者",
    email: "lover@game.com",
    content: "同意休闲玩家的看法，确实可以增加一些挑战性。",
    parent_id: 2, // 回复第二条评论
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.106",
    like_count: 5,
    dislike_count: 1
  },
  {
    author: "新人玩家",
    email: "newcomer@game.com",
    content: "感谢资深玩家的建议，我会继续努力的！",
    parent_id: 3, // 回复第三条评论
    game_id: "steal-brainrot",
    status: "approved",
    ip_address: "192.168.1.107",
    like_count: 7,
    dislike_count: 0
  }
];

async function seedComments() {
  console.log('🌱 开始添加假评论数据...');

  try {
    // 清理现有的假数据（可选）
    console.log('🧹 清理现有假评论...');
    const { error: deleteError } = await supabaseAdmin
      .from('comments')
      .delete()
      .in('game_id', ['steal-brainrot'])
      .neq('author', '首页测试用户'); // 保留测试数据

    if (deleteError) {
      console.log('⚠️ 清理时出现问题:', deleteError.message);
    }

    // 添加主评论
    console.log('📝 添加主评论...');
    for (let i = 0; i < fakeComments.length; i++) {
      const comment = fakeComments[i];

      // 添加时间戳，让评论看起来更真实
      const daysAgo = i * 2; // 每条评论间隔2天
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const { data, error } = await supabaseAdmin
        .from('comments')
        .insert({
          ...comment,
          created_at: createdAt.toISOString(),
          updated_at: createdAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ 插入评论 ${i + 1} 失败:`, error);
      } else {
        console.log(`✅ 插入评论 ${i + 1} 成功: ${comment.author}`);

        // 更新回复数据中的 parent_id（因为自增ID可能不同）
        if (i === 0) fakeReplies[0].parent_id = data.id;
        if (i === 1) fakeReplies[1].parent_id = data.id;
        if (i === 2) fakeReplies[2].parent_id = data.id;
      }
    }

    // 添加回复
    console.log('💬 添加回复评论...');
    for (let i = 0; i < fakeReplies.length; i++) {
      const reply = fakeReplies[i];

      // 回复比主评论晚一些时间
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - (i + 1));

      const { data, error } = await supabaseAdmin
        .from('comments')
        .insert({
          ...reply,
          created_at: createdAt.toISOString(),
          updated_at: createdAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ 插入回复 ${i + 1} 失败:`, error);
      } else {
        console.log(`✅ 插入回复 ${i + 1} 成功: ${reply.author}`);
      }
    }

    // 验证数据
    console.log('\n🔍 验证数据...');
    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('game_id', 'steal-brainrot')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 验证失败:', error);
    } else {
      console.log(`✅ 数据验证成功！总共 ${comments?.length || 0} 条评论`);

      // 显示一些统计信息
      const mainComments = comments?.filter(c => c.parent_id === 0) || [];
      const replyComments = comments?.filter(c => c.parent_id > 0) || [];
      const totalLikes = comments?.reduce((sum, c) => sum + c.like_count, 0) || 0;
      const totalDislikes = comments?.reduce((sum, c) => sum + c.dislike_count, 0) || 0;

      console.log(`📊 统计信息:`);
      console.log(`   - 主评论: ${mainComments.length} 条`);
      console.log(`   - 回复: ${replyComments.length} 条`);
      console.log(`   - 总点赞: ${totalLikes} 个`);
      console.log(`   - 总点踩: ${totalDislikes} 个`);
    }

  } catch (err) {
    console.error('❌ 种子数据插入失败:', err);
  }
}

seedComments().then(() => {
  console.log('\n🎉 假评论数据添加完成！');
  process.exit(0);
}).catch((err) => {
  console.error('\n💥 添加失败:', err);
  process.exit(1);
});