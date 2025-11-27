import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer
} from '@repo/database';

export const GET = async (request: NextRequest) => {
  try {
    // Check if there's an ID in the query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    let data: Customer | Customer[];

    if (id) {
      // Get specific customer
      const customer = await getCustomerById(parseInt(id));
      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      data = customer;
    } else {
      // Get all customers
      data = await getAllCustomers();
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate the required fields
    const { name, email, siteId, color } = body;
    if (!name || !email || !siteId || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCustomer = await createCustomer({
      name,
      email,
      siteId,
      color,
    });

    return NextResponse.json({ data: newCustomer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updatedCustomer = await updateCustomer(parseInt(id), body);

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const deletedCustomer = await deleteCustomer(parseInt(id));

    if (!deletedCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: deletedCustomer });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
};
