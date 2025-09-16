"use client";

import { useState } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { FeatureRequestResponseDto, FeatureRequestFilterDto, FeatureRequestStatus, FeatureRequestPriority } from "@/app/data/types/feature-request";
import { useFeatureRequests, useDeleteFeatureRequest } from '@/app/lib/hooks/api-hooks.ts/use-feature-request';
import DataTable, { Column } from '../shared/DataTable';
import { message } from 'antd';

interface Props {
  filters: FeatureRequestFilterDto;
  onFiltersChange: (filters: FeatureRequestFilterDto) => void;
  onCreateClick: () => void;
  onEditClick: (featureRequest: FeatureRequestResponseDto) => void;
  onDetailsClick: (featureRequest: FeatureRequestResponseDto) => void;
  onStatusChange: (featureRequest: FeatureRequestResponseDto) => void;
}

export default function FeatureRequestManagementTable({
  filters,
  onFiltersChange,
  onCreateClick,
  onEditClick,
  onDetailsClick,
  onStatusChange
}: Props) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const { data: featureRequestsResponse, isLoading, error, refetch } = useFeatureRequests(filters);
  const deleteFeatureRequestMutation = useDeleteFeatureRequest();

  const featureRequests = featureRequestsResponse?.items || [];
  const pagination = featureRequestsResponse ? {
    pageNumber: featureRequestsResponse.pageNumber,
    pageSize: featureRequestsResponse.pageSize,
    totalCount: featureRequestsResponse.totalCount
  } : undefined;

  const handleDelete = async (featureRequest: FeatureRequestResponseDto) => {
    if (!confirm('Are you sure you want to delete this feature request?')) {
      return;
    }

    try {
      await deleteFeatureRequestMutation.mutateAsync(featureRequest.id);
      message.success('Feature request deleted successfully');
    } catch (error) {
      message.error('Failed to delete feature request');
    }
  };

  const getStatusBadge = (status: FeatureRequestStatus) => {
    const styles = {
      [FeatureRequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [FeatureRequestStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800',
      [FeatureRequestStatus.APPROVED]: 'bg-green-100 text-green-800',
      [FeatureRequestStatus.REJECTED]: 'bg-red-100 text-red-800',
      [FeatureRequestStatus.IMPLEMENTED]: 'bg-purple-100 text-purple-800'
    };

    const icons = {
      [FeatureRequestStatus.PENDING]: <ClockIcon className="w-4 h-4" />,
      [FeatureRequestStatus.UNDER_REVIEW]: <ArrowPathIcon className="w-4 h-4" />,
      [FeatureRequestStatus.APPROVED]: <CheckCircleIcon className="w-4 h-4" />,
      [FeatureRequestStatus.REJECTED]: <XCircleIcon className="w-4 h-4" />,
      [FeatureRequestStatus.IMPLEMENTED]: <CheckCircleIcon className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: FeatureRequestPriority) => {
    const styles = {
      [FeatureRequestPriority.LOW]: 'bg-gray-100 text-gray-800',
      [FeatureRequestPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [FeatureRequestPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [FeatureRequestPriority.CRITICAL]: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  const columns: Column<FeatureRequestResponseDto>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (record) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{record.title}</div>
          <div className="text-sm text-gray-500 truncate">{record.description}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (record) => (
        <span className="text-sm text-gray-600">{record.category.replace(/([A-Z])/g, ' $1').trim()}</span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (record) => getPriorityBadge(record.priority),
    },
    {
      key: 'status',
      label: 'Status',
      render: (record) => getStatusBadge(record.status),
    },
    {
      key: 'submittedBy',
      label: 'Submitted By',
      render: (record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{record.submittedByName || 'Unknown'}</div>
          <div className="text-xs text-gray-500">{new Date(record.submittedAt).toLocaleDateString()}</div>
        </div>
      ),
    },
    {
      key: 'votes',
      label: 'Votes',
      render: (record) => (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-green-600">
            <HandThumbUpIcon className="w-4 h-4" />
            {record.upvotes}
          </span>
          <span className="flex items-center gap-1 text-red-600">
            <HandThumbDownIcon className="w-4 h-4" />
            {record.downvotes}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDetailsClick(record)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStatusChange(record)}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Update Status"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Delete"
            disabled={deleteFeatureRequestMutation.isPending}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy: key as any,
      sortOrder: order,
    });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({
      ...filters,
      page: page,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Feature Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Manage user feature requests</p>
        </div>
        <button
          onClick={onCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Request
        </button>
      </div>

      <DataTable
        columns={columns}
        data={featureRequests as any[]}
        loading={isLoading}
        pagination={pagination}
        onSort={handleSort}
        onPageChange={handlePageChange}
      />
    </div>
  );
}