"use client";

import { useState } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  PhotoIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { Advertisement, AdvertisementFilters } from "@/app/data/types/advertisement";
import { useAdvertisements, useToggleAdvertisementStatus, useDeleteAdvertisement } from '@/app/lib/hooks/api-hooks.ts/use-advertisement';
import DataTable, { Column } from '../shared/DataTable';
import { message } from 'antd';

interface Props {
  filters: AdvertisementFilters;
  onFiltersChange: (filters: AdvertisementFilters) => void;
  onCreateClick: () => void;
  onEditClick: (advertisement: Advertisement) => void;
  onDetailsClick: (advertisement: Advertisement) => void;
}

export default function AdvertisementManagementTable({
  filters,
  onFiltersChange,
  onCreateClick,
  onEditClick,
  onDetailsClick
}: Props) {
  const [selectedAds, setSelectedAds] = useState<string[]>([]);

  const { data: advertisementsResponse, isLoading, error, refetch } = useAdvertisements(filters);
  const toggleStatusMutation = useToggleAdvertisementStatus();
  const deleteAdvertisementMutation = useDeleteAdvertisement();

  const advertisements = advertisementsResponse?.items || [];
  const pagination = advertisementsResponse ? {
    pageNumber: advertisementsResponse.pageNumber,
    pageSize: advertisementsResponse.pageSize,
    totalCount: advertisementsResponse.totalCount
  } : undefined;

  const handleToggleStatus = async (advertisement: Advertisement) => {
    try {
      await toggleStatusMutation.mutateAsync(advertisement.id);
      message.success(`Advertisement ${advertisement.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      message.error('Failed to toggle advertisement status');
    }
  };

  const handleDelete = async (advertisement: Advertisement) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await deleteAdvertisementMutation.mutateAsync(advertisement.id);
        message.success('Advertisement deleted successfully');
      } catch (error) {
        message.error('Failed to delete advertisement');
      }
    }
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      vendor: 'bg-green-100 text-green-800',
      rider: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[userType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {userType}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getBackgroundColorPreview = (color: string | number) => {
    // Handle numeric color codes from backend
    const colorMap = {
      default: 'bg-gray-200',
      blue: 'bg-blue-200',
      green: 'bg-green-200',
      orange: 'bg-orange-200',
      purple: 'bg-purple-200',
      pink: 'bg-pink-200',
      0: 'bg-gray-200',   // Default
      1: 'bg-blue-200',   // Blue
      2: 'bg-green-200',  // Green
      3: 'bg-orange-200', // Orange
      4: 'bg-purple-200', // Purple
      5: 'bg-pink-200'    // Pink
    };
    
    const colorName = typeof color === 'number' ? 
      ['default', 'blue', 'green', 'orange', 'purple', 'pink'][color] || 'default' : 
      color;
    
    return (
      <div className={`w-6 h-6 rounded border border-gray-300 ${colorMap[color as keyof typeof colorMap] || 'bg-gray-200'}`} />
    );
  };

  const columns: Column<Advertisement>[] = [
    {
      key: 'imageUrl',
      label: 'Image',
      render: (advertisement) => (
        <div className="flex items-center">
          {advertisement.imageUrl ? (
            <img 
              src={advertisement.imageUrl} 
              alt={advertisement.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (advertisement) => (
        <div>
          <div className="text-sm font-medium text-text-primary">{advertisement.title}</div>
          <div className="text-sm text-text-tertiary truncate max-w-xs">{advertisement.description}</div>
        </div>
      )
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (advertisement) => (
        <div>
          <div className="text-sm text-text-primary">{advertisement.vendorName || 'N/A'}</div>
          <div className="text-xs text-text-tertiary">{advertisement.businessType || ''}</div>
        </div>
      )
    },
    {
      key: 'userType',
      label: 'Target',
      render: (advertisement) => getUserTypeBadge(advertisement.userType)
    },
    {
      key: 'backgroundColor',
      label: 'Color',
      render: (advertisement) => (
        <div className="flex items-center space-x-2">
          {getBackgroundColorPreview(advertisement.backgroundColor)}
          <span className="text-sm text-text-secondary capitalize">
            {typeof advertisement.backgroundColor === 'number' ? 
              ['default', 'blue', 'green', 'orange', 'purple', 'pink'][advertisement.backgroundColor] || 'default' : 
              advertisement.backgroundColor
            }
          </span>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (advertisement) => getStatusBadge(advertisement.isActive)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (advertisement) => new Date(advertisement.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (advertisement) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetailsClick(advertisement);
            }}
            className="p-1 text-primary-600 hover:text-primary-900"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(advertisement);
            }}
            className="p-1 text-warning-600 hover:text-warning-900"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(advertisement);
            }}
            className={`p-1 ${advertisement.isActive ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}
            title={advertisement.isActive ? 'Deactivate' : 'Activate'}
            disabled={toggleStatusMutation.isPending}
          >
            {toggleStatusMutation.isPending ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              advertisement.isActive ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(advertisement);
            }}
            className="p-1 text-danger-600 hover:text-danger-900"
            title="Delete"
            disabled={deleteAdvertisementMutation.isPending}
          >
            {deleteAdvertisementMutation.isPending ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <TrashIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      )
    }
  ];

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy: key,
      sortOrder: order
    });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({
      ...filters,
      pageNumber: page
    });
  };

  if (error) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="text-center text-danger-600">
          <p>Error loading advertisements: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 btn-secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Advertisements</h2>
          <p className="text-sm text-text-secondary mt-1">Manage advertisement campaigns</p>
        </div>
        <button
          onClick={onCreateClick}
          className="btn-primary"
        >
          Create Advertisement
        </button>
      </div>

      <DataTable
        data={advertisements}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onRowClick={onDetailsClick}
      />
    </div>
  );
}