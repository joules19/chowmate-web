"use client";

import { useState, useEffect } from "react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import EarningsFilters from "@/app/components/admin/earnings/EarningsFilters";
import EarningsManagementTable from "@/app/components/admin/earnings/EarningsManagementTable";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import { Permission } from "@/app/data/types/permissions";
import { EarningsRepository } from "@/app/lib/api/repositories/earnings-repository";
import { GetOrderEarningsRequest, EarningsDistributionStatus } from "@/app/data/types/earnings";
import { EarningsPaginatedResponse } from "@/app/data/types/api";
import { OrderEarningsDto } from "@/app/data/types/earnings";

export default function EarningsPage() {
  const [filters, setFilters] = useState<GetOrderEarningsRequest>({
    distributionStatus: EarningsDistributionStatus.Completed,
    pageNumber: 1,
    pageSize: 20,
  });
  const [data, setData] = useState<EarningsPaginatedResponse<OrderEarningsDto>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 20,
    totalEarnings: 0,
    totalPlatformEarnings: 0,
    totalRiderEarnings: 0,
    totalVendorEarnings: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const earningsRepository = new EarningsRepository();

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const response = await earningsRepository.getOrderEarnings(filters);
      setData(response);
    } catch (error) {
      console.error("Error fetching earnings:", error);
      message.error("Failed to load earnings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [filters]);

  const handleFiltersChange = (newFilters: GetOrderEarningsRequest) => {
    setFilters({ ...newFilters, pageNumber: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, pageNumber: page });
  };

  // Summary stats are now directly from the API response
  const totalEarnings = data.totalEarnings;
  const totalPlatformEarnings = data.totalPlatformEarnings;
  const totalVendorEarnings = data.totalVendorEarnings;
  const totalRiderEarnings = data.totalRiderEarnings;

  return (
    <PermissionGuard permission={Permission.VIEW_PAYMENTS}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 rounded-soft">
                  <BanknotesIcon className="h-6 w-6 text-primary-500" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                  Order Earnings
                </h1>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                View and manage order earnings distribution across vendors, riders, and platform
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Total Earnings</p>
                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">₦{totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-soft">
                <BanknotesIcon className="h-6 w-6 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Platform</p>
                <p className="text-xl sm:text-2xl font-bold text-primary-600 mt-1">₦{totalPlatformEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-soft">
                <BanknotesIcon className="h-6 w-6 text-primary-500" />
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Vendors</p>
                <p className="text-xl sm:text-2xl font-bold text-success-600 mt-1">₦{totalVendorEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-success-50 rounded-soft">
                <BanknotesIcon className="h-6 w-6 text-success-500" />
              </div>
            </div>
          </div>

          <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Riders</p>
                <p className="text-xl sm:text-2xl font-bold text-info-600 mt-1">₦{totalRiderEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-info-50 rounded-soft">
                <BanknotesIcon className="h-6 w-6 text-info-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <EarningsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Table */}
        <EarningsManagementTable
          data={data}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </PermissionGuard>
  );
}
