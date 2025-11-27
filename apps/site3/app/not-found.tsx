import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col items-center gap-4">
        <p>
          This is <span className="font-semibold text-[#8b5cf6]">Site 3</span> which allows you to register profiles.
        </p>
        <p className="mb-6">
          Did you mean to visit:
        </p>
        <div className="grid gap-4">
          <Link 
            href="/"
            className="bg-[#8b5cf6] text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
          >
            Site 3 Homepage
          </Link>
          <p className="text-sm mt-2 text-gray-500">
            If you're looking for the dashboard, it's available in the admin application.
          </p>
        </div>
      </div>
    </div>
  );
}
