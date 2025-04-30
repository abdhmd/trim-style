import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    // البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({ where: { username } })

    // التحقق من وجود المستخدم
    if (!user) {
      // لا نكشف للمهاجم ما إذا كان اسم المستخدم أو كلمة المرور خاطئة
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // مقارنة كلمة المرور المدخلة مع كلمة المرور المخزنة
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      // لا نكشف للمهاجم ما إذا كان اسم المستخدم أو كلمة المرور خاطئة
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // إعداد الرد الناجح
    const res = NextResponse.json({ success: true })
    
    // ضبط الكوكيز مع الأمان العالي
    res.headers.set('Set-Cookie', `auth=true; Path=/; HttpOnly; Secure; SameSite=Strict`)

    return res
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
