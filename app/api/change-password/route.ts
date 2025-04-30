// app/api/change-password/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface ChangePasswordBody {
  oldPassword: string
  newPassword: string
  username: string
}

export async function POST(req: Request) {
  const body: ChangePasswordBody = await req.json()
  const { oldPassword, newPassword, username } = body

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password)
  if (!isMatch) {
    return NextResponse.json({ error: 'Old password incorrect' }, { status: 401 })
  }

  const hashedNew = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { username },
    data: { password: hashedNew },
  })

  const cookieStore = await cookies();
  cookieStore.set('auth', '', { maxAge: 0 }) // Logout after change

  return NextResponse.json({ success: true })
}
