import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// -------------------- GET: Check Booking by name & phone --------------------

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const phone = url.searchParams.get('phone');

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        customer: name,
        phone: phone,
      },
      include: {
        barber: true,
        service: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ message: 'No booking found' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("GET /api/bookings/check error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// -------------------- PUT: Update Booking by ID --------------------

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split('/').pop();

    const id = parseInt(idStr || '');
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Valid booking ID is required' }, { status: 400 });
    }

    const { date } = await req.json();
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { date: new Date(date) },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('PUT /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
