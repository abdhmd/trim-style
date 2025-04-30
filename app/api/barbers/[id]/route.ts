import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ GET barber by ID
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  const barber = await prisma.barber.findUnique({
    where: { id: Number(id) },
  });

  if (!barber) {
    return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
  }

  return NextResponse.json(barber);
}

// ✅ UPDATE barber
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  const data = await req.json();

  try {
    const barber = await prisma.barber.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(barber);
  } catch {}
}

// ✅ DELETE barber
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  try {
    await prisma.barber.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Barber deleted' });
  } catch {}
}
