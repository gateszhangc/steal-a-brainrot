// Test script to verify Supabase database setup
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase-admin.js';

if (!supabaseAdmin) {
  console.error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
  process.exit(1);
}

async function testDatabaseSetup() {
  console.log('🔍 测试 Supabase 数据库设置...\n');

  try {
    // 测试连接
    console.log('1. 测试数据库连接...');
    const { data, error } = await supabaseAdmin.from('comments').select('count').single();
    if (error) {
      console.error('❌ 数据库连接失败:', error);
      return false;
    }
    console.log('✅ 数据库连接成功');

    // 测试表结构
    console.log('\n2. 验证 comments 表结构...');
    const { data: columns, error: columnError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'comments')
      .eq('table_schema', 'public');

    if (columnError) {
      console.log('ℹ️  无法检查列结构 (可能需要管理员权限)');
    } else {
      const requiredColumns = ['id', 'author', 'email', 'content', 'parent_id', 'game_id', 'status', 'ip_address', 'user_agent', 'like_count', 'dislike_count', 'created_at', 'updated_at'];
      const existingColumns = columns.map(col => col.column_name);

      for (const col of requiredColumns) {
        if (existingColumns.includes(col)) {
          console.log(`✅ 列 ${col} 存在`);
        } else {
          console.log(`❌ 列 ${col} 缺失`);
        }
      }
    }

    // 测试 comment_votes 表
    console.log('\n3. 验证 comment_votes 表...');
    const { data: voteTable, error: voteError } = await supabaseAdmin.from('comment_votes').select('count').single();
    if (voteError) {
      console.log('❌ comment_votes 表不存在或无法访问:', voteError.message);
    } else {
      console.log('✅ comment_votes 表存在且可访问');
    }

    // 测试插入一条测试评论
    console.log('\n4. 测试插入评论...');
    const testComment = {
      author: 'Test User',
      email: 'test@example.com',
      content: 'This is a test comment',
      game_id: 'test-game',
      status: 'approved'
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('comments')
      .insert(testComment)
      .select()
      .single();

    if (insertError) {
      console.error('❌ 插入评论失败:', insertError);
    } else {
      console.log('✅ 成功插入测试评论, ID:', insertData.id);

      // 清理测试数据
      await supabaseAdmin.from('comments').delete().eq('id', insertData.id);
      console.log('✅ 清理测试数据完成');
    }

    // 测试索引
    console.log('\n5. 检查索引...');
    const { data: indexes, error: indexError } = await supabaseAdmin
      .from('pg_indexes')
      .select('indexname')
      .eq('tablename', 'comments');

    if (indexError) {
      console.log('ℹ️  无法检查索引 (可能需要管理员权限)');
    } else {
      const expectedIndexes = ['idx_comments_game_id', 'idx_comments_parent_id', 'idx_comments_status', 'idx_comments_created_at'];
      const existingIndexes = indexes.map(idx => idx.indexname);

      for (const idx of expectedIndexes) {
        if (existingIndexes.includes(idx)) {
          console.log(`✅ 索引 ${idx} 存在`);
        } else {
          console.log(`⚠️  索引 ${idx} 可能不存在`);
        }
      }
    }

    console.log('\n🎉 数据库测试完成!');
    return true;

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    return false;
  }
}

// 运行测试
testDatabaseSetup().then(success => {
  process.exit(success ? 0 : 1);
});
