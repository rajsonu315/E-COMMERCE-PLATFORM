'use client';

import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none lg:hidden">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <span className="mr-4 text-gray-600">
            Welcome, <b>{user?.email}</b>
          </span>
        </div>
        
        <button
            onClick={logout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
        >
            Logout
        </button>
      </div>
    </header>
  );
}
