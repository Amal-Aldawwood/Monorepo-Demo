"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "@repo/ui";
import { SITE_NAMES, SITE_COLORS } from "@repo/shared";
import { useRouter } from "next/navigation";

type Customer = {
  id: number;
  name: string;
  email: string;
  siteId: number;
  color: string;
};

type Profile = {
  id: number;
  name: string;
  age: number;
  customerId: number;
  sharedWith: string | null; // JSON string of site IDs
  customer?: Customer;
  createdAt: string;
};

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);
  
  // Parse shared sites from JSON string
  const parseSharedSites = (sharedWith: string | null): number[] => {
    if (!sharedWith) return [];
    
    try {
      return JSON.parse(sharedWith);
    } catch {
      return [];
    }
  };
  
  const [formData, setFormData] = useState({
    name: profile.name || "",
    age: profile.age.toString() || "",
    customerId: profile.customerId.toString() || "",
    sharedWith: parseSharedSites(profile.sharedWith)
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        
        if (response.ok && data.data) {
          setAvailableCustomers(data.data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    
    fetchCustomers();
  }, []);
  
  // All available sites for sharing
  const availableSites = [1, 2, 3];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const siteId = parseInt(name.replace("site", ""));
    
    setFormData(prev => ({
      ...prev,
      sharedWith: checked
        ? [...prev.sharedWith, siteId]
        : prev.sharedWith.filter(id => id !== siteId)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields"
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const response = await fetch(`/api/profiles?id=${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          customerId: formData.customerId ? parseInt(formData.customerId) : undefined,
          sharedWith: formData.sharedWith.length > 0 ? formData.sharedWith : null
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      // Success
      setMessage({
        type: "success",
        text: "Profile updated successfully!"
      });
      
      // Navigate back to profiles page after a short delay
      setTimeout(() => {
        router.push('/profiles');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === "success" 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter profile name"
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
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="Enter age"
            />
          </div>
          
          {/* Customer selection */}
          <div className="md:col-span-2">
            <label htmlFor="customerId" className="block text-sm font-medium mb-1">
              Customer
            </label>
            {availableCustomers.length > 0 ? (
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-zinc-800 dark:border-zinc-700"
              >
                {availableCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({SITE_NAMES[customer.siteId]})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-red-500 text-sm">
                No customers available. Please create a customer first.
              </div>
            )}
          </div>
          
          {/* Sharing options */}
          {availableSites.length > 0 && (
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <p className="block text-sm font-medium mb-2">
                Share with sites:
              </p>
              <div className="flex flex-wrap gap-3">
                {availableSites.map(siteId => (
                  <label 
                    key={siteId}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md"
                    style={{ 
                      backgroundColor: `${SITE_COLORS[siteId]}10`,
                      borderColor: `${SITE_COLORS[siteId]}30`
                    }}
                  >
                    <input
                      type="checkbox"
                      name={`site${siteId}`}
                      checked={formData.sharedWith.includes(siteId)}
                      onChange={handleCheckboxChange}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span style={{ color: SITE_COLORS[siteId] }}>
                      {SITE_NAMES[siteId]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4 pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
          
          <Button 
            type="button" 
            onClick={() => router.back()}
            className="w-full md:w-auto"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
