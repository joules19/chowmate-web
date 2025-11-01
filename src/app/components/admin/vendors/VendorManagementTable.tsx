"use client";

import { useState } from 'react';
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PauseIcon,
  PlayIcon,
  MapPinIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  StarIcon,
  ArrowUturnLeftIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { VendorFilters, VendorSummary, VendorStatus, ApproveVendorRequest, RejectVendorRequest, SuspendVendorRequest, ActivateVendorRequest } from "../../../data/types/vendor";

// Utility function to convert numeric status to string enum
const getVendorStatus = (status: VendorStatus | number): VendorStatus => {
  if (typeof status === 'number') {
    switch (status) {
      case 0: return VendorStatus.PendingApproval;
      case 1: return VendorStatus.Approved;
      case 2: return VendorStatus.UnderReview;
      case 3: return VendorStatus.Suspended;
      case 4: return VendorStatus.Rejected;
      case 5: return VendorStatus.RequiresManualReview;
      case 6: return VendorStatus.Inactive;
      default: return VendorStatus.PendingApproval;
    }
  }
  return status;
};

type VendorActionData = ApproveVendorRequest | RejectVendorRequest | SuspendVendorRequest | ActivateVendorRequest;

import ZoneAssignmentModal from './ZoneAssignmentModal';
import { useVendors, useApproveVendor, useRejectVendor, useSuspendVendor, useActivateVendor, useSendBackToPending } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import InstructionModal from './SendInstructionModal';
import VendorActionModal from './VendorActionModal';
import VendorDetailsModal from './VendorDetailsModal';
import SendBackToPendingModal from './SendBackToPendingModal';
import SendOtpModal from '../users/SendOtpModal';
import { formatCurrency } from '@/app/lib/utils/currency';

