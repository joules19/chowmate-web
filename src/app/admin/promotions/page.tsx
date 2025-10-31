"use client";

import { useState } from "react";
import PromotionManagementTable from "../../components/admin/promotions/PromotionManagementTable";
import PromotionFilters from "../../components/admin/promotions/PromotionFilters";
import CreateEditPromotionModal from "../../components/admin/promotions/CreateEditPromotionModal";
import BulkPromotionModal from "../../components/admin/promotions/BulkPromotionModal";
import PromotionStatsCards from "../../components/admin/promotions/PromotionStatsCards";
import PermissionGuard from "../../components/admin/guards/PermissionGuard";
import { PromotionFilters as IPromotionFilters, ProductPromotion } from "../../data/types/promotion";
import { Permission } from "../../data/types/permissions";
import { usePromotions, usePromotionStats } from "../../lib/hooks/api-hooks/use-promotions";

export default function PromotionManagementPage() {
  const [filters, setFilters] = useState<IPromotionFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<ProductPromotion | undefined>();

  const { data: promotionsResponse, isLoading } = usePromotions(filters);
  const { data: statsResponse } = usePromotionStats();

  const handleCreateClick = () => {
    setEditingPromotion(undefined);
    setShowCreateModal(true);
  };

  const handleEditClick = (promotion: ProductPromotion) => {
    setEditingPromotion(promotion);
    setShowCreateModal(true);
  };

  const handleBulkPromotionClick = () => {
    setShowBulkModal(true);
  };

  const handleDetailsClick = (promotion: ProductPromotion) => {
    console.log('View details for:', promotion.id);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingPromotion(undefined);
  };

  const handleBulkModalClose = () => {
    setShowBulkModal(false);
  };

  const getQuickStats = () => {
    const promotions = promotionsResponse?.items || [];
    const totalCount = promotionsResponse?.totalCount || 0;
    const activeCount = promotions.filter(p => p.isActive).length;
    const inactiveCount = promotions.filter(p => !p.isActive).length;

    const now = new Date();
    const expiredCount = promotions.filter(p =>
      p.endDate && new Date(p.endDate) < now
    ).length;

    const scheduledCount = promotions.filter(p =>
      p.startDate && new Date(p.startDate) > now
    ).length;

    return {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      expired: expiredCount,
      scheduled: scheduledCount
    };
  };

  const stats = getQuickStats();

  return (
    <PermissionGuard permission={Permission.VIEW_PROMOTIONS}>
      <div className="space-y-6 p-6 bg-surface-primary min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Product Promotions Management
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Create and manage product promotions, discounts, and special offers
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
                <span className="font-medium text-orange-600">{stats.expired.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Expired</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-blue-600">{stats.scheduled.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <PromotionStatsCards stats={statsResponse} />

        {/* Filters */}
        <PromotionFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Promotion Table */}
        <PromotionManagementTable
          filters={filters}
          onFiltersChange={setFilters}
          onCreateClick={handleCreateClick}
          onEditClick={handleEditClick}
          onDetailsClick={handleDetailsClick}
          onBulkPromotionClick={handleBulkPromotionClick}
          isLoading={isLoading}
        />

        {/* Create/Edit Modal */}
        <CreateEditPromotionModal
          isOpen={showCreateModal}
          onClose={handleModalClose}
          promotion={editingPromotion}
        />

        {/* Bulk Promotion Modal */}
        <BulkPromotionModal
          isOpen={showBulkModal}
          onClose={handleBulkModalClose}
        />
      </div>
    </PermissionGuard>
  );
}