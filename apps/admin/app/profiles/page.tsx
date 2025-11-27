import React from 'react';
import { Card, Button } from '@repo/ui';
import { getAllProfiles, getAllCustomers } from '@repo/database';
import { SITE_NAMES, SITE_COLORS } from '@repo/shared';
import ProfileForm from '../../components/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilesPage({ 
  searchParams 
}: {
  searchParams: { customerId?: string; siteId?: string }
}) {
  // Get query params for filtering
  const { customerId, siteId } = searchParams;
  
  // Fetch profiles and customers
  const allProfiles = await getAllProfiles();
  const allCustomers = await getAllCustomers();
  
  // Filter profiles based on query parameters
  let filteredProfiles = [...allProfiles];
  
  if (customerId) {
    const custId = parseInt(customerId);
    filteredProfiles = filteredProfiles.filter(profile => profile.customerId === custId);
  }
  
  if (siteId) {
    const site = parseInt(siteId);
    
    // For site filtering, we need to:
    // 1. Include profiles from customers of this site
    // 2. Include profiles shared with this site
    filteredProfiles = filteredProfiles.filter(profile => {
      const customer = allCustomers.find(c => c.id === profile.customerId);
      if (!customer) return false;
      
      // Case 1: Profile belongs to a customer of this site
      if (customer.siteId === site) return true;
      
      // Case 2: Profile is shared with this site
      if (profile.sharedWith) {
        try {
          const sharedWithArray = JSON.parse(profile.sharedWith);
          return Array.isArray(sharedWithArray) && sharedWithArray.includes(site);
        } catch {
          return false;
        }
      }
      
      return false;
    });
  }
  
  // Get a customer by ID helper function
  const getCustomer = (customerId: number) => {
    return allCustomers.find(c => c.id === customerId);
  };

  // Parse shared sites from JSON string
  const getSharedSites = (sharedWith: string | null) => {
    if (!sharedWith) return [];
    
    try {
      return JSON.parse(sharedWith);
    } catch {
      return [];
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profiles</h1>
        
        <div className="flex space-x-2">
          {customerId ? (
            <a href="/profiles" className="text-primary hover:underline">
              Clear Filters
            </a>
          ) : (
            <div className="flex space-x-2">
              <a href="/profiles?siteId=1" className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${SITE_COLORS[1]}20`, color: SITE_COLORS[1] }}>
                Filter: {SITE_NAMES[1]}
              </a>
              <a href="/profiles?siteId=2" className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${SITE_COLORS[2]}20`, color: SITE_COLORS[2] }}>
                Filter: {SITE_NAMES[2]}
              </a>
              <a href="/profiles?siteId=3" className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${SITE_COLORS[3]}20`, color: SITE_COLORS[3] }}>
                Filter: {SITE_NAMES[3]}
              </a>
            </div>
          )}
        </div>
      </div>

      <ProfileForm customers={allCustomers} />
      
      <div className="mt-8 grid grid-cols-1 gap-4">
        {filteredProfiles.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">No profiles found with the current filter.</p>
            {(customerId || siteId) && (
              <a href="/profiles" className="text-primary hover:underline mt-2 inline-block">
                Clear filters
              </a>
            )}
          </Card>
        ) : (
          filteredProfiles.map(profile => {
            const customer = getCustomer(profile.customerId);
            const sharedSites = getSharedSites(profile.sharedWith);
            
            return (
              <Card 
                key={profile.id} 
                className="p-6"
                color={customer ? `${customer.color}10` : undefined}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">Age: {profile.age}</p>
                    
                    {customer && (
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Customer:</span>
                        <a 
                          href={`/profiles?customerId=${customer.id}`}
                          className="ml-1 inline-flex items-center text-sm font-medium rounded-full px-2 py-0.5"
                          style={{ 
                            backgroundColor: `${customer.color}20`,
                            color: customer.color 
                          }}
                        >
                          {customer.name}
                        </a>
                        <span 
                          className="ml-2 inline-flex items-center text-xs rounded-full px-2 py-0.5"
                          style={{ 
                            backgroundColor: `${SITE_COLORS[customer.siteId]}20`,
                            color: SITE_COLORS[customer.siteId]
                          }}
                        >
                          {SITE_NAMES[customer.siteId]}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <a 
                      href={`/profiles/edit/${profile.id}`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </a>
                    <a 
                      href={`/profiles/share/${profile.id}`}
                      className="text-primary hover:underline"
                    >
                      Manage Sharing
                    </a>
                  </div>
                </div>
                
                {/* Shared with section */}
                {sharedSites.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Shared with:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sharedSites.map((siteId: number) => (
                        <span 
                          key={siteId}
                          className="inline-flex items-center text-xs rounded-full px-2 py-0.5"
                          style={{ 
                            backgroundColor: `${SITE_COLORS[siteId]}20`,
                            color: SITE_COLORS[siteId]
                          }}
                        >
                          {SITE_NAMES[siteId]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-4">
                  Created: {new Date(profile.createdAt).toLocaleString()}
                </p>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
