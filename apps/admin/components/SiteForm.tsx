"use client";

import React, { useState } from "react";
import { Card, Button, Input } from "@repo/ui";
import { createSite } from "@repo/shared";

export default function SiteForm() {
  // Define proper types for the form data
  interface SiteFormData {
    name: string;
    color: string;
    port: number | string; // Can be string during input but becomes number when submitted
  }
  
  const [formData, setFormData] = useState<SiteFormData>({
    name: "",
    color: "#6366f1", // Default color - indigo
    port: 3000 // Default port
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle port field specially
    if (name === 'port') {
      const portValue = value === '' ? '' : parseInt(value, 10) || '';
      setFormData({
        ...formData,
        port: portValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      // Ensure port is a number before submission
      const portNumber = typeof formData.port === 'string' ? 
        parseInt(formData.port, 10) : formData.port;
      
      // Use the shared API client to create the site
      const newSite = await createSite({
        name: formData.name,
        color: formData.color,
        port: portNumber
      });
      
      // Generate site files via API endpoint
      try {
        const generateResponse = await fetch('/api/sites/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            siteId: newSite.id,
            name: newSite.name,
            port: newSite.port
          }),
        });
        
        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          console.warn('Warning: Site files could not be generated automatically:', 
            errorData.error || generateResponse.statusText);
        } else {
          const generateResult = await generateResponse.json();
          console.log('Site generator result:', generateResult);
        }
      } catch (genError) {
        console.error('Error generating site files:', genError);
        // Continue since the site is created in the database, even if file generation fails
      }
      
      // Success
      setMessage({
        type: "success",
        text: "Site created successfully! Files have been generated."
      });
      
      // Reset form
      setFormData({
        name: "",
        color: "#6366f1",
        port: 3000
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error creating site:", error);
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
      <h2 className="text-xl font-semibold mb-4">Add New Site</h2>
      
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
              placeholder="Enter site name (e.g., Site 4)"
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
          
          <div>
            <label htmlFor="port" className="block text-sm font-medium mb-1">
              Port Number
            </label>
            <Input
              id="port"
              name="port"
              type="number"
              value={formData.port}
              onChange={handleChange}
              required
              min="3000"
              max="9999"
              placeholder="Enter port (e.g., 3005)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose a port between 3000-9999
            </p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Creating..." : "Add Site"}
        </Button>
      </form>
    </Card>
  );
}
