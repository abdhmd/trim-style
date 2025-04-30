import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET method to check booking by name and phone
export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Get URL from the request
    const name = url.searchParams.get('name');
    const phone = url.searchParams.get('phone');

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    // Search for the booking with the given name and phone
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

    console.log('Booking Found:', booking);  // Log the response

    if (booking) {
      return NextResponse.json({ booking });
    } else {
      return NextResponse.json({ message: 'No booking found' }, { status: 404 });
    }
  } catch (error) {
    console.error("GET /api/bookings/check error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// PUT method to update the booking
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { date } = await req.json();  // Get the date from the request body

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(params.id) }, // Find the booking by ID
      data: { date }, // Update the date
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('PUT /api/bookings/[id] error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
