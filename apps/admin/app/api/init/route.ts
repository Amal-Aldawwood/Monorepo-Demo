import { NextRequest, NextResponse } from 'next/server';
import { getAllSites } from '@repo/database';
import { initializeSiteConstants } from '@repo/shared';

// This route initializes site constants from the database
export async function GET(request: NextRequest) {
  try {
    // Fetch all sites from the database
    const sites = await getAllSites();
    
    // Initialize the shared constants with the site data
    const constants = await initializeSiteConstants(sites);
    
    return NextResponse.json({
      success: true,
      message: 'Site constants initialized successfully',
      data: {
        sitesCount: sites.length,
        constants
      }
    });
  } catch (error) {
    console.error('Error initializing site constants:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize site constants' 
      },
      { status: 500 }
    );
  }
}
