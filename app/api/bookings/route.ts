import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// interface FormState {
//   customer: string;
//   phone: string; // << أضف هذا
//   date: string;
//   time: string;
//   barberId: string;
//   serviceId: string;
// }

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        barber: true,
        service: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, phone, date, barberId, serviceId } = body;

    if (!customer || !phone || !date || !barberId || !serviceId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        customer,
        phone,
        date: new Date(date),
        barberId: parseInt(barberId),
        serviceId: parseInt(serviceId),
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