interface Props {
  filters: VendorFilters;
  onFiltersChange: (filters: VendorFilters) => void;
  selectedVendors: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const getStatusBadge = (status: VendorStatus | number) => {
  const normalizedStatus = getVendorStatus(status);
  const statusConfig = {
    [VendorStatus.PendingApproval]: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      label: 'Pending Approval'
    },
    [VendorStatus.Approved]: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      label: 'Approved'
    },
    [VendorStatus.UnderReview]: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      label: 'Under Review'
    },
    [VendorStatus.Suspended]: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      label: 'Suspended'
    },
    [VendorStatus.Rejected]: {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      label: 'Rejected'
    },
    [VendorStatus.RequiresManualReview]: {
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      label: 'Manual Review'
    },
    [VendorStatus.Inactive]: {
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      label: 'Inactive'
    }
  };

  const config = statusConfig[normalizedStatus] || {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    label: 'Unknown'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function VendorManagementTable({ filters, onFiltersChange, selectedVendors, onSelectionChange }: Props) {
  const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showSendBackModal, setShowSendBackModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'activate'>('approve');

  const { data: vendorsData, isLoading, error, refetch } = useVendors(filters);
  const approveMutation = useApproveVendor();
  const rejectMutation = useRejectVendor();
  const suspendMutation = useSuspendVendor();
  const activateMutation = useActivateVendor();
  const sendBackToPendingMutation = useSendBackToPending();

  // Move vendors declaration here, before it's used
  const vendors = vendorsData?.items || [];
  const pagination = vendorsData ? {
    pageNumber: vendorsData.pageNumber,
    pageSize: vendorsData.pageSize,
    totalCount: vendorsData.totalCount,
    totalPages: vendorsData.totalCount
  } : null;

  const handleSort = (sortBy: string) => {
    const currentOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: currentOrder,
      pageNumber: 1,
    });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, pageNumber: page });
  };

  const handleViewVendor = (vendor: VendorSummary) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const handleActionClick = (
    type: 'approve' | 'reject' | 'suspend' | 'activate',
    vendor: VendorSummary
  ) => {
    setSelectedVendor(vendor);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleZoneAssignment = (vendor: VendorSummary) => {
    setSelectedVendor(vendor);
    setShowZoneModal(true);
  };

  const handleSendInstruction = (vendor: VendorSummary) => {
    setSelectedVendor(vendor);
    setShowInstructionModal(true);
  };

  const handleSendBackToPending = (vendor: VendorSummary) => {
    console.log('Send back to pending clicked for vendor:', vendor);
    setSelectedVendor(vendor);
    setShowSendBackModal(true);
  };

  const handleSendOtp = (vendor: VendorSummary) => {
    setSelectedVendor(vendor);
    setShowOtpModal(true);
  };

  const handleConfirmSendBackToPending = async (message: string) => {
    if (!selectedVendor) return;
    
    console.log('Confirming send back to pending:', { vendorId: selectedVendor.id, message });
    
    try {
      await sendBackToPendingMutation.mutateAsync({
        vendorId: selectedVendor.id,
        message: message
      });
      console.log('Successfully sent vendor back to pending');
    } catch (error) {
      console.error('Failed to send vendor back to pending:', error);
    } finally {
      setShowSendBackModal(false);
      setSelectedVendor(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allVendorIds = vendors.map((v: VendorSummary) => v.id);
      onSelectionChange([...Array.from(new Set([...selectedVendors, ...allVendorIds]))]);
    } else {
      const vendorIds = vendors.map((v: VendorSummary) => v.id);
      onSelectionChange(selectedVendors.filter(id => !vendorIds.includes(id)));
    }
  };

  const handleSelectVendor = (vendorId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedVendors, vendorId]);
    } else {
      onSelectionChange(selectedVendors.filter(id => id !== vendorId));
    }
  };

  const isAllSelected = vendors.length > 0 && vendors.every(v => selectedVendors.includes(v.id));
  const isIndeterminate = vendors.some(v => selectedVendors.includes(v.id)) && !isAllSelected;

  const handleConfirmAction = async (data: VendorActionData) => {
    if (!selectedVendor) return;

    try {
      switch (actionType) {
        case 'approve':
          await approveMutation.mutateAsync({
            vendorId: selectedVendor.id,
            request: data as ApproveVendorRequest
          });
          break;
        case 'reject':
          await rejectMutation.mutateAsync({
            vendorId: selectedVendor.id,
            request: data as RejectVendorRequest
          });
          break;
        case 'suspend':
          await suspendMutation.mutateAsync({
            vendorId: selectedVendor.id,
            request: data as SuspendVendorRequest
          });
          break;
        case 'activate':
          await activateMutation.mutateAsync({
            vendorId: selectedVendor.id,
            request: data as ActivateVendorRequest
          });
          break;
      }
    } catch (error) {
      console.error(`Failed to ${actionType} vendor:`, error);
    } finally {
      setShowActionModal(false);
      setSelectedVendor(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-100 rounded mb-4 w-40"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="h-16 bg-surface-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="bg-danger-50 border border-danger-200 rounded-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-danger-600">Failed to load vendors: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-3 py-1.5 bg-danger-100 hover:bg-danger-200 text-danger-700 rounded-button text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ?
      <ChevronUpIcon className="h-4 w-4" /> :
      <ChevronDownIcon className="h-4 w-4" />;
  };

  return (
    <>
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-border-light bg-surface-50">
          <h3 className="text-lg font-semibold text-text-primary">
            Vendors ({pagination?.totalCount || 0})
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('businessName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Business</span>
                    {getSortIcon('businessName')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('rating')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rating</span>
                    {getSortIcon('rating')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('totalOrders')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Orders</span>
                    {getSortIcon('totalOrders')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('totalRevenue')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Revenue</span>
                    {getSortIcon('totalRevenue')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Joined</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-light">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="text-text-tertiary">
                      <p className="text-lg font-medium">No vendors found</p>
                      <p className="text-sm mt-1">Try adjusting your search filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor: VendorSummary) => (
                  <tr
                    key={vendor.id}
                    className={`hover:bg-surface-50 transition-colors cursor-pointer ${selectedVendors.includes(vendor.id) ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                      }`}
                    onClick={() => handleViewVendor(vendor)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectVendor(vendor.id, e.target.checked);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {vendor.logoUrl ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover border-2 border-border-light"
                              src={vendor.logoUrl}
                              alt={vendor.businessName}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-border-light">
                              <span className="text-sm font-medium text-primary-700">
                                {vendor.businessName?.charAt(0) || vendor.fullName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary">
                            {vendor.businessName}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {vendor.fullName}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {vendor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(vendor.status)}
                        {vendor.isZoneAssigned && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-3 w-3 text-success-500 mr-1" />
                            <span className="text-xs text-success-600">Zone Assigned</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      <div>
                        <div className="font-medium">{vendor.city}</div>
                        <div className="text-xs text-text-tertiary">{vendor.state}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${vendor.isCurrentlyOpen ? 'bg-success-500' : 'bg-danger-500'}`}></div>
                        <span className={`text-sm font-medium ${vendor.isCurrentlyOpen ? 'text-success-600' : 'text-danger-600'}`}>
                          {vendor.isCurrentlyOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-text-primary">
                          {vendor.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {vendor.totalOrders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {formatCurrency(vendor.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewVendor(vendor);
                          }}
                          className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>

                        {getVendorStatus(vendor.status) === VendorStatus.UnderReview && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick('approve', vendor);
                              }}
                              className="text-success-600 hover:text-success-700 p-1 rounded transition-colors"
                              title="Approve Vendor"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick('reject', vendor);
                              }}
                              className="text-danger-600 hover:text-danger-700 p-1 rounded transition-colors"
                              title="Reject Vendor"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSendBackToPending(vendor);
                              }}
                              className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
                              title="Send Back to Pending"
                            >
                              <ArrowUturnLeftIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {getVendorStatus(vendor.status) === VendorStatus.Approved && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleZoneAssignment(vendor);
                              }}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                              title="Assign Zone"
                            >
                              <MapPinIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick('suspend', vendor);
                              }}
                              className="text-warning-600 hover:text-warning-700 p-1 rounded transition-colors"
                              title="Suspend Vendor"
                            >
                              <PauseIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        {getVendorStatus(vendor.status) === VendorStatus.Suspended && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick('activate', vendor);
                            }}
                            className="text-success-600 hover:text-success-700 p-1 rounded transition-colors"
                            title="Activate Vendor"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}

                        {getVendorStatus(vendor.status) === VendorStatus.Rejected && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendBackToPending(vendor);
                            }}
                            className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
                            title="Send Back to Pending"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                          </button>
                        )}

                        {getVendorStatus(vendor.status) !== VendorStatus.PendingApproval && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendInstruction(vendor);
                            }}
                            className="text-purple-600 hover:text-purple-700 p-1 rounded transition-colors"
                            title="Send Instruction"
                          >
                            <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                          </button>
                        )}

                        {/* Send OTP Button - Available for all statuses */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendOtp(vendor);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                          title="Send OTP to vendor"
                        >
                          <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-surface-50 px-6 py-3 border-t border-border-light flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-primary bg-surface-0 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-primary bg-surface-0 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Showing{' '}
                  <span className="font-medium">
                    {((pagination.pageNumber - 1) * pagination.pageSize) + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-button shadow-soft -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.pageNumber - 1)}
                    disabled={pagination.pageNumber <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-button border border-border-default bg-surface-0 text-sm font-medium text-text-secondary hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.pageNumber - 2) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${pageNum === pagination.pageNumber
                          ? 'z-10 bg-primary-500 border-primary-500 text-white'
                          : 'bg-surface-0 border-border-default text-text-secondary hover:bg-surface-100'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.pageNumber + 1)}
                    disabled={pagination.pageNumber >= pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-button border border-border-default bg-surface-0 text-sm font-medium text-text-secondary hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedVendor && showDetailsModal && (
        <VendorDetailsModal
          vendorId={selectedVendor.id}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVendor(null);
          }}
        />
      )}

      {selectedVendor && showActionModal && (
        <VendorActionModal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedVendor(null);
          }}
          onConfirm={handleConfirmAction}
          action={actionType}
          vendor={selectedVendor}
        />
      )}

      {selectedVendor && showZoneModal && (
        <ZoneAssignmentModal
          vendorId={selectedVendor.id}
          isOpen={showZoneModal}
          onClose={() => {
            setShowZoneModal(false);
            setSelectedVendor(null);
          }}
        />
      )}

      {selectedVendor && showInstructionModal && (
        <InstructionModal
          vendorId={selectedVendor.id}
          vendorName={selectedVendor.businessName}
          isOpen={showInstructionModal}
          onClose={() => {
            setShowInstructionModal(false);
            setSelectedVendor(null);
          }}
        />
      )}

      {selectedVendor && showSendBackModal && (
        <SendBackToPendingModal
          isOpen={showSendBackModal}
          vendorName={selectedVendor.businessName}
          onClose={() => {
            setShowSendBackModal(false);
            setSelectedVendor(null);
          }}
          onConfirm={handleConfirmSendBackToPending}
          isLoading={sendBackToPendingMutation.isPending}
        />
      )}

      {/* Send OTP Modal */}
      <SendOtpModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setSelectedVendor(null);
        }}
        userEmail={selectedVendor?.email}
        userPhone={selectedVendor?.phoneNumber}
        userName={selectedVendor?.businessName || selectedVendor?.fullName}
      />
    </>
  );
}