"use client";

import { useState } from "react";
import { 
  EyeIcon, 
  PencilSquareIcon, 
  XMarkIcon,
  MapIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/outline";
import DataTable, { Column } from "../shared/DataTable";
import { SearchFilters } from "../../../data/types/api";
import { AllOrdersDto } from "@/app/data/types/order";
import { useOrders } from "@/app/lib/hooks/api-hooks.ts/use-order-management";
import { OrderFilters } from "@/app/lib/api/repositories/order-repository";
import { formatCurrency } from "@/app/lib/utils/currency";
import OrderDetailsModal from "./OrderDetailsModal";
import RiderReplacementModal from "./RiderReplacementModal";

interface Props {
  filters: SearchFilters;
}

export default function OrderManagementTable({ filters }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<AllOrdersDto | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplaceRiderModal, setShowReplaceRiderModal] = useState(false);
  const [orderForRiderReplacement, setOrderForRiderReplacement] = useState<AllOrdersDto | null>(null);

  // Convert SearchFilters to OrderFilters
  const orderFilters: OrderFilters = {
    pageNumber: filters.page || 1,
    pageSize: filters.limit || 10,
    sortBy: filters.sortBy || 'orderDate',
    sortOrder: filters.sortOrder || 'desc',
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo })
  };

  const { data: orders, isLoading: loading, error, refetch: refreshOrders, isFetching: isRefreshing } = useOrders(orderFilters, { enabled: true });

  const handleViewOrder = (order: AllOrdersDto) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order: AllOrdersDto) => {
    console.log('Edit order:', order);
    // TODO: Implement edit functionality
  };

  const handleCancelOrder = (order: AllOrdersDto) => {
    console.log('Cancel order:', order);
    // TODO: Implement cancel functionality
  };

  const handleTrackOrder = (order: AllOrdersDto) => {
    console.log('Track order:', order);
    // TODO: Implement tracking functionality
  };

  const handleReplaceRider = (order: AllOrdersDto) => {
    setOrderForRiderReplacement(order);
    setShowReplaceRiderModal(true);
  };

  const getStatusBadge = (status: number | string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'Preparing': { color: 'bg-primary-100 text-primary-800', label: 'Preparing' },
      'RiderAssigned': { color: 'bg-purple-100 text-purple-800', label: 'Rider Assigned' },
      'RiderArrived': { color: 'bg-indigo-100 text-indigo-800', label: 'Rider Arrived' },
      'OutForDelivery': { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      'Completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'Cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as string] || statusConfig['Pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<AllOrdersDto>[] = [
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      render: (order) => (
        <div className="font-mono text-sm font-medium text-text-primary">
          {order.orderId}
        </div>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (order) => (
        <div>
          <div className="text-sm font-medium text-text-primary">
            {order.customer.firstName} {order.customer.lastName}
          </div>
          <div className="text-sm text-text-tertiary">
            {order.customer.email}
          </div>
        </div>
      )
    },
    {
      key: 'vendor',
      label: 'Vendor',
      render: (order) => (
        <div className="text-sm font-medium text-text-primary">
          {order.vendor.businessName || `${order.vendor.firstName} ${order.vendor.lastName}`}
        </div>
      )
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (order) => (
        <div className="text-sm font-medium text-text-primary">
          {formatCurrency(order.totalAmount)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => getStatusBadge(order.statusText)
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      sortable: true,
      render: (order) => new Date(order.orderDate).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewOrder(order);
            }}
            className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditOrder(order);
            }}
            className="text-yellow-600 hover:text-yellow-700 p-1 rounded transition-colors"
            title="Edit Order"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>

          {order.statusText !== 'Completed' && order.statusText !== 'Cancelled' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackOrder(order);
                }}
                className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                title="Track Order"
              >
                <MapIcon className="h-4 w-4" />
              </button>
              
              {/* Replace Rider button - only show for orders with assigned riders */}
              {order.rider && (order.statusText === 'RiderAssigned' || order.statusText === 'RiderArrived' || order.statusText === 'OutForDelivery') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReplaceRider(order);
                  }}
                  className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
                  title="Replace Rider"
                >
                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelOrder(order);
                }}
                className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                title="Cancel Order"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  // Loading state
  if (loading) {
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
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-text-primary">Failed to load orders</h3>
          <p className="mt-1 text-sm text-text-secondary">Unable to fetch orders. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTable<AllOrdersDto>
        data={orders?.items || []}
        columns={columns}
        loading={loading}
        pagination={orders ? {
          pageNumber: orders.pageNumber,
          pageSize: orders.pageSize,
          totalCount: orders.totalCount
        } : undefined}
        onRowClick={handleViewOrder}
      />

      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <RiderReplacementModal
        isOpen={showReplaceRiderModal}
        onClose={() => {
          setShowReplaceRiderModal(false);
          setOrderForRiderReplacement(null);
        }}
        order={orderForRiderReplacement}
      />
    </>
  );
}

