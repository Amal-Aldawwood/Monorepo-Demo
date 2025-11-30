import { db } from '../index';

export interface Site {
  id: number;
  name: string;
  color: string;
  port?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  customers?: any[];
}

/**
 * Get all sites from the database
 */
export async function getAllSites(): Promise<Site[]> {
  return db.site.findMany({
    where: {
      isActive: true
    },
    include: {
      customers: true
    }
  });
}

/**
 * Get a specific site by ID
 */
export async function getSiteById(id: number): Promise<Site | null> {
  return db.site.findUnique({
    where: { 
      id,
      isActive: true
    },
    include: {
      customers: true
    }
  });
}

/**
 * Create a new site
 */
export async function createSite(
  name: string,
  color: string,
  port: number = 3000
): Promise<Site> {
  return db.site.create({
    data: {
      name,
      color,
      port,
      isActive: true
    },
    include: {
      customers: true
    }
  });
}

/**
 * Update an existing site
 */
export async function updateSite(
  id: number,
  data: { name?: string; color?: string; port?: number; isActive?: boolean }
): Promise<Site | null> {
  return db.site.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      customers: true
    }
  });
}

/**
 * Delete a site (soft delete by setting isActive to false)
 */
export async function deleteSite(id: number): Promise<Site | null> {
  return db.site.update({
    where: { id },
    data: { 
      isActive: false,
      updatedAt: new Date()
    },
    include: {
      customers: true
    }
  });
}

/**
 * Get all sites including inactive ones for admin purposes
 */
export async function getAllSitesAdmin(): Promise<Site[]> {
  return db.site.findMany({
    include: {
      customers: true
    }
  });
}
