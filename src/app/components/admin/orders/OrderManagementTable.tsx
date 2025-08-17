"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "../shared/DataTable";
import { Order, OrderStatus } from "../../../data/types/entities";
import { SearchFilters, PaginatedResponse } from "../../../data/types/api";

interface Props {
  filters: SearchFilters;
}

export default function OrderManagementTable({ filters }: Props) {
  const [orders, setOrders] = useState<PaginatedResponse<Order>>({
    data: mockOrders,
    total: mockOrders.length,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(mockOrders.length / 10)
  });
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.Pending]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      [OrderStatus.Preparing]: { color: 'bg-primary-100 text-primary-800', label: 'Preparing' },
      [OrderStatus.RiderAssigned]: { color: 'bg-purple-100 text-purple-800', label: 'Rider Assigned' },
      [OrderStatus.RiderArrived]: { color: 'bg-indigo-100 text-indigo-800', label: 'Rider Arrived' },
      [OrderStatus.OutForDelivery]: { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      [OrderStatus.Completed]: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      [OrderStatus.Cancelled]: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<Order>[] = [
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
          ${order.totalAmount.toFixed(2)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (order) => getStatusBadge(order.status)
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
        <div className="flex space-x-2">
          <button className="text-primary-600 hover:text-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">View</button>
          <button className="text-yellow-600 hover:text-yellow-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">Edit</button>
          {order.status !== OrderStatus.Completed && order.status !== OrderStatus.Cancelled && (
            <button className="text-red-600 hover:text-red-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1">Cancel</button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={orders.data}
      columns={columns}
      loading={loading}
      pagination={{
        page: orders.page,
        limit: orders.limit,
        total: orders.total,
        totalPages: orders.totalPages
      }}
      onRowClick={(order) => console.log('Order clicked:', order)}
    />
  );
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-12345',
    orderDate: '2024-01-15T14:30:00Z',
    status: OrderStatus.OutForDelivery,
    totalAmount: 45.99,
    subTotal: 39.99,
    deliveryFee: 4.00,
    serviceFee: 2.00,
    discount: 0,
    isGift: false,
    isPickUp: false,
    isDelivery: true,
    orderIndex: 1,
    transactionId: 'txn-123',
    vendorId: '1',
    customerId: '1',
    vendor: {
      id: '1',
      businessName: 'Pizza Palace',
      firstName: 'John',
      lastName: 'Smith'
    } as any,
    customer: {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com'
    } as any,
    createdAt: '2024-01-15T14:30:00Z'
  } as Order
];