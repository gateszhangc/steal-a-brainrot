# 游戏页面复刻状态跟踪

本文档跟踪首页iframe右边和下边游戏列表中所有游戏的复刻状态。

## 复刻状态说明
- ✅ 已完成：页面已成功复刻并验证
- ⏳ 进行中：正在复刻
- ❌ 未完成：尚未开始复刻

## 游戏列表（共31个）

### 右侧游戏列表

| # | 游戏名称 | URL Slug | 状态 | 备注 |
|---|---------|----------|------|------|
| 1 | Steal Brainrot Online | `/steal-brainrot-online` | ✅ 已完成 | 已有页面和数据文件 |
| 2 | Xlope | `/xlope` | ✅ 已完成 | 已有页面和数据文件 |
| 3 | Los Bros in Steal a Brainrot | `/los-bros-in-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 4 | Plants vs Brainrots | `/plants-vs-brainrots` | ✅ 已完成 | 已有页面和数据文件 |
| 5 | 2v2.io | `/2v2io` | ✅ 已完成 | 已有页面和数据文件 |
| 6 | Mr Flips | `/mr-flips` | ✅ 已完成 | 已有页面和数据文件 |
| 7 | Growden.io | `/growdenio` | ✅ 已完成 | 已有页面和数据文件 |
| 8 | Ragdoll Playground | `/ragdoll-playground` | ✅ 已完成 | 已有页面和数据文件 |
| 9 | 67 Clicker | `/67-clicker` | ✅ 已完成 | 已有页面和数据文件 |
| 10 | Steal A Brainrot Unblocked | `/steal-a-brainrot-unblocked` | ✅ 已完成 | 已有页面和数据文件 |
| 11 | Slope Rider | `/slope-rider` | ✅ 已完成 | 已有页面和数据文件 |
| 12 | Stumble Guys | `/stumble-guys` | ✅ 已完成 | 已有页面和数据文件 |
| 13 | Merge Rot | `/merge-rot` | ✅ 已完成 | 已有页面和数据文件 |
| 14 | Steal A Brainrot Roblox | `/steal-a-brainrot-roblox` | ✅ 已完成 | 已有页面和数据文件 |
| 15 | Steal A Brainrot 2 | `/steal-a-brainrot-2` | ✅ 已完成 | 已有页面和数据文件 |
| 16 | Steal Brainrot: New Animals | `/steal-brainrot-new-animals` | ✅ 已完成 | 已有页面和数据文件 |

### 下方游戏列表（额外游戏）

| # | 游戏名称 | URL Slug | 状态 | 备注 |
|---|---------|----------|------|------|
| 17 | Guest 666 Steal a Brainrot | `/guest-666-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 18 | Obby: Grow a Garden | `/obby-grow-a-garden` | ✅ 已完成 | 已有页面和数据文件 |
| 19 | The New Steal Brainrot Super Clicker | `/the-new-steal-brainrot-super-clicker` | ✅ 已完成 | 已有页面和数据文件 |
| 20 | Escape Drive | `/escape-drive` | ✅ 已完成 | 已有页面和数据文件 |
| 21 | Speed per Click: Obby | `/speed-per-click-obby` | ✅ 已完成 | 已有页面和数据文件 |
| 22 | La Casa Boo Steal a Brainrot | `/la-casa-boo-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 23 | Mad Racers | `/mad-racers` | ✅ 已完成 | 已有页面和数据文件 |
| 24 | Trade Or Grow A Brainrot | `/trade-or-grow-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 25 | Steal a Brainrot: 99 Nights In The Forest | `/steal-a-brainrot-99-nights-in-the-forest` | ✅ 已完成 | 已有页面和数据文件 |
| 26 | Steal It All | `/steal-it-all` | ✅ 已完成 | 已有页面和数据文件 |
| 27 | Geometry Dash | `/geometry-dash` | ✅ 已完成 | 已有页面和数据文件 |
| 28 | Halloween Base Steal a Brainrot | `/halloween-base-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 29 | Lucky Block Steal a Brainrot | `/lucky-block-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 30 | Steal Brainrots | `/steal-brainrots` | ✅ 已完成 | 已有页面和数据文件 |
| 31 | Plants vs Zombies Replanted | `/plants-vs-zombies-replanted` | ✅ 已完成 | 已有页面和数据文件 |

## 复刻进度统计
- 总计：31个游戏
- 已完成：31个 (100%)
- 未完成：0个 (0%)

## 🎉 项目完成
所有游戏页面复刻工作已全部完成！按照REPLICATION.md标准流程，成功复刻了所有31个游戏页面。

## 复刻流程（参考REPLICATION.md）

对于每个游戏页面，按以下步骤进行复刻：

1. **获取原始HTML**
   ```powershell
   (Invoke-WebRequest -Uri https://steal-brainrot.io/[slug] -UseBasicParsing).Content | Out-File steal-brainrot_[slug].html -Encoding utf8
   ```

2. **提取head和body片段**
   ```bash
   node scripts/extractHtml[GameName].js
   ```

3. **创建Next.js页面**
   - 在`app/[slug]/`目录下创建`layout.tsx`和`page.tsx`
   - 读取对应的`data/[slug]-head.html`和`data/[slug]-body.html`

4. **生成静态快照**
   ```bash
   node scripts/updateOriginalHtml[GameName].js
   ```

5. **截图对比验证**
   ```bash
   node scripts/captureScreenshots[GameName].js
   node scripts/compareScreenshots.js
   ```

## 下一步行动
按优先级复刻以下游戏（从右侧列表开始）：
1. Xlope
2. Los Bros in Steal a Brainrot
3. Plants vs Brainrots
4. 其他游戏...