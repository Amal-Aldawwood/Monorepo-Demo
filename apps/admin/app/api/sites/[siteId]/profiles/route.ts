import { NextRequest, NextResponse } from 'next/server';
import { getAllProfilesForSite, getCustomersBySiteId } from '@repo/database';

export const GET = async (request: NextRequest, context: { params: { siteId: string } }) => {
  try {
    const siteId = parseInt(context.params.siteId);

    if (isNaN(siteId) || siteId < 1 || siteId > 3) {
      return NextResponse.json(
        { error: 'Invalid site ID' },
        { status: 400 }
      );
    }

    // Get all profiles for the site (both owned and shared)
    const profiles = await getAllProfilesForSite(siteId);
    
    // Get all customers for the site
    const customers = await getCustomersBySiteId(siteId);

    return NextResponse.json({
      data: {
        ownProfiles: profiles.ownProfiles,
        sharedProfiles: profiles.sharedProfiles,
        customers
      }
    });
  } catch (error) {
    console.error(`Error fetching profiles for site ${context.params.siteId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
};
