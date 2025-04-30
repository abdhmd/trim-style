import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ GET booking by ID
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      barber: true,
      service: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// ✅ UPDATE booking

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split('/').pop();

    if (!idStr) {
      return NextResponse.json({ error: 'Booking ID is missing in the URL' }, { status: 400 });
    }

    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Booking ID must be a number' }, { status: 400 });
    }

    const body = await req.json();
    const { date } = body;

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ✅ DELETE booking
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

  try {
    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Booking deleted' });
  } catch {}
}
