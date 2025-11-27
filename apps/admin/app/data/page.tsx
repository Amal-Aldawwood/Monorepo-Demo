import React from 'react';
import { Card } from '@repo/ui';
import { getProfileStats, getAllCustomers, getAllProfiles } from '@repo/database';
import { SITE_NAMES } from '@repo/shared';

export const dynamic = 'force-dynamic';

export default async function DataPage() {
  // Fetch real data from the database
  const stats = await getProfileStats();
  const customers = await getAllCustomers();
  const profiles = await getAllProfiles();
  
  // Get most recent profiles for activity feed
  const recentProfiles = [...profiles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(profile => {
      const customer = customers.find(c => c.id === profile.customerId);
      return {
        id: profile.id,
        action: 'Profile Created',
        user: customer?.name || 'Unknown',
        timestamp: new Date(profile.createdAt).toLocaleString(),
        siteId: customer?.siteId
      };
    });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Data Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Profiles</h3>
          <p className="text-4xl font-bold text-primary">{stats.totalProfiles}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Shared Profiles</h3>
          <p className="text-4xl font-bold text-primary">{stats.sharedProfiles}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.totalProfiles > 0 
              ? `${Math.round((stats.sharedProfiles / stats.totalProfiles) * 100)}% of all profiles`
              : 'No profiles yet'
            }
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
          <p className="text-4xl font-bold text-primary">{customers.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Profiles/Customer</h3>
          <p className="text-4xl font-bold text-primary">
            {customers.length > 0 
              ? (stats.totalProfiles / customers.length).toFixed(1)
              : '0'
            }
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Distribution by Site</h3>
          <div className="space-y-2">
            {Object.entries(stats.profilesBySite).map(([site, count]) => (
              <div key={site} className="flex justify-between items-center">
                <span className="capitalize">{SITE_NAMES[parseInt(site.replace('site', ''))]}</span>
                <div className="flex items-center">
                  <div className="w-24 h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden mr-2">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${stats.totalProfiles > 0 ? (count as number / stats.totalProfiles) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customers by Site</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((siteId) => {
              const count = customers.filter(c => c.siteId === siteId).length;
              return (
                <div key={siteId} className="flex justify-between items-center">
                  <span className="capitalize">{SITE_NAMES[siteId]}</span>
                  <div className="flex items-center">
                    <div className="w-24 h-4 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${customers.length > 0 ? (count / customers.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentProfiles.length > 0 ? (
            recentProfiles.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary mr-2"></div>
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.user} ({SITE_NAMES[activity.siteId || 1]}) • {activity.timestamp}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No recent activity</div>
          )}
        </div>
      </Card>
    </div>
  );
}
