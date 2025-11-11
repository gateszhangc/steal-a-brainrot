from playwright.sync_api import sync_playwright
import time

def test_comments_system():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # 设置为非 headless 模式以便观察
        page = browser.new_page()

        print("🚀 开始测试评论系统...")

        # 访问首页
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        print("✅ 首页加载完成")

        # 截图查看页面状态
        page.screenshot(path='test-screenshots/01-homepage.png', full_page=True)
        print("📸 首页截图已保存")

        # 查找评论相关元素
        print("🔍 查找评论系统元素...")

        # 检查是否存在评论表单或评论容器
        comment_elements = page.locator('[class*="comment"], [id*="comment"], textarea[name*="comment"], input[name*="comment"]').all()
        print(f"找到 {len(comment_elements)} 个评论相关元素")

        # 如果找到评论输入框，测试评论提交
        if comment_elements:
            # 查找评论输入相关元素
            author_input = page.locator('input[name*="author"], input[placeholder*="姓名"], input[placeholder*="name"]').first
            email_input = page.locator('input[type="email"], input[name*="email"], input[placeholder*="邮箱"], input[placeholder*="email"]').first
            content_textarea = page.locator('textarea, [name*="content"], [placeholder*="评论"], [placeholder*="content"]').first
            submit_button = page.locator('button:has-text("提交"), button:has-text("发表"), button:has-text("发送"), input[type="submit"]').first

            # 尝试填写评论表单
            try:
                if author_input.count() > 0:
                    author_input.fill("Playwright测试用户")
                    print("✅ 填写作者姓名")

                if email_input.count() > 0:
                    email_input.fill("test@playwright.com")
                    print("✅ 填写邮箱")

                if content_textarea.count() > 0:
                    content_textarea.fill("这是通过 Playwright 自动化测试提交的评论！测试时间: " + time.strftime('%Y-%m-%d %H:%M:%S'))
                    print("✅ 填写评论内容")

                if submit_button.count() > 0:
                    submit_button.click()
                    print("✅ 点击提交按钮")
                    page.wait_for_timeout(2000)

                    # 截图记录提交后的状态
                    page.screenshot(path='test-screenshots/02-after-submit.png', full_page=True)
                    print("📸 提交后截图已保存")

            except Exception as e:
                print(f"❌ 填写表单时出错: {e}")

        # 查找现有评论并测试投票功能
        print("🔍 查找现有评论...")
        like_buttons = page.locator('button:has-text("👍"), button:has-text("赞"), button[class*="like"]').all()
        dislike_buttons = page.locator('button:has-text("👎"), button:has-text("踩"), button[class*="dislike"]').all()

        print(f"找到 {len(like_buttons)} 个点赞按钮，{len(dislike_buttons)} 个点踩按钮")

        # 如果找到点赞按钮，测试投票
        if like_buttons:
            try:
                like_buttons[0].click()
                print("✅ 点击第一个点赞按钮")
                page.wait_for_timeout(1000)
                page.screenshot(path='test-screenshots/03-after-like.png', full_page=True)
                print("📸 点赞后截图已保存")
            except Exception as e:
                print(f"❌ 点赞时出错: {e}")

        # 查找回复按钮
        reply_buttons = page.locator('button:has-text("回复"), button[class*="reply"]').all()
        print(f"找到 {len(reply_buttons)} 个回复按钮")

        # 如果找到回复按钮，测试回复功能
        if reply_buttons:
            try:
                reply_buttons[0].click()
                print("✅ 点击第一个回复按钮")
                page.wait_for_timeout(1000)

                # 查找回复输入框
                reply_textarea = page.locator('textarea').last
                if reply_textarea.count() > 0:
                    reply_textarea.fill("这是 Playwright 自动化的回复评论！")
                    print("✅ 填写回复内容")

                    # 查找回复提交按钮
                    reply_submit = page.locator('button:has-text("提交"), button:has-text("发送"), button:has-text("回复")').last
                    if reply_submit.count() > 0:
                        reply_submit.click()
                        print("✅ 提交回复")
                        page.wait_for_timeout(2000)

                        page.screenshot(path='test-screenshots/04-after-reply.png', full_page=True)
                        print("📸 回复后截图已保存")

            except Exception as e:
                print(f"❌ 回复时出错: {e}")

        # 检查网络请求
        print("🔍 检查网络请求...")
        with page.expect_response("**/api/comments.ajax**") as response_info:
            pass  # 等待任意评论相关的API请求

        # 获取页面内容进行分析
        content = page.content()
        print("📄 页面HTML内容长度:", len(content))

        # 检查是否有评论相关的JavaScript
        if "comments" in content.lower():
            print("✅ 页面包含评论相关代码")

        # 最终截图
        page.screenshot(path='test-screenshots/05-final.png', full_page=True)
        print("📸 最终截图已保存")

        browser.close()
        print("✨ 测试完成！")

if __name__ == "__main__":
    import os
    os.makedirs("test-screenshots", exist_ok=True)
    test_comments_system()