import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Barber, Service, Booking } from '@prisma/client'; // استيراد أنواع من Prisma

// -------------------- BARBERS CRUD --------------------

// Get all barbers
export async function getBarbers(): Promise<NextResponse> {
  try {
    const barbers: Barber[] = await prisma.barber.findMany();
    return NextResponse.json(barbers);
  } catch (error) {
    console.error('Error fetching barbers:', error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}

// Create a new barber
export async function createBarber(req: NextRequest): Promise<NextResponse> {
  try {
    const { name }: { name: string } = await req.json(); // نوع البيانات الذي ننتظره في الطلب

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newBarber: Barber = await prisma.barber.create({
      data: { name },
    });

    return NextResponse.json(newBarber);
  } catch (error) {
    console.error('Error creating barber:', error);
    return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
  }
}

// Update a barber's details
export async function updateBarber(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, name }: { id: number; name: string } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    const updatedBarber: Barber = await prisma.barber.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedBarber);
  } catch (error) {
    console.error('Error updating barber:', error);
    return NextResponse.json({ error: 'Failed to update barber' }, { status: 500 });
  }
}

// Delete a barber
export async function deleteBarber(req: NextRequest): Promise<NextResponse> {
  try {
    const { id }: { id: number } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedBarber: Barber = await prisma.barber.delete({
      where: { id },
    });

    return NextResponse.json(deletedBarber);
  } catch (error) {
    console.error('Error deleting barber:', error);
    return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
  }
}

// -------------------- SERVICES CRUD --------------------

// Get all services
export async function getServices(): Promise<NextResponse> {
  try {
    const services: Service[] = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// Create a new service
export async function createService(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, price, description }: { name: string; price: number; description: string } = await req.json();

    if (!name || price === undefined || !description) {
      return NextResponse.json({ error: 'Name, Price, and Description are required' }, { status: 400 });
    }

    const newService: Service = await prisma.service.create({
      data: { name, price, description },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// Update a service's details
export async function updateService(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, name, price, description }: { id: number; name: string; price: number; description: string } = await req.json();

    if (!id || !name || price === undefined || !description) {
      return NextResponse.json({ error: 'ID, Name, Price, and Description are required' }, { status: 400 });
    }

    const updatedService: Service = await prisma.service.update({
      where: { id },
      data: { name, price, description },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// Delete a service
export async function deleteService(req: NextRequest): Promise<NextResponse> {
  try {
    const { id }: { id: number } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedService: Service = await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(deletedService);
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

// -------------------- BOOKINGS CRUD --------------------

// Get all bookings
export async function getBookings(): Promise<NextResponse> {
  try {
    const bookings: Booking[] = await prisma.booking.findMany({
      include: {
        barber: true,
        service: true,
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// Create a new booking
export async function createBooking(req: NextRequest): Promise<NextResponse> {
  try {
    // إضافة الحقل phone مع البيانات الأخرى
    const { customer, date, barberId, serviceId, phone }: { customer: string; date: string; barberId: number; serviceId: number; phone: string } = await req.json();

    // التأكد من وجود جميع الحقول المطلوبة
    if (!customer || !date || !barberId || !serviceId || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // إنشاء الحجز باستخدام جميع البيانات
    const newBooking = await prisma.booking.create({
      data: {
        customer,
        date: new Date(date),
        barberId,
        serviceId,
        phone,  // إضافة الهاتف هنا
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}


// Update a booking's details
export async function updateBooking(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, customer, date, barberId, serviceId }: { id: number; customer: string; date: string; barberId: number; serviceId: number } = await req.json();

    if (!id || !customer || !date || !barberId || !serviceId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updatedBooking: Booking = await prisma.booking.update({
      where: { id },
      data: {
        customer,
        date: new Date(date),
        barberId,
        serviceId,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// Delete a booking
export async function deleteBooking(req: NextRequest): Promise<NextResponse> {
  try {
    const { id }: { id: number } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedBooking: Booking = await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(deletedBooking);
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
