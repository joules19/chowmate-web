"use client";

import { useState } from "react";
import AdvertisementManagementTable from "../../components/admin/advertisements/AdvertisementManagementTable";
import AdvertisementFiltersComponent from "../../components/admin/advertisements/AdvertisementFilters";
import CreateEditAdvertisementModal from "../../components/admin/advertisements/CreateEditAdvertisementModal";
import PermissionGuard from "../../components/admin/guards/PermissionGuard";
import { AdvertisementFilters, Advertisement } from "../../data/types/advertisement";
import { Permission } from "../../data/types/permissions";
import { useAdvertisements } from "@/app/lib/hooks/api-hooks.ts/use-advertisement";

export default function AdvertisementManagementPage() {
  const [filters, setFilters] = useState<AdvertisementFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | undefined>();

  const { data: advertisementsResponse } = useAdvertisements(filters);

  const handleCreateClick = () => {
    setEditingAdvertisement(undefined);
    setShowCreateModal(true);
  };

  const handleEditClick = (advertisement: Advertisement) => {
    setEditingAdvertisement(advertisement);
    setShowCreateModal(true);
  };

  const handleDetailsClick = (advertisement: Advertisement) => {
    // Details view functionality can be implemented later if needed
    console.log('View details for:', advertisement.id);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingAdvertisement(undefined);
  };

  const getQuickStats = () => {
    const advertisements = advertisementsResponse?.items || [];
    const totalCount = advertisementsResponse?.totalCount || 0;
    const activeCount = advertisements.filter(ad => ad.isActive).length;
    const inactiveCount = advertisements.filter(ad => !ad.isActive).length;

    const userTypeBreakdown = advertisements.reduce((acc, ad) => {
      acc[ad.userType] = (acc[ad.userType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      customer: userTypeBreakdown.customer || 0,
      vendor: userTypeBreakdown.vendor || 0,
      rider: userTypeBreakdown.rider || 0
    };
  };

  const stats = getQuickStats();

  return (
    <PermissionGuard permission={Permission.VIEW_ADVERTISEMENTS}>
      <div className="space-y-6 p-6 bg-surface-primary min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Advertisement Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Create and manage advertisement campaigns across different user types
          </p>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6 mt-4">
            <div className="text-sm">
              <span className="font-medium text-text-primary">{stats.total.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Total</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-success-600">{stats.active.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Active</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-600">{stats.inactive.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Inactive</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-blue-600">{stats.customer.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Customer</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-green-600">{stats.vendor.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Vendor</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-purple-600">{stats.rider.toLocaleString()}</span>
              <span className="text-text-tertiary ml-1">Rider</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Campaigns</p>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📢</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Active Campaigns</p>
              <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Customer Ads</p>
              <p className="text-2xl font-bold text-text-primary">{stats.customer}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Vendor Ads</p>
              <p className="text-2xl font-bold text-text-primary">{stats.vendor}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AdvertisementFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Advertisement Table */}
      <AdvertisementManagementTable
        filters={filters}
        onFiltersChange={setFilters}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDetailsClick={handleDetailsClick}
      />

      {/* Create/Edit Modal */}
      <CreateEditAdvertisementModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        advertisement={editingAdvertisement}
      />
      </div>
    </PermissionGuard>
  );
}