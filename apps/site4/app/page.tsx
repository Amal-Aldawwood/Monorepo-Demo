"use client";

import { useEffect, useState } from "react";
import { Card, Button, ProfileCard } from "@repo/ui";
import { ProfileData, getProfiles } from "@repo/shared";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<{
    ownProfiles: ProfileData[];
    sharedProfiles: ProfileData[];
  }>({
    ownProfiles: [],
    sharedProfiles: []
  });

  // Fetch profiles when component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <main>
      <section className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Profiles on Site 4</h1>
        <p className="mb-6">
          View and manage profiles associated with this site.
        </p>
        
        {loading ? (
          <div className="py-8 text-center">Loading profiles...</div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Site 4 Profiles ({profiles.ownProfiles.length})
              </h2>
              {profiles.ownProfiles.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    No profiles found for Site 4.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.ownProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      id={profile.id}
                      name={profile.name}
                      age={profile.age}
                      isOwn={true}
                      siteColor={profile.customer.color}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Shared Profiles ({profiles.sharedProfiles.length})
              </h2>
              {profiles.sharedProfiles.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="mb-4 text-gray-500 dark:text-gray-400">
                    No profiles have been shared with Site 4.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.sharedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      id={profile.id}
                      name={profile.name}
                      age={profile.age}
                      isOwn={false}
                      sourceSiteId={profile.customer.siteId}
                      siteColor={profile.customer.color}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
