import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// PUT update service
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    // الانتظار على params قبل استخدامه
    const { id } = await params;  // التأكد من الانتظار على params

    const { name, price, description } = await req.json();  // إضافة description

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
    }

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: { 
        name,
        price,
        description: description || '',  // إذا لم يتم إرسال description، نقوم بوضع قيمة فارغة
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // الانتظار على params قبل استخدامه
    const { id } = await params;  // التأكد من الانتظار على params

    // تحقق من وجود الخدمة أولًا
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // حذف الخدمة من قاعدة البيانات
    const deletedService = await prisma.service.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(deletedService);
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
