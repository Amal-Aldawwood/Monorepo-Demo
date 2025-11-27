import { NextRequest, NextResponse } from 'next/server';
import { getAllSites, getSiteById, createSite, updateSite, deleteSite } from '@repo/database';

export const GET = async (request: NextRequest) => {
  try {
    // Check if there's an ID in the query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get specific site
      const site = await getSiteById(parseInt(id));
      if (!site) {
        return NextResponse.json(
          { error: 'Site not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: site });
    } else {
      // Get all sites
      const sites = await getAllSites();
      return NextResponse.json({ data: sites });
    }
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate the required fields
    const { name, color } = body;
    if (!name || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new site
    const newSite = await createSite(name, color);

    return NextResponse.json(
      { 
        data: newSite,
        message: 'Site created successfully!'
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
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
        { error: 'Missing site ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, color, isActive } = body;

    // Update site with provided fields
    const updatedSite = await updateSite(
      parseInt(id),
      { 
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
        ...(isActive !== undefined && { isActive })
      }
    );

    if (!updatedSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedSite,
      message: 'Site updated successfully!'
    });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Failed to update site' },
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
        { error: 'Missing site ID' },
        { status: 400 }
      );
    }

    // Soft delete the site
    const deletedSite = await deleteSite(parseInt(id));

    if (!deletedSite) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: deletedSite,
      message: 'Site deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
};
