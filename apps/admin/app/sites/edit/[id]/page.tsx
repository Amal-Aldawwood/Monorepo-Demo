import React from 'react';
import { getSiteById } from '@repo/database';
import { notFound } from 'next/navigation';
import SiteEditForm from '../../../../components/SiteEditForm';

export const dynamic = 'force-dynamic';

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const siteId = parseInt(params.id);
  
  // Fetch site data
  const site = await getSiteById(siteId);
  
  // If site not found, display 404
  if (!site) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Site</h1>
      <SiteEditForm site={site} />
    </div>
  );
}
