#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from playwright.sync_api import sync_playwright
import time
import json

def test_comments():
    print("=" * 50)
    print("U0001f310 访问 http://localhost:3001 并测试评论插入功能")
    print("=" * 50)

    api_requests = []

    def handle_request(request):
        if 'make-comment.ajax' in request.url or '/api/' in request.url:
            api_requests.append({
                'url': request.url,
                'method': request.method,
                'headers': dict(request.headers),
                'post_data': request.post_data
            })
            print(f"📡 API请求: {request.method} {request.url}")
            if request.post_data:
                print(f"   请求数据: {request.post_data}")
        return

    def handle_response(response):
        if 'make-comment.ajax' in response.url or '/api/' in response.url:
            print(f"📥 API响应: {response.status} {response.url}")
            try:
                if response.headers.get('content-type', '').startswith('application/json'):
                    response_data = response.json()
                    print(f"   响应数据: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
                else:
                    print(f"   响应文本: {response.text()[:500]}...")
            except:
                print(f"   响应内容无法解析")

    # 启动浏览器
    browser = sync_playwright.launch(headless=False)
    context = browser.new_page()

    # 监听网络请求
    page.on("request", handle_request)
    page.on("response", handle_response)

    try:
        # 访问页面
        print("🌐 导航到页面...")
        page.goto('http://localhost:3001')
        page.wait_for_load_state('networkidle')

        # 截图保存初始页面状态
        page.screenshot(path='E:/code/steal-a-brainrot/test_screenshots/01_initial_page.png', full_page=True)
        print("📸 已保存初始页面截图")

        # 检查页面内容
        page_title = page.title()
        print(f"📄 页面标题: {page_title}")

        # 检查评论相关的表单元素
        comment_form_selectors = [
            'form[id*="comment"]',
            'form[class*="comment"]',
            '.comment-form',
            '#comment-form',
            'form[action*="comment"]',
            'textarea[name*="comment"]',
            'textarea[id*="comment"]',
            'input[name*="comment"]',
            'input[type="text"]'
        ]

        comment_form = None
        for selector in comment_form_selectors:
            elements = page.locator(selector).all()
            if elements:
                comment_form = elements[0]
                print(f"✅ 找到评论相关元素: {selector} (共{len(elements)}")
                break

        # 查找评论输入框
        comment_textarea = None
        for selector in ['textarea[name*="comment"]', 'textarea[id*="comment"]', 'textarea']:
            element = page.locator(selector).first
            if element.count() > 0:
                comment_textarea = element
                print(f"✅ 找到评论输入框: {selector}")
                break

        # 查找作者输入框
        author_input = None
        for selector in ['input[name*="author"]', 'input[name*="name"]']:
            element = page.locator(selector).first
            if element.count() > 0:
                author_input = element
                print(f"✅ 找到作者输入框: {selector}")
                break

        # 查找邮箱输入框
        email_input = None
        for selector in ['input[name="email"]', 'input[type="email"]':
            element = page.locator(selector).first
            if element.count() > 0:
                email_input = element
                print(f"✅ 找到邮箱输入框: {selector}")
                break

        # 查找提交按钮
        submit_button = None
        for selector in ['button[type="submit"]', 'input[type="submit"]']:
            element = page.locator(selector).first
            if element.count() > 0:
                submit_button = element
                print(f"✅ 找到提交按钮: {selector}")
                break

        # 如果找到表单元素，填写测试数据
        if comment_textarea and author_input and email_input and submit_button:
            print("\n🔧 找到评论表单，准备测试评论功能")

            # 填写作者
            author_input.fill("测试用户")
            print("✅ 已填写作者: 测试用户")

            # 填写邮箱
            email_input.fill("test@example.com")
            print("✅ 已填写邮箱: test@example.com")

            # 填写评论内容
            test_comment = f"This is a test comment, created at: {time.strftime('%Y-%m-%d %H:%M:%S')}"
            comment_textarea.fill(test_comment)
            print(f"✅ 已填写评论内容: {test_comment}")

            # 截图保存填写后的表单
            page.screenshot(path='E:/code/steal-a-brainrot/test_screenshots/02_form_filled.png', full_page=True)
            print("📸 已保存填写后的表单截图")

            # 提交表单
            print("\n🚀 提交评论...")
            submit_button.click()

            # 等待网络请求完成
            print("⏳ 等待服务器响应...")
            time.sleep(3)

            # 截图保存提交后的页面
            page.screenshot(path='E:/code/steal-a-brainrot/test_screenshots/03_after_submit.png', full_page=True)
            print("📸 已保存提交后的页面截图")

            # 检查是否有成功消息或错误消息
            success_messages = [
                "[class*='success']",
                "[id*='success']",
                ".alert-success",
                ".message-success"
            ]

            for selector in success_messages:
                if page.locator(selector).count() > 0:
                    print(f"✅ 找到成功消息: {selector}")
                    print(f"   内容: {page.locator(selector).first.text_content()}")

            error_messages = [
                "[class*='error']",
                "[id*='error']",
                ".alert-error",
                ".message-error"
            ]

            for selector in error_messages:
                if page.locator(selector).count() > 0:
                    print(f"❌ 找到错误消息: {selector}")
                    print(f"   内容: {page.locator(selector).first.text_content()}")

            # 检查是否有评论已成功显示
            print("\n🔍 检查评论是否成功显示...")
            # 这里可以添加逻辑来检查评论是否成功显示

        else:
            print("❌ 未找到评论表单")

    except Exception as e:
        print(f"❌ 测试过程中出现错误: {str(e)}")
        # 即使出错也保存截图
        try:
            page.screenshot(path='E:/code/steal-a-brainrot/test_screenshots/error_screenshot.png', full_page=True)
            print("📸 已保存错误状态截图")
        except:
            pass

    print("\n📊 网络请求统计:")
    print(f"   API请求数量: {len(api_requests)}")

    for i, req in enumerate(api_requests):
        print(f"\n📡 请求 {i+1}:")
        print(f"   URL: {req['url']}")
        print(f"   方法: {req['method']}")
        if req['post_data']:
            print(f"   数据: {req['post_data']}")

    print("\n🔚 保存页面HTML内容")
    page_content = page.content()
    with open('E:/code/steal-a-brainrot/test_screens/page_content.html', 'w', encoding='utf-8') as f:
        f.write(page_content)
        print("📄 已保存页面HTML内容")

    browser.close()
    print("🔚 测试完成")
    print("=" * 50)

if __name__ == "__main__":
    test_comments()