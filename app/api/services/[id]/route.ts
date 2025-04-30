import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ GET service by ID
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

  const service = await prisma.service.findUnique({
    where: { id: Number(id) },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json(service);
}

// ✅ UPDATE service
export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

  const data = await req.json();

  try {
    const service = await prisma.service.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(service);
  } catch{}
}

// ✅ DELETE service
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

  try {
    await prisma.service.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Service deleted' });
  } catch {}
}
