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

interface CustomerEditFormProps {
  customer: Customer;
}

export default function CustomerEditForm({ customer }: CustomerEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    siteId: customer.siteId.toString() || "1",
    color: customer.color || SITE_COLORS[1]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If site changes, update the color automatically
    if (name === "siteId") {
      setFormData({
        ...formData,
        siteId: value,
        color: SITE_COLORS[parseInt(value)]
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
      const response = await fetch(`/api/customers?id=${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          siteId: parseInt(formData.siteId),
          color: formData.color
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update customer");
      }
      
      // Success
      setMessage({
        type: "success",
        text: "Customer updated successfully!"
      });
      
      // Navigate back to customers page after a short delay
      setTimeout(() => {
        router.push('/customers');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating customer:", error);
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
      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
      
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
              Customer Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label htmlFor="siteId" className="block text-sm font-medium mb-1">
              Site
            </label>
            <select
              id="siteId"
              name="siteId"
              value={formData.siteId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="1">{SITE_NAMES[1]}</option>
              <option value="2">{SITE_NAMES[2]}</option>
              <option value="3">{SITE_NAMES[3]}</option>
            </select>
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
