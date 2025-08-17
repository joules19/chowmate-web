"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "../shared/DataTable";
import { Vendor, VendorStatus } from "../../../data/types/entities";
import { SearchFilters, PaginatedResponse } from "../../../data/types/api";
import { RepositoryFactory } from "../../../lib/api/repository-factory";

interface Props {
  filters: SearchFilters;
}

export default function VendorManagementTable({ filters }: Props) {
  const [vendors, setVendors] = useState<PaginatedResponse<Vendor>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);

  const vendorRepository = RepositoryFactory.getVendorRepository();

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorRepository.getAll(filters);
      setVendors(response);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      setVendors({
        data: mockVendors,
        total: mockVendors.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(mockVendors.length / 10)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (vendorId: string, action: 'approve' | 'reject' | 'suspend' | 'activate') => {
    try {
      switch (action) {
        case 'approve':
          await vendorRepository.approve(vendorId, 'Approved by admin');
          break;
        case 'reject':
          await vendorRepository.reject(vendorId, 'Failed to meet requirements');
          break;
        case 'suspend':
          await vendorRepository.suspend(vendorId, 'Policy violation');
          break;
        case 'activate':
          await vendorRepository.activate(vendorId);
          break;
      }
      fetchVendors();
    } catch (error) {
      console.error(`Failed to ${action} vendor:`, error);
    }
  };

  const getStatusBadge = (status: VendorStatus) => {
    const statusConfig = {
      [VendorStatus.PendingApproval]: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Pending' },
      [VendorStatus.Approved]: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Approved' },
      [VendorStatus.UnderReview]: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Under Review' },
      [VendorStatus.Suspended]: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Suspended' },
      [VendorStatus.Rejected]: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300', label: 'Rejected' },
      [VendorStatus.RequiresManualReview]: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', label: 'Manual Review' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<Vendor>[] = [
    {
      key: 'businessName',
      label: 'Business',
      sortable: true,
      render: (vendor) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {vendor.logoUrl ? (
              <img className="h-10 w-10 rounded-full object-cover" src={vendor.logoUrl} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {vendor.businessName?.charAt(0) || vendor.firstName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {vendor.businessName || `${vendor.firstName} ${vendor.lastName}`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {vendor.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Location',
      render: (vendor) => vendor.address || 'Not provided'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (vendor) => getStatusBadge(vendor.status)
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (vendor) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          vendor.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {vendor.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (vendor) => new Date(vendor.createdAt || '').toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (vendor) => (
        <div className="flex space-x-2">
          {vendor.status === VendorStatus.PendingApproval && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVendorAction(vendor.id, 'approve');
                }}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              >
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVendorAction(vendor.id, 'reject');
                }}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Reject
              </button>
            </>
          )}
          {vendor.status === VendorStatus.Approved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVendorAction(vendor.id, 'suspend');
              }}
              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Suspend
            </button>
          )}
          {vendor.status === VendorStatus.Suspended && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVendorAction(vendor.id, 'activate');
              }}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
            >
              Activate
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={vendors.data}
      columns={columns}
      loading={loading}
      pagination={{
        page: vendors.page,
        limit: vendors.limit,
        total: vendors.total,
        totalPages: vendors.totalPages
      }}
      onRowClick={(vendor) => console.log('Vendor clicked:', vendor)}
    />
  );
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    businessName: 'Pizza Palace',
    firstName: 'John',
    lastName: 'Smith',
    email: 'contact@pizzapalace.com',
    phoneNumber: '+1234567890',
    address: '123 Main St, City, State',
    status: VendorStatus.PendingApproval,
    isActive: false,
    isOpen: false,
    offersDelivery: true,
    offersPickup: true,
    deliveryRadius: 5,
    minimumOrderAmount: 15,
    maxDeliveryRadiusKm: 10,
    minimumOrderForDelivery: 15,
    preparationTimeAccuracy: 85,
    userId: '1',
    user: {
      id: '1',
      email: 'contact@pizzapalace.com',
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '+1234567890',
      roles: ['VENDOR']
    },
    locationConfidence: 'High' as any,
    createdAt: '2024-01-15T10:30:00Z'
  } as Vendor
];