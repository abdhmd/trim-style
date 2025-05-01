import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // جرب "none" إذا كنت تستخدم HTTPS وطلبات cross-origin
      path: "/",
      maxAge: 60 * 60 * 24,
      domain: process.env.NODE_ENV === "production" ? ".trim-style.netlify.app" : undefined,
    });

    console.log(`[Login] Setting auth cookie for user: ${username}, Domain: ${process.env.NODE_ENV === "production" ? ".trim-style.netlify.app" : "localhost"}`);

    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}