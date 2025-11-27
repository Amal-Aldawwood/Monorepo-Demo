import { db } from '../index';
import { Profile, Customer } from './customer.service';

/**
 * Get all profiles
 */
export const getAllProfiles = async (): Promise<Profile[]> => {
  return db.profile.findMany({
    include: {
      customer: true,
    },
  });
};

/**
 * Get a profile by ID
 */
export const getProfileById = async (id: number): Promise<Profile | null> => {
  return db.profile.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });
};

/**
 * Get profiles by customer ID
 */
export const getProfilesByCustomerId = async (customerId: number): Promise<Profile[]> => {
  return db.profile.findMany({
    where: { customerId },
    include: {
      customer: true,
    },
  });
};

/**
 * Get profiles shared with a specific site
 */
export const getProfilesSharedWithSite = async (siteId: number): Promise<Profile[]> => {
  // Find all profiles that have this siteId in their sharedWith array
  const allProfiles = await db.profile.findMany({
    include: {
      customer: true,
    },
  });

  // Filter profiles that are shared with the specified site
  return allProfiles.filter((profile: Profile) => {
    if (!profile.sharedWith) return false;
    
    try {
      const sharedWithArray = JSON.parse(profile.sharedWith);
      return Array.isArray(sharedWithArray) && sharedWithArray.includes(siteId);
    } catch {
      return false;
    }
  });
};

/**
 * Get all profiles for a specific site (both owned and shared with)
 */
export const getAllProfilesForSite = async (siteId: number): Promise<{
  ownProfiles: (Profile & { customer: Customer })[];
  sharedProfiles: (Profile & { customer: Customer })[];
}> => {
  // Get customers belonging to this site
  const siteCustomers = await db.customer.findMany({
    where: { siteId },
    include: { profiles: true },
  });

  // Extract own profiles
  const ownProfiles = siteCustomers.flatMap((customer: Customer) =>
    customer.profiles.map((profile: Profile) => ({
      ...profile,
      customer,
    }))
  );

  // Get profiles shared with this site
  const allProfiles = await db.profile.findMany({
    include: {
      customer: true,
    },
  });

  // Filter for profiles that are shared with this site but don't belong to it
  const sharedProfiles = allProfiles.filter((profile: Profile & { customer: Customer }) => {
    if (profile.customer.siteId === siteId) return false; // Skip own profiles
    if (!profile.sharedWith) return false;

    try {
      const sharedWithArray = JSON.parse(profile.sharedWith);
      return Array.isArray(sharedWithArray) && sharedWithArray.includes(siteId);
    } catch {
      return false;
    }
  });

  return {
    ownProfiles,
    sharedProfiles,
  };
};

/**
 * Create a new profile
 */
export const createProfile = async (data: {
  name: string;
  age: number;
  customerId: number;
  sharedWith: number[] | null; // Array of site IDs
}): Promise<Profile> => {
  const { sharedWith, ...rest } = data;
  
  return db.profile.create({
    data: {
      ...rest,
      sharedWith: sharedWith ? JSON.stringify(sharedWith) : null,
    },
    include: {
      customer: true,
    },
  });
};

/**
 * Update an existing profile
 */
export const updateProfile = async (
  id: number,
  data: Partial<{
    name: string;
    age: number;
    customerId: number;
    sharedWith: number[] | null; // Array of site IDs
  }>
): Promise<Profile | null> => {
  const { sharedWith, ...rest } = data;
  
  return db.profile.update({
    where: { id },
    data: {
      ...rest,
      ...(sharedWith !== undefined ? {
        sharedWith: sharedWith ? JSON.stringify(sharedWith) : null,
      } : {}),
    },
    include: {
      customer: true,
    },
  });
};

/**
 * Delete a profile by ID
 */
export const deleteProfile = async (id: number): Promise<Profile | null> => {
  return db.profile.delete({
    where: { id },
    include: {
      customer: true,
    },
  });
};

/**
 * Share a profile with specific sites
 */
export const shareProfileWithSites = async (
  id: number,
  siteIds: number[]
): Promise<Profile | null> => {
  const profile = await db.profile.findUnique({
    where: { id },
  });

  if (!profile) return null;

  let currentSharedWith: number[] = [];
  
  if (profile.sharedWith) {
    try {
      currentSharedWith = JSON.parse(profile.sharedWith);
    } catch {
      currentSharedWith = [];
    }
  }

  // Add new site IDs (avoiding duplicates)
  const newSharedWith = Array.from(
    new Set([...currentSharedWith, ...siteIds])
  );

  return db.profile.update({
    where: { id },
    data: {
      sharedWith: JSON.stringify(newSharedWith),
    },
    include: {
      customer: true,
    },
  });
};

/**
 * Unshare a profile from specific sites
 */
export const unshareProfileFromSites = async (
  id: number,
  siteIds: number[]
): Promise<Profile | null> => {
  const profile = await db.profile.findUnique({
    where: { id },
  });

  if (!profile) return null;

  let currentSharedWith: number[] = [];
  
  if (profile.sharedWith) {
    try {
      currentSharedWith = JSON.parse(profile.sharedWith);
    } catch {
      currentSharedWith = [];
    }
  }

  // Remove specified site IDs
  const newSharedWith = currentSharedWith.filter(
    (siteId) => !siteIds.includes(siteId)
  );

  return db.profile.update({
    where: { id },
    data: {
      sharedWith: newSharedWith.length > 0 ? JSON.stringify(newSharedWith) : null,
    },
    include: {
      customer: true,
    },
  });
};

/**
 * Get statistics about profiles across all sites
 */
export const getProfileStats = async (): Promise<{
  totalProfiles: number;
  sharedProfiles: number;
  profilesBySite: Record<string, number>;
}> => {
  const allProfiles = await db.profile.findMany({
    include: { customer: true },
  });

  const profilesBySite: Record<string, number> = {
    site1: 0,
    site2: 0,
    site3: 0,
  };

  // Count profiles by site
  allProfiles.forEach((profile: Profile & { customer: Customer }) => {
    const siteId = profile.customer.siteId;
    profilesBySite[`site${siteId}`] += 1;
  });

  // Count shared profiles (profiles that have at least one entry in sharedWith)
  const sharedProfiles = allProfiles.filter(
    (profile: Profile & { customer: Customer }) => profile.sharedWith && profile.sharedWith !== '[]'
  );

  return {
    totalProfiles: allProfiles.length,
    sharedProfiles: sharedProfiles.length,
    profilesBySite,
  };
};
