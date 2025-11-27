import React from 'react';
import { getCustomerById } from '@repo/database';
import { notFound } from 'next/navigation';
import CustomerEditForm from '../../../../components/CustomerEditForm';

export const dynamic = 'force-dynamic';

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customerId = parseInt(params.id);
  
  // Fetch customer data
  const customer = await getCustomerById(customerId);
  
  // If customer not found, display 404
  if (!customer) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
      <CustomerEditForm customer={customer} />
    </div>
  );
}
