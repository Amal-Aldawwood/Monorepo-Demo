import { NextRequest, NextResponse } from "next/server";
import { getAllProfilesForSite } from "@repo/database/services/profile.service";

/**
 * GET /api/profiles
 * Returns profiles for the current site
 */
export async function GET(request: NextRequest) {
  try {
    // Site ID is hardcoded to 4 for this site
    const siteId = 4;
    
    // Get profiles from database for this site
    const { ownProfiles, sharedProfiles } = await getAllProfilesForSite(siteId);
    
    return NextResponse.json({
      status: "success",
      data: {
        ownProfiles,
        sharedProfiles
      }
    });
  } catch (error: any) {
    console.error("Error in GET /api/profiles:", error);
    
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to get profiles"
      },
      { status: 500 }
    );
  }
}
