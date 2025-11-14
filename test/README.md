# 星星评分功能说明

## 已下载的文件

### 核心文件
- `jquery.raty.js` - jQuery Raty 星星评分插件
- `star-rating-demo.html` - 演示页面（对比静态和动态效果）

### 图片资源（raty-images 文件夹）
- `star-off-big.png` - 未选中的星星
- `star-on-big.png` - 选中的星星
- `star-half-big.png` - 半颗星星

## 两种模式对比

### 图1：静态模式（只读）
```javascript
$('#rating-readonly').raty({
    readOnly: true,  // 关键：设置为只读，鼠标悬停时星星不会变化
    score: 4.2,
    half: true
});
```

### 图2：动态模式（可交互）
```javascript
$('#rating-interactive').raty({
    readOnly: false,  // 关键：可交互，鼠标悬停时星星会动态高亮
    score: 4.2,
    half: true,
    click: function(score, evt) {
        // 点击后的回调函数
        console.log('评分：' + score);
    }
});
```

## 关键区别

**readOnly 参数**决定了星星的行为：
- `readOnly: true` → 静态显示，鼠标悬停无效果（图1）
- `readOnly: false` → 动态交互，鼠标悬停会高亮显示（图2）

## 如何使用

1. 在浏览器中打开 `star-rating-demo.html`
2. 对比两种效果：
   - 第一个评分：鼠标悬停时星星不会变化
   - 第二个评分：鼠标悬停时星星会根据位置动态高亮

## 技术来源

这些代码来自 https://steal-brainrot.io/ 网站
使用的是 jQuery Raty 插件实现星星评分功能
