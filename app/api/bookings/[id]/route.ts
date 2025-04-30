import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming you have a Prisma client instance

// DELETE /api/bookings/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // تأكد من أنك تنتظر params بشكل صحيح
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Booking ID is required" },
      { status: 400 }
    );
  }

  const bookingId = parseInt(id);

  try {
    // تأكد من أن bookingId هو رقم صحيح
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // حذف الحجز من قاعدة البيانات
    const deletedBooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json(deletedBooking);
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Booking not found or could not be deleted" },
      { status: 400 }
    );
  }
}

// Function to check booking by name and phone
export async function GET(req: Request) {
  try {
    const url = new URL(req.url); // Get URL from the request
    const name = url.searchParams.get("name");
    const phone = url.searchParams.get("phone");

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
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

    if (booking) {
      return NextResponse.json({ booking });
    } else {
      return NextResponse.json(
        { message: "No booking found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("GET /api/bookings/check error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Function to update booking by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { date } = await req.json(); // Get the date from the request body

    // Validate that the date is in the correct ISO-8601 format
    if (!date || isNaN(new Date(date).getTime())) {
      return NextResponse.json(
        {
          error:
            "Invalid date format. Please provide a valid ISO-8601 DateTime.",
        },
        { status: 400 }
      );
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(params.id) }, // Find the booking by ID
      data: { date: new Date(date) }, // Update the date (ensure it's in Date format)
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("PUT /api/bookings/[id] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
