"use client";

import { Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';
import { FeatureRequestFilterDto, FeatureRequestStatus, FeatureRequestCategory, FeatureRequestPriority } from '@/app/data/types/feature-request';

const { RangePicker } = DatePicker;

interface Props {
  filters: FeatureRequestFilterDto;
  onFiltersChange: (filters: FeatureRequestFilterDto) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function FeatureRequestFilters({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading = false
}: Props) {
  const handleFilterChange = (key: keyof FeatureRequestFilterDto, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      pageSize: filters.pageSize || 10,
    });
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      onFiltersChange({
        ...filters,
        dateFrom: dates[0].format('YYYY-MM-DD'),
        dateTo: dates[1].format('YYYY-MM-DD'),
        page: 1,
      });
    } else {
      handleFilterChange('dateFrom', undefined);
      handleFilterChange('dateTo', undefined);
    }
  };

  const statusOptions = Object.values(FeatureRequestStatus).map(status => ({
    label: status,
    value: status,
  }));

  const categoryOptions = Object.values(FeatureRequestCategory).map(category => ({
    label: category.replace(/([A-Z])/g, ' $1').trim(),
    value: category,
  }));

  const priorityOptions = Object.values(FeatureRequestPriority).map(priority => ({
    label: priority,
    value: priority,
  }));

  const sortOptions = [
    { label: 'Submitted Date', value: 'submittedAt' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Upvotes', value: 'upvotes' },
  ];

  const sortOrderOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <Input
            placeholder="Search by title or description..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            placeholder="Select status"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[{ label: 'All Statuses', value: undefined }, ...statusOptions]}
            className="w-full"
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Select
            placeholder="Select category"
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            options={[{ label: 'All Categories', value: undefined }, ...categoryOptions]}
            className="w-full"
            allowClear
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <Select
            placeholder="Select priority"
            value={filters.priority}
            onChange={(value) => handleFilterChange('priority', value)}
            options={[{ label: 'All Priorities', value: undefined }, ...priorityOptions]}
            className="w-full"
            allowClear
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <RangePicker
            className="w-full"
            onChange={handleDateRangeChange}
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            placeholder="Sort by"
            value={filters.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
            options={sortOptions}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <Select
            placeholder="Sort order"
            value={filters.sortOrder}
            onChange={(value) => handleFilterChange('sortOrder', value)}
            options={sortOrderOptions}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {filters.searchTerm && (
            <span>Searching for: "{filters.searchTerm}"</span>
          )}
        </div>
        <Space>
          <Button
            icon={<ClearOutlined />}
            onClick={handleClearFilters}
            disabled={isLoading}
          >
            Clear Filters
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
        </Space>
      </div>
    </div>
  );
}