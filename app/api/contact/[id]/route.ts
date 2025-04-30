import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Make sure the path to the Prisma client is correct

// Handle GET request for a contact by its ID
export async function GET(req: Request): Promise<NextResponse> {
  try {
    // Extract the ID from the URL path
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extract ID from URL
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Parse ID as a number and check if it is valid
    const contactId = parseInt(id, 10);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

// Handle PUT request to update a contact by its ID
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    // Extract the ID from the URL path
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Parse ID as a number and check if it is valid
    const contactId = parseInt(id, 10);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const { address, phone, hours, facebook, instagram, whatsapp } = await req.json();

    // Validate the request body
    if (!address || !phone || !hours) {
      return NextResponse.json({ error: 'Address, phone, and hours are required' }, { status: 400 });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        address,
        phone,
        hours,
        facebook,
        instagram,
        whatsapp,
      },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// Handle DELETE request to remove a contact by its ID
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    // Extract the ID from the URL path
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Parse ID as a number and check if it is valid
    const contactId = parseInt(id, 10);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const deletedContact = await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json({
      message: 'Contact deleted successfully',
      deletedContact,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
