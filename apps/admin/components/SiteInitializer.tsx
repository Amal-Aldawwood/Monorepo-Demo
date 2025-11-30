"use client";

import { useEffect, useState } from 'react';

export function SiteInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the site constants on component mount
    const initializeSites = async () => {
      try {
        const response = await fetch('/api/init');
        
        if (!response.ok) {
          throw new Error('Failed to initialize site constants');
        }
        
        const data = await response.json();
        console.log('Site constants initialized successfully:', data);
        setInitialized(true);
      } catch (err) {
        console.error('Error initializing site constants:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    initializeSites();
  }, []);

  // This component doesn't render anything visible
  return null;
}

export default SiteInitializer;
