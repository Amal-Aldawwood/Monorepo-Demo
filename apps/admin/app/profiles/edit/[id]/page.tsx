import React from 'react';
import { getProfileById } from '@repo/database';
import { notFound } from 'next/navigation';
import ProfileEditForm from '../../../../components/ProfileEditForm';

export const dynamic = 'force-dynamic';

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  const profileId = parseInt(params.id);
  
  // Fetch profile data
  const profile = await getProfileById(profileId);
  
  // If profile not found, display 404
  if (!profile) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <ProfileEditForm profile={profile} />
    </div>
  );
}
