// Batch update API paths in all HTML files
import fs from 'fs';
import path from 'path';

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace old API paths with new ones
    const replacements = [
      { old: '/make-comment.ajax', new: '/api/make-comment.ajax' },
      { old: '/comment-vote.ajax', new: '/api/comment-vote.ajax' },
      { old: '/comments.ajax', new: '/api/comments.ajax' },
      { old: '/comment-paging.ajax', new: '/api/comments.ajax' }
    ];

    for (const { old, new: newPath } of replacements) {
      if (content.includes(old)) {
        content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
        modified = true;
        console.log(`✅ 更新 ${filePath} 中的 ${old} -> ${newPath}`);
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错:`, error.message);
    return false;
  }
}

function updateAllFiles() {
  const dataDir = path.join(process.cwd(), 'data');

  console.log('🔄 开始批量更新 API 路径...\n');

  // Get all HTML body files
  const files = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('-body.html'))
    .map(file => path.join(dataDir, file));

  let updatedCount = 0;

  for (const file of files) {
    if (updateFile(file)) {
      updatedCount++;
    }
  }

  console.log(`\n📊 更新完成: ${updatedCount}/${files.length} 个文件已更新`);

  if (updatedCount > 0) {
    console.log('\n🚀 现在重启开发服务器:');
    console.log('npm run dev');
    console.log('\n然后访问网站测试评论功能！');
  } else {
    console.log('\n✅ 所有文件都已使用正确的 API 路径');
  }
}

// Run the update
updateAllFiles();