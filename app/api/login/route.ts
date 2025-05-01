import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ إنشاء Response يدوي
    const response = NextResponse.json({ success: true })

    // ✅ تعيين الكوكي باستخدام الطريقة الرسمية
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development',
      sameSite: 'lax',  // Lax أفضل للأمان والتوافق
      path: '/',  // يجب أن تكون الكوكي مرتبطة بجميع المسارات
      maxAge: 60 * 60 * 24,  // 24 ساعة (تأكد من أن القيمة كبيرة بما يكفي)
    });
    

    return response
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
