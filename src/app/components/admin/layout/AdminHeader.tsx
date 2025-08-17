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
      className="bg-surface-0 border-b border-border-default px-4 sm:px-6 py-3 sm:py-4"
      role="banner"
    >
      <div className="flex items-center justify-between">
        {/* Search Section - Hidden on small screens */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary text-sm"
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
            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500"
            aria-label="Search"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-text-tertiary" />
            ) : (
              <MoonIcon className="h-5 w-5 text-text-tertiary" />
            )}
          </button>

          {/* Notifications */}
          <button 
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative focus:ring-2 focus:ring-primary-500"
            aria-label="View notifications"
          >
            <BellIcon className="h-5 w-5 text-text-tertiary" />
            <span 
              className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"
              role="status"
              aria-label="New notifications available"
            />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500"
              aria-label="User menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-text-tertiary" />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-surface-0 rounded-card shadow-soft-lg border border-border-default py-1 z-50"
                role="menu"
                aria-label="User menu options"
              >
                <button 
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-100 focus:bg-surface-100"
                  role="menuitem"
                >
                  <UserCircleIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Profile</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-text-secondary hover:bg-surface-100 focus:bg-surface-100"
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