import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// تعريف نوع بيانات الخدمة
interface ServicePayload {
  id?: number;
  name: string;
  price: number;
  description?: string;
}

// Get all services
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// Create a new service
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<ServicePayload, 'id'>;

    const { name, price, description } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        price,
        description: description || '',
      },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// Update a service's details
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as ServicePayload;

    const { id, name, price, description } = body;

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: 'ID, Name, and Price are required' }, { status: 400 });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        price,
        description: description || '',
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('PUT /api/services error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// Delete a service
export async function DELETE(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const deletedService = await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(deletedService);
  } catch (error) {
    console.error('DELETE /api/services error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
