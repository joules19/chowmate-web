"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "../shared/DataTable";
import { Rider, RiderStatus } from "../../../data/types/entities";
import { SearchFilters, PaginatedResponse } from "../../../data/types/api";

interface Props {
  filters: SearchFilters;
}

export default function RiderManagementTable({ filters }: Props) {
  const [riders, setRiders] = useState<PaginatedResponse<Rider>>({
    data: mockRiders,
    total: mockRiders.length,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(mockRiders.length / 10)
  });
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: RiderStatus) => {
    const statusConfig = {
      [RiderStatus.PendingVerification]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      [RiderStatus.Active]: { color: 'bg-green-100 text-green-800', label: 'Active' },
      [RiderStatus.Suspended]: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      [RiderStatus.Inactive]: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<Rider>[] = [
    {
      key: 'firstName',
      label: 'Rider',
      sortable: true,
      render: (rider) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {rider.firstName.charAt(0)}{rider.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {rider.firstName} {rider.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {rider.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      render: (rider) => rider.vehicleType || 'Not specified'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (rider) => getStatusBadge(rider.status)
    },
    {
      key: 'isOnline',
      label: 'Online Status',
      render: (rider) => (
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${rider.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm">{rider.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (rider) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{rider.rating.toFixed(1)}</span>
          <span className="text-yellow-400 ml-1">★</span>
        </div>
      )
    },
    {
      key: 'completedDeliveries',
      label: 'Deliveries',
      sortable: true,
      render: (rider) => rider.completedDeliveries.toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (rider) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">View</button>
          <button className="text-green-600 hover:text-green-900">Approve</button>
          <button className="text-red-600 hover:text-red-900">Suspend</button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={riders.data}
      columns={columns}
      loading={loading}
      pagination={{
        page: riders.page,
        limit: riders.limit,
        total: riders.total,
        totalPages: riders.totalPages
      }}
      onRowClick={(rider) => console.log('Rider clicked:', rider)}
    />
  );
}

const mockRiders: Rider[] = [
  {
    id: '1',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    phoneNumber: '+1234567890',
    status: RiderStatus.Active,
    isOnline: true,
    rating: 4.8,
    completedDeliveries: 245,
    cancelledDeliveries: 5,
    acceptanceRate: 95,
    vehicleType: 'Motorcycle',
    maxDeliveryRadius: 15,
    maxDeliveryRadiusKm: 15,
    maxConcurrentOrders: 2,
    userId: '1',
    user: {
      id: '1',
      email: 'mike@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      phoneNumber: '+1234567890',
      roles: ['RIDER']
    },
    createdAt: '2024-01-10T08:00:00Z'
  } as Rider
];