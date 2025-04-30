import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// Handle GET and POST requests for contacts
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();
    return NextResponse.json(contacts);
  } catch {}
}

export async function POST(request: Request) {
  try {
    const { address, phone, hours, facebook, instagram, whatsapp } =
      await request.json();

    const newContact = await prisma.contact.create({
      data: {
        address,
        phone,
        hours,
        facebook,
        instagram,
        whatsapp,
      },
    });

    return NextResponse.json(newContact);
  } catch{}
}
