import { NextRequest, NextResponse } from 'next/server';
import { getAllProfilesForSite, createProfile, getCustomersBySiteId } from '@repo/database';

export const GET = async () => {
  try {
    // Site ID for site1 is 1
    const SITE_ID = 1;
    
    // Get both owned and shared profiles
    const profiles = await getAllProfilesForSite(SITE_ID);

    return NextResponse.json({
      data: {
        ownProfiles: profiles.ownProfiles,
        sharedProfiles: profiles.sharedProfiles
      }
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate the required fields
    const { name, age, sharedWith } = body;
    if (!name || !age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the first available customer for site1
    const SITE_ID = 1;
    const customers = await getCustomersBySiteId(SITE_ID);

    if (customers.length === 0) {
      return NextResponse.json(
        { error: 'No customers available for this site' },
        { status: 500 }
      );
    }

    // Use the first customer found for this site
    const customerId = customers[0].id;
    
    const newProfile = await createProfile({
      name,
      age: parseInt(age),
      customerId,
      sharedWith: sharedWith || null,
    });

    return NextResponse.json({ data: newProfile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
};
