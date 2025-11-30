"use client";

import React, { useState, useEffect } from "react";
import { Card, Input, Button, ProfileCard } from "@repo/ui";
import { SITE_COLORS } from "@repo/shared";

interface Profile {
  id: number;
  name: string;
  age: number;
  customerId: number;
  sharedWith: string | null;
  createdAt: Date;
  customer: {
    id: number;
    name: string;
    email: string;
    siteId: number;
    color: string;
  };
}

export default function Site1Page() {
  const SITE_ID = 1;
  
  const [ownProfiles, setOwnProfiles] = useState<Profile[]>([]);
  const [sharedProfiles, setSharedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    shareWithSite2: false,
    shareWithSite3: false
  });

  // Fetch profiles from the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/profiles");
        
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        
        const data = await response.json();
        setOwnProfiles(data.data.ownProfiles);
        setSharedProfiles(data.data.sharedProfiles);
        setLoading(false);
      } catch (err) {
        setError("Error loading profiles. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchProfiles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.age) return;

    // Create sharedWith array based on checkboxes
    const sharedWith: number[] = [];
    if (formData.shareWithSite2) sharedWith.push(2);
    if (formData.shareWithSite3) sharedWith.push(3);
    
    try {
      // Create the profile - we don't need to specify customerId anymore
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          sharedWith: sharedWith.length > 0 ? sharedWith : null
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to create profile");
      }
      
      // Refresh profiles
      const profilesResponse = await fetch("/api/profiles");
      const data = await profilesResponse.json();
      setOwnProfiles(data.data.ownProfiles);
      setSharedProfiles(data.data.sharedProfiles);
      
      // Reset form
      setFormData({
        name: "",
        age: "",
        shareWithSite2: false,
        shareWithSite3: false
      });
      
    } catch (err) {
      console.error(err);
      // In a real app, you'd show a proper error message
      alert("Error creating profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Card className="p-6 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Profile Form */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Add Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">
                Age
              </label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
              />
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Share with:</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="shareWithSite2"
                    checked={formData.shareWithSite2}
                    onChange={handleChange}
                  />
                  <span>Site 2</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="shareWithSite3"
                    checked={formData.shareWithSite3}
                    onChange={handleChange}
                  />
                  <span>Site 3</span>
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
        </Card>
        
        {/* Profiles List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Profiles</h2>
          <div className="space-y-4">
            {ownProfiles.length === 0 ? (
              <Card className="p-4 text-center text-gray-500">
                No profiles created yet
              </Card>
            ) : (
              ownProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  name={profile.name}
                  age={profile.age}
                  isOwn={true}
                  sourceSiteId={undefined}
                  siteColor={SITE_COLORS[1]}
                />
              ))
            )}
          </div>

          {sharedProfiles.length > 0 && (
            <>
              <h2 className="text-xl font-bold my-4">Shared With You</h2>
              <div className="space-y-4">
                {sharedProfiles.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    id={profile.id}
                    name={profile.name}
                    age={profile.age}
                    isOwn={false}
                    sourceSiteId={profile.customer.siteId}
                    siteColor={SITE_COLORS[profile.customer.siteId]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
