import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// -------------------- BARBERS CRUD --------------------

// Get all barbers
export async function getBarbers() {
  try {
    const barbers = await prisma.barber.findMany();
    return NextResponse.json(barbers);
  } catch (error) {
    console.error('Error fetching barbers:', error);
    return NextResponse.json({ error: 'Failed to fetch barbers' }, { status: 500 });
  }
}

// Create a new barber
export async function createBarber(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newBarber = await prisma.barber.create({
      data: { name },
    });

    return NextResponse.json(newBarber);
  } catch (error) {
    console.error('Error creating barber:', error);
    return NextResponse.json({ error: 'Failed to create barber' }, { status: 500 });
  }
}

// Update a barber's details
export async function updateBarber(req: NextRequest) {
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
    console.error('Error updating barber:', error);
    return NextResponse.json({ error: 'Failed to update barber' }, { status: 500 });
  }
}

// Delete a barber
export async function deleteBarber(req: NextRequest) {
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
    console.error('Error deleting barber:', error);
    return NextResponse.json({ error: 'Failed to delete barber' }, { status: 500 });
  }
}

// -------------------- SERVICES CRUD --------------------

// Get all services
export async function getServices() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// Create a new service
export async function createService(req: NextRequest) {
  try {
    const { name, price } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: { name, price },
    });

    return NextResponse.json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// Update a service's details
export async function updateService(req: NextRequest) {
  try {
    const { id, name, price } = await req.json();

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: 'ID, Name, and Price are required' }, { status: 400 });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { name, price },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// Delete a service
export async function deleteService(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedService = await prisma.service.delete({
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
export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
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
export async function createBooking(req: NextRequest) {
  try {
    const { customer, date, barberId, serviceId } = await req.json();

    if (!customer || !date || !barberId || !serviceId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newBooking = await prisma.booking.create({
      data: {
        customer,
        date: new Date(date),
        barberId,
        serviceId,
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// Update a booking's details
export async function updateBooking(req: NextRequest) {
  try {
    const { id, customer, date, barberId, serviceId } = await req.json();

    if (!id || !customer || !date || !barberId || !serviceId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
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
export async function deleteBooking(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(deletedBooking);
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
