"use client";

import { useState } from "react";
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { AuthService } from "../../../lib/auth/auth-service";

export default function AdminHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  return (
    <header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4"
      role="banner"
    >
      <div className="flex items-center justify-between">
        {/* Search Section - Hidden on small screens */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              aria-label="Search admin dashboard"
            />
          </div>
        </div>

        {/* Mobile spacer */}
        <div className="md:hidden lg:ml-16" />

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Search Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {/* Notifications */}
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative focus:ring-2 focus:ring-primary-500"
            aria-label="View notifications"
          >
            <BellIcon className="h-5 w-5 text-gray-500" />
            <span 
              className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
              role="status"
              aria-label="New notifications available"
            />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-primary-500"
              aria-label="User menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                role="menu"
                aria-label="User menu options"
              >
                <button 
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  role="menuitem"
                >
                  <UserCircleIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                  role="menuitem"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}