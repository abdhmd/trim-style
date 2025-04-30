import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      barber: true,
      service: true,
    },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // تحويل barberId و serviceId إلى Int
  const barberId = Number(data.barberId);
  const serviceId = Number(data.serviceId);

  // التحقق من صحة القيم المُدخلة
  if (isNaN(barberId) || isNaN(serviceId)) {
    return NextResponse.json(
      { error: "Invalid barberId or serviceId, must be integers" },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        customer: data.customer,
        phone: data.phone,
        date: new Date(data.date),
        barberId, // barberId هو الآن عدد صحيح
        serviceId, // serviceId هو الآن عدد صحيح
      },
    });

    return NextResponse.json(booking);
  } catch {}
}
