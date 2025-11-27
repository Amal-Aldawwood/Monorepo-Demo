import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Layout } from "lucide-react"; // Changed to a valid icon

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Manage customers and profiles across all sites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="logo">
              <div className="logo-icon">
                <Layout size={16} />
              </div>
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
