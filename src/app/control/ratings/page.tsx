"use client";

import { useState } from "react";
import PermissionGuard from "../../components/admin/guards/PermissionGuard";
import { Permission } from "../../data/types/permissions";
import VendorRatings from "../../components/admin/ratings/VendorRatings";
import RiderRatings from "../../components/admin/ratings/RiderRatings";

type TabType = 'vendors' | 'riders';

export default function RatingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vendors');

  return (
    <PermissionGuard permission={Permission.VIEW_VENDORS}>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-surface-primary min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
              Ratings & Reviews
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              View and manage vendor and rider ratings
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
          <div className="border-b border-border-light overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors touch-manipulation ${
                  activeTab === 'vendors'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
                }`}
              >
                Vendor Ratings
              </button>
              <button
                onClick={() => setActiveTab('riders')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors touch-manipulation ${
                  activeTab === 'riders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
                }`}
              >
                Rider Ratings
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'vendors' && <VendorRatings />}
            {activeTab === 'riders' && <RiderRatings />}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
