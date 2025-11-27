import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Site 2",
  description: "Customer Site 2 - Add and share profiles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <div className="max-w-5xl mx-auto p-6">
            <header className="mb-8">
              <div className="logo">
                <div className="logo-icon">
                  <Users size={16} />
                </div>
                <span>Site 2</span>
                <div className="site-badge ml-2">Site 2</div>
              </div>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
