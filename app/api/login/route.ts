import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ إنشاء Response يدوي
    const response = NextResponse.json({ success: true });

    // ✅ تعيين الكوكي باستخدام الطريقة الرسمية
    // عند تعيين الكوكي بعد تسجيل الدخول
    response.cookies.set("auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // أو 'none' إذا كنت تستخدم HTTPS
      path: "/", // يجعل الكوكي متاحًا في جميع المسارات
      maxAge: 60 * 60 * 24, // صلاحية 24 ساعة
      domain:
        process.env.NODE_ENV === "production"
          ? ".trim-style.netlify.app/" // استبدلها بنطاقك (يجب أن تبدأ بنقطة لتشمل subdomains)
          : "localhost", // للتطوير المحلي
    });

    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
