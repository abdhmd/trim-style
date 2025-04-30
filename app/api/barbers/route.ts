import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all barbers
export async function GET() {
  try {
    const barbers = await prisma.barber.findMany();
    return NextResponse.json(barbers);
  } catch (error) {
    console.error('GET /api/barbers error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// Create a new barber
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, bio } = body;

    if (!name || !bio) {
      return NextResponse.json({ error: 'Missing name or bio' }, { status: 400 });
    }

    const newBarber = await prisma.barber.create({
      data: {
        name,
        bio, // أضف هذا
      },
    });

    return NextResponse.json(newBarber);
  } catch (error) {
    console.error('POST /api/barbers error:', error);
    return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
  }
}


// Update a barber's details
export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    const updatedBarber = await prisma.barber.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedBarber);
  } catch (error) {
    console.error('PUT /api/barbers error:', error);
    return NextResponse.json({ error: 'Failed to update barber' }, { status: 500 });
  }
}

// Delete a barber
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedBarber = await prisma.barber.delete({
      where: { id },
    });

    return NextResponse.json(deletedBarber);
  } catch (error) {
    console.error('DELETE /api/barbers error:', error);
    return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
  }
}
