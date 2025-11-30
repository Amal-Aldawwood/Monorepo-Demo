// Default fallback site configurations
export const DEFAULT_SITE_NAMES = {
  1: 'Site 1',
  2: 'Site 2',
  3: 'Site 3',
  4: 'Site 4'
};

export const DEFAULT_SITE_COLORS = {
  1: '#10b981', // Green
  2: '#f59e0b', // Orange
  3: '#8b5cf6', // Purple
  4: '#ef4444'  // Red
};

export const DEFAULT_SITE_PORTS = {
  1: 3002,
  2: 3003,
  3: 3004,
  4: 3005
};

// Dynamic site utility functions
export async function getSiteNames(sitesData?: any[]): Promise<Record<number, string>> {
  if (!sitesData || sitesData.length === 0) {
    return DEFAULT_SITE_NAMES;
  }
  
  // Start with defaults to ensure backward compatibility
  const siteNames: Record<number, string> = { ...DEFAULT_SITE_NAMES };
  
  // Override with actual site data
  sitesData.forEach(site => {
    siteNames[site.id] = site.name;
  });
  
  return siteNames;
}

export async function getSiteColors(sitesData?: any[]): Promise<Record<number, string>> {
  if (!sitesData || sitesData.length === 0) {
    return DEFAULT_SITE_COLORS;
  }
  
  // Start with defaults to ensure backward compatibility
  const siteColors: Record<number, string> = { ...DEFAULT_SITE_COLORS };
  
  // Override with actual site data
  sitesData.forEach(site => {
    siteColors[site.id] = site.color;
  });
  
  return siteColors;
}

export async function getSitePorts(sitesData?: any[]): Promise<Record<number, number>> {
  if (!sitesData || sitesData.length === 0) {
    return DEFAULT_SITE_PORTS;
  }
  
  // Start with defaults to ensure backward compatibility
  const sitePorts: Record<number, number> = { ...DEFAULT_SITE_PORTS };
  
  // Override with actual site data
  sitesData.forEach(site => {
    if (site.port) {
      sitePorts[site.id] = site.port;
    }
  });
  
  return sitePorts;
}

export async function getAllSiteData(sitesData?: any[]): Promise<{
  names: Record<number, string>;
  colors: Record<number, string>;
  ports: Record<number, number>;
}> {
  return {
    names: await getSiteNames(sitesData),
    colors: await getSiteColors(sitesData),
    ports: await getSitePorts(sitesData)
  };
}

// For backward compatibility
// These are now initialized with defaults but should be populated dynamically
// by calling initializeSiteConstants() from an API route
let SITE_NAMES: Record<number, string> = { ...DEFAULT_SITE_NAMES };
let SITE_COLORS: Record<number, string> = { ...DEFAULT_SITE_COLORS };
let SITE_PORTS: Record<number, number> = { ...DEFAULT_SITE_PORTS };

// Function to initialize site constants with data from the database
export async function initializeSiteConstants(sitesData?: any[]) {
  SITE_NAMES = await getSiteNames(sitesData);
  SITE_COLORS = await getSiteColors(sitesData);
  SITE_PORTS = await getSitePorts(sitesData);
  
  return {
    names: SITE_NAMES,
    colors: SITE_COLORS,
    ports: SITE_PORTS
  };
}

// Export the constants
export { SITE_NAMES, SITE_COLORS, SITE_PORTS };
