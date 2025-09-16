"use client";

import { useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  ClockIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { FeatureRequestFilterDto, FeatureRequestResponseDto } from '@/app/data/types/feature-request';
import { useFeatureRequestStats } from '@/app/lib/hooks/api-hooks.ts/use-feature-request';
import FeatureRequestManagementTable from '@/app/components/admin/feature-requests/FeatureRequestManagementTable';
import FeatureRequestFilters from '@/app/components/admin/feature-requests/FeatureRequestFilters';
import FeatureRequestDetailsModal from '@/app/components/admin/feature-requests/FeatureRequestDetailsModal';
import UpdateFeatureRequestStatusModal from '@/app/components/admin/feature-requests/UpdateFeatureRequestStatusModal';

export default function FeatureRequestsPage() {
  const [filters, setFilters] = useState<FeatureRequestFilterDto>({
    page: 1,
    pageSize: 10,
    sortBy: 'submittedAt',
    sortOrder: 'desc'
  });
  
  const [selectedFeatureRequest, setSelectedFeatureRequest] = useState<FeatureRequestResponseDto | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data: stats, refetch: refetchStats } = useFeatureRequestStats();

  const handleDetailsClick = (featureRequest: FeatureRequestResponseDto) => {
    setSelectedFeatureRequest(featureRequest);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = (featureRequest: FeatureRequestResponseDto) => {
    setSelectedFeatureRequest(featureRequest);
    setIsStatusModalOpen(true);
  };

  const handleCreateClick = () => {
    // For now, we'll just show an alert. In a real app, this would open a create modal
    alert('Create feature request functionality would be implemented here');
  };

  const handleRefresh = () => {
    refetchStats();
  };

  const statsCards = [
    {
      title: 'Total Requests',
      value: stats?.total || 0,
      icon: <LightBulbIcon className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: <ClockIcon className="w-6 h-6 text-yellow-600" />,
      color: 'text-yellow-600'
    },
    {
      title: 'Under Review',
      value: stats?.underReview || 0,
      icon: <ArrowPathIcon className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600'
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
      color: 'text-green-600'
    },
    {
      title: 'Implemented',
      value: stats?.implemented || 0,
      icon: <CheckCircleIcon className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600'
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: <XCircleIcon className="w-6 h-6 text-red-600" />,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage and review feature requests from users
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} md={8} lg={4} key={index}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <FeatureRequestFilters
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={handleRefresh}
      />

      {/* Feature Requests Table */}
      <Card>
        <FeatureRequestManagementTable
          filters={filters}
          onFiltersChange={setFilters}
          onCreateClick={handleCreateClick}
          onEditClick={handleStatusChange}
          onDetailsClick={handleDetailsClick}
          onStatusChange={handleStatusChange}
        />
      </Card>

      {/* Modals */}
      <FeatureRequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFeatureRequest(null);
        }}
        featureRequest={selectedFeatureRequest}
        onStatusChange={handleStatusChange}
      />

      <UpdateFeatureRequestStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedFeatureRequest(null);
        }}
        featureRequest={selectedFeatureRequest}
      />
    </div>
  );
}