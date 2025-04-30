import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get a specific barber by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const barberId = parseInt(id);
    
    if (isNaN(barberId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const barber = await prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }

    return NextResponse.json(barber);
  } catch (error) {
    console.error('GET /api/barbers/[id] error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update a specific barber by ID
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const barberId = parseInt(id);
    
    if (isNaN(barberId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { name, bio } = body;

    if (!name && !bio) {
      return NextResponse.json(
        { error: 'Name or bio is required for update' },
        { status: 400 }
      );
    }

    const updatedBarber = await prisma.barber.update({
      where: { id: barberId },
      data: {
        ...(name && { name }),
        ...(bio && { bio }),
      },
    });

    return NextResponse.json(updatedBarber);
  } catch (error) {
    console.error('PUT /api/barbers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update barber' },
      { status: 500 }
    );
  }
}

// Delete a specific barber by ID
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = context.params;
    const barberId = parseInt(id);
    
    if (isNaN(barberId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const deletedBarber = await prisma.barber.delete({
      where: { id: barberId },
    });

    return NextResponse.json(deletedBarber);
  } catch (error) {
    console.error('DELETE /api/barbers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete barber' },
      { status: 500 }
    );
  }
}