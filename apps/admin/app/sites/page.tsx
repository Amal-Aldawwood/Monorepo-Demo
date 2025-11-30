import React from 'react';
import { Card, Button } from '@repo/ui';
import { getAllSites } from '@repo/database';
import SiteForm from '../../components/SiteForm';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  // Fetch sites data
  const sites = await getAllSites();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sites</h1>
      
      <SiteForm />
      
      <div className="mt-8">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Port</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Color</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Preview</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
                  <td className="px-4 py-3 text-sm">{site.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{site.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="font-mono">{site.port || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full mr-2" 
                        style={{ backgroundColor: site.color }}
                      ></div>
                      {site.color}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${site.color}20`,
                        color: site.color
                      }}
                    >
                      Sample Text
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <a 
                      href={`/sites/edit/${site.id}`}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden" style={{ borderTop: `4px solid ${site.color}` }}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{site.name}</h3>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: site.color }}></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">Site ID: {site.id}</p>
                <p className="text-sm">
                  Port: <span className="font-mono">{site.port || 'N/A'}</span>
                </p>
                <p className="text-sm">
                  Brand Color: <span className="font-mono">{site.color}</span>
                </p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${site.color}20`,
                      color: site.color
                    }}
                  >
                    Button
                  </span>
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: site.color,
                      color: '#ffffff'
                    }}
                  >
                    Filled
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <a 
                  href={`/sites/edit/${site.id}`} 
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Edit site settings
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">Note</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Creating a new site adds it to the list above, and you can edit its properties.
          Each site requires a unique port number.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          When a new site is created, the system will automatically generate the necessary
          files and configurations. The site will be available at http://localhost:PORT, 
          where PORT is the port number you specified when creating the site.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          After creating a site, you'll need to run <code className="bg-gray-100 dark:bg-zinc-700 px-1 py-0.5 rounded">npx turbo dev --filter=site{'{siteId}'}</code> to start the site's development server.
        </p>
      </div>
    </div>
  );
}
