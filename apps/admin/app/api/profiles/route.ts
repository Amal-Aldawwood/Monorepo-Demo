import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  shareProfileWithSites,
  unshareProfileFromSites,
  getProfileStats,
  Profile,
  getCustomerById,
  getAllCustomers
} from '@repo/database';

export const GET = async (request: NextRequest) => {
  try {
    // Check if there's an ID in the query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const stats = searchParams.get('stats');

    // Get profile stats
    if (stats === 'true') {
      const statsData = await getProfileStats();
      return NextResponse.json({ data: statsData });
    }

    let data: Profile | Profile[];

    if (id) {
      // Get specific profile
      const profile = await getProfileById(parseInt(id));
      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
      data = profile;
    } else {
      // Get all profiles
      data = await getAllProfiles();
    }

    return NextResponse.json({ data });
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
    const { name, age, customerId, sharedWith } = body;
    if (!name || !age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine the customer ID to use
    let targetCustomerId: number;
    let customer = null;
    
    if (customerId) {
      // If customerId is provided, use it
      targetCustomerId = parseInt(customerId);
      customer = await getCustomerById(targetCustomerId);
    } else {
      // If customerId is not provided, get the first available customer from any site
      const allCustomers = await getAllCustomers();
      if (allCustomers.length > 0) {
        customer = allCustomers[0];
        targetCustomerId = customer.id;
      }
    }

    // Verify a customer exists
    if (!customer) {
      return NextResponse.json(
        { error: `No valid customer found. Cannot create profile without a valid customer.` },
        { status: 400 }
      );
    }
    
    const newProfile = await createProfile({
      name,
      age: parseInt(age),
      customerId: targetCustomerId,
      sharedWith: sharedWith || null,
    });

    return NextResponse.json({ data: newProfile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const share = searchParams.get('share');
    const unshare = searchParams.get('unshare');

    if (!id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    const profileId = parseInt(id);
    
    // Handle share/unshare operations
    if (share === 'true' || unshare === 'true') {
      const body = await request.json();
      const { siteIds } = body;
      
      if (!siteIds || !Array.isArray(siteIds)) {
        return NextResponse.json(
          { error: 'Valid siteIds array is required' },
          { status: 400 }
        );
      }
      
      let updatedProfile;
      
      if (share === 'true') {
        updatedProfile = await shareProfileWithSites(profileId, siteIds);
      } else {
        updatedProfile = await unshareProfileFromSites(profileId, siteIds);
      }
      
      if (!updatedProfile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: updatedProfile });
    }
    
    // Regular update
    const body = await request.json();
    
    const updatedProfile = await updateProfile(profileId, body);

    if (!updatedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
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
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    const deletedProfile = await deleteProfile(parseInt(id));

    if (!deletedProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: deletedProfile });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
};
