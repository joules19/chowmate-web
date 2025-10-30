"use client";

import React, { useState } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  TagIcon,
  ArrowPathIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { ProductPromotion, PromotionFilters } from "@/app/data/types/promotion";
import { usePromotions, useTogglePromotionStatus, useDeletePromotion, useBulkDeletePromotions } from '@/app/lib/hooks/api-hooks/use-promotions';
import { 
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Permission } from '@/app/data/types/permissions';
import { PermissionService } from '@/app/lib/auth/permissions';
import { message } from 'antd';

interface Props {
  filters: PromotionFilters;
  onFiltersChange: (filters: PromotionFilters) => void;
  onCreateClick: () => void;
  onEditClick: (promotion: ProductPromotion) => void;
  onDetailsClick: (promotion: ProductPromotion) => void;
  onBulkPromotionClick: () => void;
  isLoading?: boolean;
}

export default function PromotionManagementTable({
  filters,
  onFiltersChange,
  onCreateClick,
  onEditClick,
  onDetailsClick,
  onBulkPromotionClick,
  isLoading = false
}: Props) {
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);

  const { data: promotionsResponse, refetch } = usePromotions(filters);
  const toggleStatusMutation = useTogglePromotionStatus();
  const deletePromotionMutation = useDeletePromotion();
  const bulkDeleteMutation = useBulkDeletePromotions();

  const promotions = promotionsResponse?.items || [];
  const pagination = promotionsResponse ? {
    pageNumber: promotionsResponse.pageNumber,
    pageSize: promotionsResponse.pageSize,
    totalCount: promotionsResponse.totalCount
  } : undefined;

  const handleToggleStatus = async (promotion: ProductPromotion) => {
    try {
      await toggleStatusMutation.mutateAsync(promotion.id);
      message.success(`Promotion ${promotion.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      message.error('Failed to toggle promotion status');
    }
  };

  const handleDelete = async (promotion: ProductPromotion) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotionMutation.mutateAsync(promotion.id);
        message.success('Promotion deleted successfully');
      } catch (error) {
        message.error('Failed to delete promotion');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPromotions.length === 0) {
      message.warning('Please select promotions to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedPromotions.length} promotion(s)?`)) {
      try {
        await bulkDeleteMutation.mutateAsync(selectedPromotions);
        message.success(`${selectedPromotions.length} promotion(s) deleted successfully`);
        setSelectedPromotions([]);
      } catch (error) {
        message.error('Failed to delete selected promotions');
      }
    }
  };

  const getStatusBadge = (isActive: boolean, startDate?: string, endDate?: string) => {
    const now = new Date();
    let status = 'Inactive';
    let color = 'bg-gray-100 text-gray-800';

    if (isActive) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && start > now) {
        status = 'Scheduled';
        color = 'bg-blue-100 text-blue-800';
      } else if (end && end < now) {
        status = 'Expired';
        color = 'bg-orange-100 text-orange-800';
      } else {
        status = 'Active';
        color = 'bg-green-100 text-green-800';
      }
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  };

  const getDiscountBadge = (promotion: ProductPromotion) => {
    const discountText = promotion.discountPercentage 
      ? `${(promotion.discountPercentage * 100).toFixed(0)}% OFF`
      : `₦${promotion.discountAmount?.toLocaleString()} OFF`;
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {discountText}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    onFiltersChange({ ...filters, sortBy: key, sortOrder: direction, pageNumber: 1 });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    onFiltersChange({ ...filters, search, pageNumber: 1 });
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4 text-primary-500" />
      ) : (
        <ChevronDownIcon className="h-4 w-4 text-primary-500" />
      );
    }
    return (
      <div className="flex flex-col">
        <ChevronUpIcon className="h-3 w-3 text-text-quaternary" />
        <ChevronDownIcon className="h-3 w-3 -mt-1 text-text-quaternary" />
      </div>
    );
  };

  const columns = [
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'discount', label: 'Discount', sortable: false },
    { key: 'pricing', label: 'Pricing', sortable: true },
    { key: 'duration', label: 'Duration', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const actions = [
    {
      icon: EyeIcon,
      label: 'View Details',
      onClick: onDetailsClick,
      condition: () => PermissionService.hasPermission(Permission.VIEW_PROMOTIONS),
    },
    {
      icon: PencilIcon,
      label: 'Edit',
      onClick: onEditClick,
      condition: () => PermissionService.hasPermission(Permission.EDIT_PROMOTION),
    },
    {
      icon: (promotion: ProductPromotion) => promotion.isActive ? PauseIcon : PlayIcon,
      label: (promotion: ProductPromotion) => promotion.isActive ? 'Deactivate' : 'Activate',
      onClick: handleToggleStatus,
      condition: () => PermissionService.hasPermission(Permission.TOGGLE_PROMOTION),
    },
    {
      icon: TrashIcon,
      label: 'Delete',
      onClick: handleDelete,
      condition: () => PermissionService.hasPermission(Permission.DELETE_PROMOTION),
      className: 'text-red-600 hover:text-red-900',
    },
  ];

  const bulkActions = [
    {
      label: 'Delete Selected',
      onClick: handleBulkDelete,
      condition: () => PermissionService.hasPermission(Permission.DELETE_PROMOTION),
      className: 'text-red-600 hover:text-red-700',
    },
  ];

  const toolbarActions = [
    {
      label: 'Create Promotion',
      onClick: onCreateClick,
      icon: TagIcon,
      variant: 'primary' as const,
      condition: () => PermissionService.hasPermission(Permission.CREATE_PROMOTION),
    },
    {
      label: 'Bulk Promotions',
      onClick: onBulkPromotionClick,
      icon: UserGroupIcon,
      variant: 'secondary' as const,
      condition: () => PermissionService.hasPermission(Permission.BULK_MANAGE_PROMOTIONS),
    },
    {
      label: 'Refresh',
      onClick: () => refetch(),
      icon: ArrowPathIcon,
      variant: 'ghost' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
        <div className="animate-pulse">
          <div className="h-16 bg-surface-100 rounded-t-card" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-surface-50 border-t border-border-light" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
      {/* Header with Search and Actions */}
      <div className="p-4 border-b border-border-light">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {toolbarActions.map((action, index) => {
              if (action.condition && !action.condition()) return null;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    action.variant === 'primary' 
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : action.variant === 'secondary'
                      ? 'bg-surface-100 text-text-primary hover:bg-surface-200 border border-border-default'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedPromotions.length > 0 && (
          <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700">
                {selectedPromotions.length} promotion(s) selected
              </span>
              <div className="flex items-center space-x-2">
                {bulkActions.map((action, index) => {
                  if (action.condition && !action.condition()) return null;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`text-sm font-medium px-3 py-1 rounded transition-colors ${
                        action.className || 'text-primary-600 hover:text-primary-700'
                      }`}
                    >
                      {action.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSelectedPromotions([])}
                  className="text-sm text-text-secondary hover:text-text-primary"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light">
          <thead className="bg-surface-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPromotions.length === promotions.length && promotions.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPromotions(promotions.map(p => p.id));
                    } else {
                      setSelectedPromotions([]);
                    }
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-surface-200' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-0 divide-y divide-border-light">
            {promotions.map((promotion) => (
              <tr key={promotion.id} className="hover:bg-surface-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPromotions.includes(promotion.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPromotions([...selectedPromotions, promotion.id]);
                      } else {
                        setSelectedPromotions(selectedPromotions.filter(id => id !== promotion.id));
                      }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                  />
                </td>
                
                {/* Product */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TagIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {promotion.productName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {promotion.vendorName}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-text-primary">
                    {promotion.categoryName}
                  </span>
                </td>
                
                {/* Discount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDiscountBadge(promotion)}
                </td>
                
                {/* Pricing */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="line-through text-text-tertiary">
                      {formatCurrency(promotion.basePrice)}
                    </div>
                    <div className="font-medium text-text-primary">
                      {formatCurrency(promotion.discountedPrice)}
                    </div>
                  </div>
                </td>
                
                {/* Duration */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-secondary">
                    <div>{formatDate(promotion.startDate)}</div>
                    <div>to {formatDate(promotion.endDate)}</div>
                  </div>
                </td>
                
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(promotion.isActive, promotion.startDate, promotion.endDate)}
                </td>
                
                {/* Created */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-text-secondary">
                    {formatDate(promotion.createdAt)}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {actions.map((action, index) => {
                      if (action.condition && !action.condition()) return null;
                      const IconComponent = typeof action.icon === 'function' ? action.icon(promotion) : action.icon;
                      const label = typeof action.label === 'function' ? action.label(promotion) : action.label;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => action.onClick(promotion)}
                          className={`p-2 rounded-md transition-colors ${
                            action.className || 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                          }`}
                          title={label}
                        >
                          {IconComponent && typeof IconComponent === 'function' ? (
                            <IconComponent className="h-4 w-4" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Empty State */}
            {promotions.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <TagIcon className="h-12 w-12 text-text-quaternary" />
                    <div className="text-sm text-text-secondary">
                      <p className="font-medium">No promotions found</p>
                      <p>Create your first promotion to get started.</p>
                    </div>
                    <button
                      onClick={onCreateClick}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                    >
                      Create Promotion
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-surface-0 px-4 py-3 border-t border-border-light sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onFiltersChange({ ...filters, pageNumber: pagination.pageNumber - 1 })}
                disabled={pagination.pageNumber <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onFiltersChange({ ...filters, pageNumber: pagination.pageNumber + 1 })}
                disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.pageNumber - 1) * pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onFiltersChange({ ...filters, pageNumber: pagination.pageNumber - 1 })}
                    disabled={pagination.pageNumber <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {[...Array(Math.ceil(pagination.totalCount / pagination.pageSize))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => onFiltersChange({ ...filters, pageNumber: page })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-surface-0 border-border-default text-text-tertiary hover:bg-surface-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => onFiltersChange({ ...filters, pageNumber: pagination.pageNumber + 1 })}
                    disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}