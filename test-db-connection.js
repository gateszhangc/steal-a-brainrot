// 测试 Supabase 数据库连接
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config({ path: '.env.local' });

console.log('🔧 环境变量检查:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已设置' : '❌ 未设置');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已设置' : '❌ 未设置');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已设置' : '❌ 未设置');

// 手动创建客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('\n🔗 测试 Supabase 连接...');

    // 测试连接
    const { data, error } = await supabaseAdmin.from('comments').select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ 数据库连接失败:', error.message);
      console.error('错误详情:', error);

      // 如果表不存在，显示有用的错误信息
      if (error.code === 'PGRST204') {
        console.log('\n💡 解决方案:');
        console.log('1. 登录 Supabase Dashboard');
        console.log('2. 进入 SQL Editor');
        console.log('3. 复制并运行 supabase/comments_table.sql 中的内容');
        console.log('4. 等待表和策略创建完成');
      }
    } else {
      console.log('✅ 数据库连接成功');
      console.log('📊 评论表当前记录数:', data || 0);
    }

    // 检查表结构
    console.log('\n🔍 检查表结构...');
    const { data: columns, error: columnError } = await supabaseAdmin
      .from('comments')
      .select('*')
      .limit(1);

    if (columnError) {
      console.error('❌ 表结构检查失败:', columnError.message);
    } else if (columns && columns.length > 0) {
      console.log('✅ 表结构正常，字段:', Object.keys(columns[0]));
    } else {
      console.log('ℹ️ 表为空，无法检查字段');
    }

    // 检查投票表
    console.log('\n🗳️ 检查投票表...');
    const { data: votesData, error: votesError } = await supabaseAdmin
      .from('comment_votes')
      .select('count', { count: 'exact', head: true });

    if (votesError) {
      console.error('❌ 投票表检查失败:', votesError.message);
    } else {
      console.log('✅ 投票表正常，记录数:', votesData || 0);
    }

  } catch (err) {
    console.error('❌ 测试失败:', err.message);
  }
}

testConnection().then(() => {
  console.log('\n✨ 测试完成');
  process.exit(0);
}).catch((err) => {
  console.error('\n💥 测试异常:', err);
  process.exit(1);
});