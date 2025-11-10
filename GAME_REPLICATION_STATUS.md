# 游戏页面复刻状态跟踪

本文档跟踪首页iframe右边和下边游戏列表中所有游戏的复刻状态。

## 复刻状态说明
- ✅ 已完成：页面已成功复刻并验证
- ⏳ 进行中：正在复刻
- ❌ 未完成：尚未开始复刻

## 游戏列表（共31个）

根据首页 localhost:3000 中iframe下方的游戏列表提取（通过Chrome DevTools验证），按显示顺序排列：

### 第一行游戏（8个）

| # | 游戏名称 | URL Slug | 状态 | 备注 |
|---|---------|----------|------|------|
| 1 | Dress To Impress | `/dress-to-impress` | ❌ 未完成 | 需要复刻 |
| 2 | Rainbow Friends Return | `/rainbow-friends-return` | ❌ 未完成 | 需要复刻 |
| 3 | Brainrot Alphabet Lore: Musical Merge | `/brainrot-alphabet-lore-musical-merge` | ❌ 未完成 | 需要复刻 |
| 4 | Cowboy Safari | `/cowboy-safari` | ❌ 未完成 | 需要复刻 |
| 5 | 1x1x1x1 Steal a Brainrot | `/1x1x1x1-steal-a-brainrot` | ❌ 未完成 | 需要复刻 |
| 6 | Grow or Trade 99 Nights & FNAF | `/grow-or-trade-99-nights-amp-fnaf` | ❌ 未完成 | 需要复刻 |
| 7 | Guest 666 Steal a Brainrot | `/guest-666-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 8 | Obby: Grow a Garden | `/obby-grow-a-garden` | ✅ 已完成 | 已有页面和数据文件 |

### 第二行游戏（8个）

| # | 游戏名称 | URL Slug | 状态 | 备注 |
|---|---------|----------|------|------|
| 9 | The New Steal Brainrot Super Clicker | `/the-new-steal-brainrot-super-clicker` | ✅ 已完成 | 已有页面和数据文件 |
| 10 | Escape Drive | `/escape-drive` | ✅ 已完成 | 已有页面和数据文件 |
| 11 | Speed per Click: Obby | `/speed-per-click-obby` | ✅ 已完成 | 已有页面和数据文件 |
| 12 | La Casa Boo Steal a Brainrot | `/la-casa-boo-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 13 | Xlope | `/xlope` | ✅ 已完成 | 已有页面和数据文件 |
| 14 | Mad Racers | `/mad-racers` | ✅ 已完成 | 已有页面和数据文件 |
| 15 | Trade Or Grow A Brainrot | `/trade-or-grow-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 16 | Steal a Brainrot: 99 Nights In The Forest | `/steal-a-brainrot-99-nights-in-the-forest` | ✅ 已完成 | 已有页面和数据文件 |

### 页面底部游戏列表（15个）

| # | 游戏名称 | URL Slug | 状态 | 备注 |
|---|---------|----------|------|------|
| 17 | Steal Brainrot Online | `/steal-brainrot-online` | ✅ 已完成 | 已有页面和数据文件 |
| 18 | Los Bros in Steal a Brainrot | `/los-bros-in-steal-a-brainrot` | ✅ 已完成 | 已有页面和数据文件 |
| 19 | Xlope | `/xlope` | ✅ 已完成 | 已有页面和数据文件（重复） |
| 20 | 2v2.io | `/2v2io` | ✅ 已完成 | 已有页面和数据文件 |
| 21 | Plants vs Brainrots | `/plants-vs-brainrots` | ✅ 已完成 | 已有页面和数据文件 |
| 22 | Mr Flips | `/mr-flips` | ✅ 已完成 | 已有页面和数据文件 |
| 23 | Growden.io | `/growdenio` | ✅ 已完成 | 已有页面和数据文件 |
| 24 | Ragdoll Playground | `/ragdoll-playground` | ✅ 已完成 | 已有页面和数据文件 |
| 25 | 67 Clicker | `/67-clicker` | ✅ 已完成 | 已有页面和数据文件 |
| 26 | Steal A Brainrot Unblocked | `/steal-a-brainrot-unblocked` | ✅ 已完成 | 已有页面和数据文件 |
| 27 | Slope Rider | `/slope-rider` | ✅ 已完成 | 已有页面和数据文件 |
| 28 | Stumble Guys | `/stumble-guys` | ✅ 已完成 | 已有页面和数据文件 |
| 29 | Merge Rot | `/merge-rot` | ✅ 已完成 | 已有页面和数据文件 |
| 30 | Steal A Brainrot Roblox | `/steal-a-brainrot-roblox` | ✅ 已完成 | 已有页面和数据文件 |
| 31 | Steal A Brainrot 2 | `/steal-a-brainrot-2` | ✅ 已完成 | 已有页面和数据文件 |
| 32 | Steal Brainrot: New Animals | `/steal-brainrot-new-animals` | ✅ 已完成 | 已有页面和数据文件 |

## 复刻进度统计
- 总计：31个独立游戏（32个链接，其中Xlope重复）
- 已完成：25个 (80.6%)
- 未完成：6个 (19.4%)

## 📊 项目状态
已完成25个游戏页面的复刻工作，还有6个游戏待复刻。

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
需要复刻的游戏（按优先级排序）：
1. Dress To Impress (`/dress-to-impress`) - 首页第一个游戏
2. Rainbow Friends Return (`/rainbow-friends-return`) - 首页第二个游戏
3. Brainrot Alphabet Lore: Musical Merge (`/brainrot-alphabet-lore-musical-merge`)
4. Cowboy Safari (`/cowboy-safari`)
5. 1x1x1x1 Steal a Brainrot (`/1x1x1x1-steal-a-brainrot`)
6. Grow or Trade 99 Nights & FNAF (`/grow-or-trade-99-nights-amp-fnaf`)