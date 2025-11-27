/**
 * Shared API client for interacting with profile data across all sites
 */

import { SITE_NAMES } from './constants';

export interface ProfileData {
  id: number;
  name: string;
  age: number;
  customerId: number;
  sharedWith: string | null; // JSON string of site IDs
  createdAt: Date;
  customer: {
    id: number;
    name: string;
    email: string;
    siteId: number;
    color: string;
  };
}

export interface ProfilesResponse {
  ownProfiles: ProfileData[];
  sharedProfiles: ProfileData[];
}

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  siteId: number;
  color: string;
  createdAt: Date;
  profiles: ProfileData[];
}

export interface SiteProfilesResponse {
  ownProfiles: ProfileData[];
  sharedProfiles: ProfileData[];
  customers: CustomerData[];
}

/**
 * Get profiles for the current site (both owned and shared with)
 */
export const getProfiles = async (): Promise<ProfilesResponse> => {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) {
      throw new Error(`Failed to fetch profiles: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

/**
 * Get site-specific data including customers for a site
 */
export const getSiteProfiles = async (siteId: number): Promise<SiteProfilesResponse> => {
  try {
    const response = await fetch(`/api/sites/${siteId}/profiles`);
    if (!response.ok) {
      throw new Error(`Failed to fetch site profiles: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching site ${siteId} profiles:`, error);
    throw error;
  }
};

/**
 * Create a new profile
 */
export const createProfile = async (profileData: {
  name: string;
  age: number;
  customerId: number;
  sharedWith: number[] | null;
}): Promise<ProfileData> => {
  try {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

/**
 * Update an existing profile
 */
export const updateProfile = async (
  id: number,
  profileData: Partial<{
    name: string;
    age: number;
    customerId: number;
    sharedWith: number[] | null;
  }>
): Promise<ProfileData> => {
  try {
    const response = await fetch(`/api/profiles?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Share a profile with specific sites
 */
export const shareProfile = async (
  id: number,
  siteIds: number[]
): Promise<ProfileData> => {
  try {
    const response = await fetch(`/api/profiles?id=${id}&share=true`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siteIds }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to share profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error sharing profile:', error);
    throw error;
  }
};

/**
 * Unshare a profile from specific sites
 */
export const unshareProfile = async (
  id: number,
  siteIds: number[]
): Promise<ProfileData> => {
  try {
    const response = await fetch(`/api/profiles?id=${id}&unshare=true`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siteIds }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to unshare profile');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error unsharing profile:', error);
    throw error;
  }
};

/**
 * Delete a profile
 */
export const deleteProfile = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/profiles?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete profile');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};

/**
 * Get the human-readable site name based on profile data
 */
export const getProfileSourceName = (profile: ProfileData): string => {
  if (profile.customer && profile.customer.siteId) {
    const siteId = profile.customer.siteId as keyof typeof SITE_NAMES;
    return SITE_NAMES[siteId];
  }
  return 'Unknown Source';
};

/**
 * Parse shared sites from the JSON string
 */
export const parseSharedSites = (sharedWith: string | null): number[] => {
  if (!sharedWith) return [];
  
  try {
    const parsed = JSON.parse(sharedWith);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
