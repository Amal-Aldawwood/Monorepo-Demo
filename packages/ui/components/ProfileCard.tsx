import React from 'react';
import { Card } from './Card';
import { SITE_NAMES } from '@repo/shared';

interface ProfileCardProps {
  id: number;
  name: string;
  age: number;
  isOwn: boolean;
  sourceSiteId?: number;
  siteColor: string;
}

export const ProfileCard = ({
  id,
  name,
  age,
  isOwn,
  sourceSiteId,
  siteColor
}: ProfileCardProps) => {
  return (
    <Card
      className="mb-4"
      color={isOwn ? siteColor : undefined}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400">Age: {age}</p>
          
          {!isOwn && sourceSiteId && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              📤 From {SITE_NAMES[sourceSiteId]}
            </div>
          )}
        </div>
        
        {isOwn && (
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
            style={{ backgroundColor: `${siteColor}20`, color: siteColor }}
          >
            Your Profile
          </span>
        )}
      </div>
    </Card>
  );
};
