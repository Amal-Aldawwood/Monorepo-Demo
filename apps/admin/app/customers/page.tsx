import React from 'react';
import { Card, Button, Input } from '@repo/ui';
import { getAllCustomers } from '@repo/database';
import { SITE_NAMES, SITE_COLORS } from '@repo/shared';
import CustomerForm from '../components/CustomerForm';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  // Fetch real customers data from the API
  const customers = await getAllCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      
      <CustomerForm />
      
      <Card className="overflow-hidden mt-8">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Site</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Profiles</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
                <td className="px-4 py-3 text-sm">{customer.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{customer.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${SITE_COLORS[customer.siteId]}20`,
                      color: SITE_COLORS[customer.siteId]
                    }}
                  >
                    {SITE_NAMES[customer.siteId]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{customer.email}</td>
                <td className="px-4 py-3 text-sm">{customer.profiles.length}</td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <a href={`/customers/edit/${customer.id}`} className="text-primary hover:underline">Edit</a>
                  <a href={`/profiles?customerId=${customer.id}`} className="text-primary hover:underline">Profiles</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
