import React from 'react';
import { Card } from '@repo/ui';

export default function DashboardPage() {
  // This would normally fetch data from the API
  const stats = {
    customers: {
      total: 3,
      site1: 1,
      site2: 1,
      site3: 1,
    },
    profiles: {
      total: 4,
      site1: 2,
      site2: 1,
      site3: 1,
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">{stats.customers.total}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Profiles</h3>
          <p className="text-3xl font-bold">{stats.profiles.total}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Shared Profiles</h3>
          <p className="text-3xl font-bold">3</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Sites</h3>
          <p className="text-3xl font-bold">3</p>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Site Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Site 1" color="#10b981">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Customers:</span>
              <span className="font-semibold">{stats.customers.site1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Profiles:</span>
              <span className="font-semibold">{stats.profiles.site1}</span>
            </div>
          </div>
        </Card>
        <Card title="Site 2" color="#f59e0b">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Customers:</span>
              <span className="font-semibold">{stats.customers.site2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Profiles:</span>
              <span className="font-semibold">{stats.profiles.site2}</span>
            </div>
          </div>
        </Card>
        <Card title="Site 3" color="#8b5cf6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Customers:</span>
              <span className="font-semibold">{stats.customers.site3}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Profiles:</span>
              <span className="font-semibold">{stats.profiles.site3}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
