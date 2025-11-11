#!/usr/bin/env python3
"""
测试 localhost:3000 首页评论功能的 Playwright 脚本
"""

from playwright.sync_api import sync_playwright
import time
import json
from datetime import datetime

def log_console_messages(msg):
    """记录控制台消息"""
    timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
    if msg.type == "error":
        print(f"[{timestamp}] CONSOLE ERROR: {msg.text}")
    elif msg.type == "warning":
        print(f"[{timestamp}] CONSOLE WARNING: {msg.text}")
    elif msg.type == "log":
        print(f"[{timestamp}] CONSOLE LOG: {msg.text}")

def log_network_requests(request):
    """记录网络请求"""
    if request.resource_type in ["xhr", "fetch"]:
        print(f"网络请求: {request.method} {request.url}")

def log_network_responses(response):
    """记录网络响应"""
    if response.request.resource_type in ["xhr", "fetch"]:
        print(f"网络响应: {response.status} {response.url}")

def take_screenshot(page, name):
    """截图并保存"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"test_screenshot_{name}_{timestamp}.png"
    page.screenshot(path=filename, full_page=True)
    print(f"截图已保存: {filename}")

def main():
    results = {
        "test_time": datetime.now().isoformat(),
        "steps": [],
        "errors": [],
        "warnings": [],
        "success": False
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,  # 设置为 False 以观察测试过程
            slow_mo=1000     # 操作间隔1秒，便于观察
        )

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )

        page = context.new_page()

        # 设置事件监听器
        page.on("console", log_console_messages)
        page.on("request", log_network_requests)
        page.on("response", log_network_responses)

        try:
            print("=" * 60)
            print("开始测试 localhost:3000 首页评论功能")
            print("=" * 60)

            # 步骤1: 访问首页并检查页面加载
            print("\n步骤1: 访问首页 http://localhost:3000")
            start_time = time.time()

            response = page.goto("http://localhost:3000", wait_until="domcontentloaded")
            load_time = time.time() - start_time

            results["steps"].append({
                "step": 1,
                "name": "访问首页",
                "status": "success" if response.status == 200 else "error",
                "response_status": response.status,
                "load_time": f"{load_time:.2f}s"
            })

            print(f"页面响应状态: {response.status}")
            print(f"页面加载时间: {load_time:.2f}秒")

            # 等待页面完全加载
            try:
                page.wait_for_load_state("networkidle", timeout=10000)
                print("✓ 页面完全加载完成")
            except:
                print("⚠ 页面可能仍在加载中...")

            # 检查页面标题
            title = page.title()
            print(f"页面标题: {title}")

            # 检查页面内容
            content = page.content()
            if "Module not found" in content:
                error_msg = "页面显示模块未找到错误"
                results["errors"].append(error_msg)
                print(f"❌ {error_msg}")

            # 截图初始状态
            take_screenshot(page, "initial_load")

            # 步骤2: 定位评论区域
            print("\n步骤2: 定位评论区域")

            # 等待一段时间让页面完全渲染
            page.wait_for_timeout(3000)

            # 检查页面上是否存在评论相关的元素
            comment_selectors = [
                "textarea[name='comment']",
                "textarea[placeholder*='评论']",
                "textarea[placeholder*='comment']",
                "input[name='name']",
                "input[placeholder*='姓名']",
                "input[placeholder*='name']",
                "input[name='email']",
                "input[placeholder*='邮箱']",
                "input[placeholder*='email']",
                "button[type='submit']",
                "button:has-text('提交')",
                "button:has-text('评论')",
                ".comments-section",
                "#comments",
                "[class*='comment']"
            ]

            found_elements = []
            for selector in comment_selectors:
                try:
                    elements = page.locator(selector).all()
                    if elements:
                        found_elements.append({
                            "selector": selector,
                            "count": len(elements)
                        })
                        print(f"✓ 找到元素: {selector} (数量: {len(elements)})")
                except Exception as e:
                    pass

            if not found_elements:
                print("❌ 未找到评论相关元素")
                results["steps"].append({
                    "step": 2,
                    "name": "定位评论区域",
                    "status": "error",
                    "message": "未找到评论相关元素"
                })
            else:
                print(f"✓ 找到 {len(found_elements)} 种评论相关元素")
                results["steps"].append({
                    "step": 2,
                    "name": "定位评论区域",
                    "status": "success",
                    "found_elements": found_elements
                })

            # 截图当前页面状态
            take_screenshot(page, "comment_elements_found")

            # 步骤3: 测试评论表单功能
            print("\n步骤3: 测试评论表单功能")

            # 尝试查找并填写评论表单
            form_filled = False

            # 查找姓名输入框
            name_input = None
            name_selectors = ["input[name='name']", "input[placeholder*='姓名']", "input[placeholder*='name']"]
            for selector in name_selectors:
                try:
                    name_input = page.locator(selector).first
                    if name_input.is_visible():
                        break
                except:
                    continue

            if name_input:
                print("✓ 找到姓名输入框")
                name_input.fill("测试用户")
                print("✓ 已填写姓名: 测试用户")
                form_filled = True
            else:
                print("❌ 未找到姓名输入框")

            # 查找邮箱输入框
            email_input = None
            email_selectors = ["input[name='email']", "input[type='email']", "input[placeholder*='邮箱']", "input[placeholder*='email']"]
            for selector in email_selectors:
                try:
                    email_input = page.locator(selector).first
                    if email_input.is_visible():
                        break
                except:
                    continue

            if email_input:
                print("✓ 找到邮箱输入框")
                email_input.fill("test@example.com")
                print("✓ 已填写邮箱: test@example.com")
                form_filled = True
            else:
                print("❌ 未找到邮箱输入框")

            # 查找评论内容输入框
            comment_textarea = None
            comment_selectors = [
                "textarea[name='comment']",
                "textarea[name='content']",
                "textarea[placeholder*='评论']",
                "textarea[placeholder*='comment']"
            ]
            for selector in comment_selectors:
                try:
                    comment_textarea = page.locator(selector).first
                    if comment_textarea.is_visible():
                        break
                except:
                    continue

            if comment_textarea:
                print("✓ 找到评论内容输入框")
                comment_textarea.fill("这是一条测试评论，用于测试评论功能是否正常工作。")
                print("✓ 已填写评论内容")
                form_filled = True
            else:
                print("❌ 未找到评论内容输入框")

            # 查找同意条款复选框
            checkbox = None
            checkbox_selectors = [
                "input[type='checkbox']",
                "input[name='agree']",
                "input[name='terms']"
            ]
            for selector in checkbox_selectors:
                try:
                    checkbox = page.locator(selector).first
                    if checkbox.is_visible():
                        break
                except:
                    continue

            if checkbox:
                print("✓ 找到复选框")
                if not checkbox.is_checked():
                    checkbox.check()
                    print("✓ 已勾选复选框")
                form_filled = True
            else:
                print("⚠ 未找到复选框（可能不需要）")

            # 记录表单填写状态
            if form_filled:
                results["steps"].append({
                    "step": 3,
                    "name": "填写评论表单",
                    "status": "success"
                })
            else:
                results["steps"].append({
                    "step": 3,
                    "name": "填写评论表单",
                    "status": "error",
                    "message": "无法填写表单元素"
                })

            # 截图表单填写后的状态
            take_screenshot(page, "form_filled")

            # 步骤4: 提交评论
            print("\n步骤4: 提交评论")

            submit_button = None
            submit_selectors = [
                "button[type='submit']",
                "button:has-text('提交')",
                "button:has-text('发送')",
                "button:has-text('评论')",
                "input[type='submit']",
                ".submit-btn"
            ]

            for selector in submit_selectors:
                try:
                    submit_button = page.locator(selector).first
                    if submit_button.is_visible():
                        break
                except:
                    continue

            if submit_button:
                print("✓ 找到提交按钮")

                # 记录提交前的评论数量
                comments_before = len(page.locator(".comment, [class*='comment']").all())

                # 点击提交按钮
                print("正在提交评论...")
                submit_button.click()

                # 等待提交处理
                page.wait_for_timeout(3000)

                # 检查是否有新评论出现
                comments_after = len(page.locator(".comment, [class*='comment']").all())

                if comments_after > comments_before:
                    print(f"✓ 评论提交成功！评论数量从 {comments_before} 增加到 {comments_after}")
                    results["steps"].append({
                        "step": 4,
                        "name": "提交评论",
                        "status": "success",
                        "comments_before": comments_before,
                        "comments_after": comments_after
                    })
                else:
                    print("⚠ 评论提交后未检测到新评论")
                    results["steps"].append({
                        "step": 4,
                        "name": "提交评论",
                        "status": "warning",
                        "message": "提交后未检测到新评论",
                        "comments_before": comments_before,
                        "comments_after": comments_after
                    })
            else:
                print("❌ 未找到提交按钮")
                results["steps"].append({
                    "step": 4,
                    "name": "提交评论",
                    "status": "error",
                    "message": "未找到提交按钮"
                })

            # 截图提交后的状态
            take_screenshot(page, "after_submit")

            # 步骤5: 检查其他功能（回复、投票、分页等）
            print("\n步骤5: 检查其他评论功能")

            # 检查回复按钮
            reply_buttons = page.locator("button:has-text('回复'), .reply-btn, [class*='reply']").all()
            if reply_buttons:
                print(f"✓ 找到 {len(reply_buttons)} 个回复按钮")
                results["steps"].append({
                    "step": 5.1,
                    "name": "检查回复功能",
                    "status": "success",
                    "count": len(reply_buttons)
                })
            else:
                print("❌ 未找到回复按钮")
                results["steps"].append({
                    "step": 5.1,
                    "name": "检查回复功能",
                    "status": "error",
                    "message": "未找到回复按钮"
                })

            # 检查投票按钮
            vote_buttons = page.locator("button:has-text('赞'), button:has-text('踩'), .like-btn, .dislike-btn, [class*='vote']").all()
            if vote_buttons:
                print(f"✓ 找到 {len(vote_buttons)} 个投票按钮")
                results["steps"].append({
                    "step": 5.2,
                    "name": "检查投票功能",
                    "status": "success",
                    "count": len(vote_buttons)
                })
            else:
                print("❌ 未找到投票按钮")
                results["steps"].append({
                    "step": 5.2,
                    "name": "检查投票功能",
                    "status": "error",
                    "message": "未找到投票按钮"
                })

            # 检查分页
            pagination = page.locator(".pagination, .pager, [class*='page']").all()
            if pagination:
                print(f"✓ 找到分页元素")
                results["steps"].append({
                    "step": 5.3,
                    "name": "检查分页功能",
                    "status": "success"
                })
            else:
                print("❌ 未找到分页元素")
                results["steps"].append({
                    "step": 5.3,
                    "name": "检查分页功能",
                    "status": "error",
                    "message": "未找到分页元素"
                })

            # 最终截图
            take_screenshot(page, "final_state")

            print("\n" + "=" * 60)
            print("测试完成！")
            print("=" * 60)

            results["success"] = True

        except Exception as e:
            error_msg = f"测试过程中发生错误: {str(e)}"
            print(f"❌ {error_msg}")
            results["errors"].append(error_msg)

            # 错误时截图
            take_screenshot(page, "error_state")

        finally:
            # 保存测试结果
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            results_file = f"test_results_{timestamp}.json"

            with open(results_file, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)

            print(f"\n测试结果已保存到: {results_file}")

            # 关闭浏览器
            browser.close()

            return results

if __name__ == "__main__":
    main()