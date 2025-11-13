import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { Name, Email, Website, Topic, Message, contactChecked } = body;

    // 验证必填字段
    if (!Name || !Email || !Message || !contactChecked) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please fill in all required fields and accept the terms and conditions.'
        },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address.'
        },
        { status: 400 }
      );
    }

    // 验证消息长度
    if (Message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message must be at least 10 characters long.'
        },
        { status: 400 }
      );
    }

    // 这里可以添加实际的邮件发送逻辑或数据库存储
    // 例如发送邮件通知管理员
    console.log('Contact form submission:', {
      name: Name,
      email: Email,
      website: Website || 'N/A',
      topic: Topic || 'Others',
      message: Message,
      timestamp: new Date().toISOString()
    });

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again later.'
      },
      { status: 500 }
    );
  }
}