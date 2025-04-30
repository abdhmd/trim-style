import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const barbers = await prisma.barber.findMany();
  return NextResponse.json(barbers);
}

export async function POST(req: Request) {
  const data = await req.json();
  const barber = await prisma.barber.create({
    data: {
      name: data.name,
      bio: data.bio,
    },
  });
  return NextResponse.json(barber);
}
