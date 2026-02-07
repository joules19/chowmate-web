"use client";

import { useState, useEffect } from "react";
import { CubeIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import ProductsManagementTable from "../../components/admin/products/ProductsManagementTable";
import ProductFiltersComponent from "../../components/admin/products/ProductFilters";
import PermissionGuard from "../../components/admin/guards/PermissionGuard";
import { Permission } from "../../data/types/permissions";
import { useProductStats } from "@/app/lib/hooks/api-hooks.ts/use-product";
import { useSearchParams } from "next/navigation";

interface ProductFilters {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  vendorId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export default function ProductsManagementPage() {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId');

  const [filters, setFilters] = useState<ProductFilters>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    vendorId: vendorIdParam || undefined
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Update filters when URL param changes
  useEffect(() => {
    if (vendorIdParam && vendorIdParam !== filters.vendorId) {
      setFilters(prev => ({ ...prev, vendorId: vendorIdParam, pageNumber: 1 }));
    }
  }, [vendorIdParam]);

  // Fetch product stats from API
  const { data: stats } = useProductStats();
  const productStats = stats || {
    totalProducts: 0,
    pendingApproval: 0,
    active: 0,
    rejected: 0,
    outOfStock: 0,
    discontinued: 0
  };

  const getStatCard = (title: string, value: number | string, icon: React.ReactNode, color: string, onClick?: () => void) => (
    <div
      className={`bg-surface-0 rounded-card shadow-soft border border-border-light px-3 py-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={`h-12 w-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <PermissionGuard permission={Permission.VIEW_VENDORS}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                Product Management
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Review and approve products from vendors
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {getStatCard(
              "Total Products",
              productStats.totalProducts,
              <CubeIcon className="h-6 w-6 text-info-500" />,
              "bg-info-50",
              () => setFilters({ ...filters, status: undefined, pageNumber: 1 })
            )}
            {getStatCard(
              "Pending Approval",
              productStats.pendingApproval,
              <ClockIcon className="h-6 w-6 text-warning-500" />,
              "bg-warning-50",
              () => setFilters({ ...filters, status: 'PendingApproval', pageNumber: 1 })
            )}
            {getStatCard(
              "Active",
              productStats.active,
              <CheckCircleIcon className="h-6 w-6 text-success-500" />,
              "bg-success-50",
              () => setFilters({ ...filters, status: 'Active', pageNumber: 1 })
            )}
            {getStatCard(
              "Rejected",
              productStats.rejected,
              <XCircleIcon className="h-6 w-6 text-danger-500" />,
              "bg-danger-50",
              () => setFilters({ ...filters, status: 'Rejected', pageNumber: 1 })
            )}
          </div>
        </div>

        {/* Filters */}
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Table */}
        <ProductsManagementTable
          filters={filters}
          onFiltersChange={setFilters}
          selectedProducts={selectedProducts}
          onSelectionChange={setSelectedProducts}
        />
      </div>
    </PermissionGuard>
  );
}
