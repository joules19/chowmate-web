"use client";

import { useState } from "react";
import { PlusIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import VendorManagementTable from "../../components/admin/vendors/VendorManagementTable";
import VendorFiltersComponent from "../../components/admin/vendors/VendorFilters";
import { VendorFilters } from "../../data/types/vendor";
import { useVendorStats } from "@/app/lib/hooks/api-hooks.ts/use-vendor";


export default function VendorManagementPage() {
  const [filters, setFilters] = useState<VendorFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  // const [showBulkModal, setShowBulkModal] = useState(false);
  // const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject' | 'suspend'>('approve');

  const { data: stats, isLoading: statsLoading } = useVendorStats();
  // const { data: attentionVendors } = useVendorsRequiringAttention();
  // const exportMutation = useExportVendors();
  // const bulkApproveMutation = useBulkApproveVendors();
  // const bulkRejectMutation = useBulkRejectVendors();
  // const bulkSuspendMutation = useBulkSuspendVendors();

  // const handleExport = () => {
  //     exportMutation.mutate(filters);
  // };

  const handleBulkAction = (action: 'approve' | 'reject' | 'suspend') => {
    if (selectedVendors.length === 0) {
      alert('Please select vendors first');
      return;
    }
    // setBulkActionType(action);
    // setShowBulkModal(true);
    console.log('Bulk action:', action, 'for vendors:', selectedVendors);
  };

  // const handleBulkActionConfirm = async (data: any) => {
  //     try {
  //         switch (bulkActionType) {
  //             case 'approve':
  //                 await bulkApproveMutation.mutateAsync({
  //                     vendorIds: selectedVendors,
  //                     reason: data.reason
  //                 });
  //                 break;
  //             case 'reject':
  //                 await bulkRejectMutation.mutateAsync({
  //                     vendorIds: selectedVendors,
  //                     reason: data.reason
  //                 });
  //                 break;
  //             case 'suspend':
  //                 await bulkSuspendMutation.mutateAsync({
  //                     vendorIds: selectedVendors,
  //                     reason: data.reason
  //                 });
  //                 break;
  //         }
  //         setSelectedVendors([]);
  //     } catch (error) {
  //         console.error('Bulk action failed:', error);
  //     } finally {
  //         setShowBulkModal(false);
  //     }
  // };

  const getStatCard = (title: string, value: number | string, icon: string, color: string, onClick?: () => void) => (
    <div
      className={`bg-surface-0 rounded-card shadow-soft border border-border-light px-3 py-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`h-12 w-12 ${color} rounded-lg flex items-center justify-center`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-surface-primary min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Vendor Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage vendor applications, approvals, and operations
          </p>

          {/* Quick Stats */}
          {stats && !statsLoading && (
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-sm">
                <span className="font-medium text-text-primary">{stats.totalVendors.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Total</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-success-600">{stats.approved.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Approved</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-warning-600">{stats.pendingApproval.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Pending</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-primary-600">{stats.activeVendors.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Active</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-blue-600">{stats.zoneAssignedVendors.toLocaleString()}</span>
                <span className="text-text-tertiary ml-1">Zone Assigned</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-2 lg:gap-3 flex-shrink-0">
          {selectedVendors.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-2 bg-success-500 text-white rounded-button hover:bg-success-600 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              >
                Bulk Approve ({selectedVendors.length})
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-2 bg-danger-500 text-white rounded-button hover:bg-danger-600 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 transition-colors text-sm font-medium"
              >
                Bulk Reject
              </button>
            </div>
          )}

          <button

            disabled={true}
            className="w-full xs:w-auto px-4 py-2.5 bg-blue-500 text-white rounded-button hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50"
            aria-label="Export vendors"
          >
            <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />

            <span className="sm:hidden">Export</span>
          </button>

          <button
            className="w-full xs:w-auto px-4 py-2.5 bg-primary-500 text-white rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
            aria-label="Add new vendor"
          >
            <PlusIcon className="h-4 w-4 inline mr-2" />
            <span className="hidden sm:inline">Add Vendor</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {getStatCard(
            "Total Revenue",
            `₦${stats.totalRevenue.toLocaleString()}`,
            "💰",
            "bg-green-100 text-green-600",
            () => setFilters({ ...filters, sortBy: 'totalRevenue', sortOrder: 'desc' })
          )}

          {getStatCard(
            "Average Rating",
            stats.averageRating.toFixed(1),
            "⭐",
            "bg-yellow-100 text-yellow-600",
            () => setFilters({ ...filters, sortBy: 'rating', sortOrder: 'desc' })
          )}

          {getStatCard(
            "Verified Vendors",
            stats.verifiedVendors.toLocaleString(),
            "✅",
            "bg-blue-100 text-blue-600",
            () => setFilters({ ...filters, isVerified: true })
          )}

          {getStatCard(
            "Suspended",
            stats.suspended.toLocaleString(),
            "⏸️",
            "bg-red-100 text-red-600",
            () => setFilters({ ...filters, status: 'Suspended' })
          )}

          {getStatCard(
            "Manual Review",
            stats.requiresManualReview.toLocaleString(),
            "👁️",
            "bg-purple-100 text-purple-600",
            () => setFilters({ ...filters, status: 'RequiresManualReview' })
          )}

          {getStatCard(
            "New This Week",
            stats.newVendorsThisWeek.toLocaleString(),
            "📈",
            "bg-indigo-100 text-indigo-600",
            () => {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              setFilters({ ...filters, dateFrom: oneWeekAgo.toISOString().split('T')[0] });
            }
          )}
        </div>
      )}

      {/* Priority Alerts */}
      {/* {attentionVendors && attentionVendors.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-warning-600" />
              <h3 className="text-sm font-medium text-warning-800">
                {attentionVendors.length} Vendor(s) Requiring Attention
              </h3>
            </div>
            <button
              onClick={() => {
                // Set filters to show vendors requiring attention
                setFilters({
                  ...filters,
                  status: 'RequiresManualReview'
                });
              }}
              className="text-sm text-warning-700 hover:text-warning-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {attentionVendors.slice(0, 5).map((vendor) => (
              <span
                key={vendor.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800"
              >
                {vendor.businessName}
              </span>
            ))}
            {attentionVendors.length > 5 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-200 text-warning-800">
                +{attentionVendors.length - 5} more
              </span>
            )}
          </div>
        </div>
      )} */}

      {/* Performance Metrics */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Avg Approval Time</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats.averageApprovalTime ? `${stats.averageApprovalTime}h` : 'N/A'}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-sm">⏱️</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Avg Compliance</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats.averageComplianceScore ? `${stats.averageComplianceScore.toFixed()}%` : 'N/A'}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Issues Detected</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats.vendorsWithIssues || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Growth Rate</p>
                <p className="text-xl font-bold text-text-primary">
                  {stats.totalVendors > 0 ?
                    `+${Math.round((stats.newVendorsThisMonth / stats.totalVendors) * 100)}%` :
                    '0%'
                  }
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <VendorFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Vendor Table */}
      <VendorManagementTable
        filters={filters}
        onFiltersChange={setFilters}
        selectedVendors={selectedVendors}
        onSelectionChange={setSelectedVendors}
      />

      {/* Bulk Action Modal */}
      {/* <BulkActionModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onConfirm={handleBulkActionConfirm}
        action={bulkActionType}
        selectedCount={selectedVendors.length}
        isLoading={bulkApproveMutation.isPending || bulkRejectMutation.isPending || bulkSuspendMutation.isPending}
      /> */}
    </div>
  );
}