"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "@repo/ui";
import { useRouter } from "next/navigation";

interface Site {
  id: number;
  name: string;
  color: string;
  isActive?: boolean;
}

interface SiteEditFormProps {
  site: Site;
}

export default function SiteEditForm({ site }: SiteEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: site.name || "",
    color: site.color || "#6366f1", // Default color - indigo
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const response = await fetch(`/api/sites?id=${site.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update site");
      }
      
      // Success
      setMessage({
        type: "success",
        text: data.message || "Site updated successfully!"
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        router.push('/sites');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating site:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this site?")) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const response = await fetch(`/api/sites?id=${site.id}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete site");
      }
      
      // Success
      setMessage({
        type: "success",
        text: data.message || "Site deleted successfully!"
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/sites');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error deleting site:", error);
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
      <h2 className="text-xl font-semibold mb-4">Edit Site</h2>
      
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
              Site Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter site name"
            />
          </div>
          
          <div>
            <label htmlFor="color" className="block text-sm font-medium mb-1">
              Brand Color
            </label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-10 p-0 border cursor-pointer"
                style={{ padding: 0 }}
              />
              <span className="text-sm">{formData.color}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Saving..." : "Update Site"}
          </Button>
          
          <Button 
            type="button"
            onClick={() => router.back()}
            className="w-full md:w-auto"
            variant="outline"
          >
            Cancel
          </Button>
          
          <Button 
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="w-full md:w-auto ml-auto bg-red-500 hover:bg-red-600 text-white"
            variant="secondary"
          >
            {isSubmitting ? "Deleting..." : "Delete Site"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
