import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies() // استخدام await هنا
  cookieStore.set('auth', '', { maxAge: 0 }) // حذف الكوكي بإفراغه وتحديد مدة الصلاحية بصفر

  return NextResponse.json({ success: true })
}
