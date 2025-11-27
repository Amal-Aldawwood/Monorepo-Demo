import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-gray-800 h-screen p-6">
      <div className="flex flex-col h-full">
        <div className="space-y-6 flex-1">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors bg-primary text-white"
            >
              <span>Dashboard</span>
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <span>Customers</span>
            </Link>
            <Link
              href="/profiles"
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <span>Profiles</span>
            </Link>
            <Link
              href="/sites"
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <span>Sites</span>
            </Link>
            <Link
              href="/data"
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <span>Data</span>
            </Link>
          </nav>
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
