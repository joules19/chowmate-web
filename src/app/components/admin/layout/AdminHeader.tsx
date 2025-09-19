"use client";

import { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { AuthService } from "../../../lib/auth/auth-service";
import { useForceCloseAllVendorStores } from "../../../lib/hooks/api-hooks.ts/use-vendor";

export default function AdminHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCloseShopConfirm, setShowCloseShopConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const forceCloseAllStoresMutation = useForceCloseAllVendorStores();

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/login';
  };

  const handleCloseAllShops = () => {
    forceCloseAllStoresMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        setShowCloseShopConfirm(false);
        const closedCount = data?.data?.closedCount || 0;
        if (closedCount === 0) {
          setSuccessMessage("No vendor stores were open");
        } else {
          setSuccessMessage(`Successfully closed ${closedCount} vendor store${closedCount > 1 ? 's' : ''}`);
        }
        setTimeout(() => setSuccessMessage(null), 5000);
      },
    });
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

          {/* Close All Shops */}
          <button
            onClick={() => setShowCloseShopConfirm(true)}
            disabled={forceCloseAllStoresMutation.isPending}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-danger-500 hover:bg-danger-600 disabled:bg-danger-300 text-white rounded-lg transition-colors focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            aria-label="Close all vendor shops"
          >
            <XCircleIcon className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {forceCloseAllStoresMutation.isPending ? 'Closing...' : 'Close All Shops'}
            </span>
            <span className="text-xs font-medium sm:hidden">
              {forceCloseAllStoresMutation.isPending ? 'Closing...' : 'Close All'}
            </span>
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
                  <ArrowRightStartOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-success-50 border border-success-200 text-success-800 px-4 py-2 rounded-lg shadow-lg">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showCloseShopConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-0 rounded-card shadow-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <XCircleIcon className="h-6 w-6 text-danger-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                Close All Vendor Shops
              </h3>
            </div>
            <p className="text-text-secondary mb-6">
              This will immediately close all vendor shops and set their status to closed.
              This action cannot be undone. Are you sure you want to continue?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCloseShopConfirm(false)}
                disabled={forceCloseAllStoresMutation.isPending}
                className="flex-1 px-4 py-2 border border-border-default rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseAllShops}
                disabled={forceCloseAllStoresMutation.isPending}
                className="flex-1 px-4 py-2 bg-danger-500 hover:bg-danger-600 disabled:bg-danger-300 text-white rounded-lg transition-colors focus:ring-2 focus:ring-danger-500"
              >
                {forceCloseAllStoresMutation.isPending ? 'Closing...' : 'Close All Shops'}
              </button>
            </div>
            {forceCloseAllStoresMutation.isError && (
              <p className="mt-3 text-sm text-danger-600">
                Failed to close shops. Please try again.
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}