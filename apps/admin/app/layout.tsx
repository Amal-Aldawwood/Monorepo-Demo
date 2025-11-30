import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import SiteInitializer from "../components/SiteInitializer";

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
              <h1 className="text-xl font-semibold mb-2">Admin Dashboard</h1>
            </div>
            {/* Initialize site constants */}
            <SiteInitializer />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
