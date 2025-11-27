import { PrismaClient } from '@prisma/client';
import { SITE_NAMES, SITE_COLORS } from '@repo/shared';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const dbPath = path.join(process.cwd(), 'sites.json');

export interface Site {
  id: number;
  name: string;
  color: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// In-memory sites storage
let sitesCache: Site[] = [];

// Initialize with the default sites from constants
async function initSites(): Promise<void> {
  try {
    // Try to load from file first
    const sites = await loadSitesFromFile();
    if (sites.length > 0) {
      sitesCache = sites;
      return;
    }
  } catch (error) {
    console.log('No existing sites file, initializing with defaults...');
  }

  // Initialize with default sites from constants
  sitesCache = Object.entries(SITE_NAMES).map(([id, name]) => ({
    id: parseInt(id),
    name,
    color: SITE_COLORS[parseInt(id) as keyof typeof SITE_COLORS] || '#000000',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Save to file
  await saveSitesToFile();
}

// Load sites from file
async function loadSitesFromFile(): Promise<Site[]> {
  try {
    const data = await readFileAsync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save sites to file
async function saveSitesToFile(): Promise<void> {
  try {
    await writeFileAsync(dbPath, JSON.stringify(sitesCache, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving sites to file:', error);
  }
}

// Initialize sites on module load
initSites().catch(console.error);

// Get all sites from storage
export async function getAllSites(): Promise<Site[]> {
  return sitesCache.filter(site => site.isActive !== false);
}

// Get a specific site by ID
export async function getSiteById(id: number): Promise<Site | null> {
  const site = sitesCache.find(s => s.id === id && s.isActive !== false);
  return site || null;
}

// Create a new site
export async function createSite(
  name: string,
  color: string
): Promise<Site> {
  // Find the highest ID and increment by 1
  const highestId = sitesCache.reduce((max, site) => Math.max(max, site.id), 0);
  const newId = highestId + 1;
  
  const newSite: Site = {
    id: newId,
    name,
    color,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  sitesCache.push(newSite);
  await saveSitesToFile();
  
  return newSite;
}

// Update an existing site
export async function updateSite(
  id: number,
  data: { name?: string; color?: string; isActive?: boolean }
): Promise<Site | null> {
  const index = sitesCache.findIndex(s => s.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the site
  sitesCache[index] = {
    ...sitesCache[index],
    ...data,
    updatedAt: new Date(),
  };
  
  await saveSitesToFile();
  return sitesCache[index];
}

// Delete a site (soft delete by setting isActive to false)
export async function deleteSite(id: number): Promise<Site | null> {
  return updateSite(id, { isActive: false });
}
