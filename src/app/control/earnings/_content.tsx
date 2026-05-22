"use client";

import { useState, useEffect } from "react";
import { BanknotesIcon, DocumentArrowDownIcon, ChevronDownIcon, EyeIcon } from "@heroicons/react/24/outline";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTaxReportExpanded, setIsTaxReportExpanded] = useState(false);
  const [taxReportStartMonth, setTaxReportStartMonth] = useState(new Date().getMonth() + 1);
  const [taxReportStartYear, setTaxReportStartYear] = useState(new Date().getFullYear());
  const [taxReportEndMonth, setTaxReportEndMonth] = useState(new Date().getMonth() + 1);
  const [taxReportEndYear, setTaxReportEndYear] = useState(new Date().getFullYear());

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

  const handleViewTaxReport = async () => {
    if (taxReportStartMonth < 1 || taxReportStartMonth > 12 || taxReportEndMonth < 1 || taxReportEndMonth > 12) {
      message.error("Invalid month selection");
      return;
    }

    const startDate = new Date(taxReportStartYear, taxReportStartMonth - 1);
    const endDate = new Date(taxReportEndYear, taxReportEndMonth - 1);

    if (startDate > endDate) {
      message.error("Start date must be before end date");
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await earningsRepository.downloadTaxReport(
        taxReportStartMonth,
        taxReportStartYear,
        taxReportEndMonth,
        taxReportEndYear
      );

      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        message.warning("Please allow pop-ups to view the tax report");
      } else {
        message.success("Tax report opened in new tab");
      }

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error("Error viewing tax report:", error);
      message.error("Failed to load tax report");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadTaxReport = async () => {
    if (taxReportStartMonth < 1 || taxReportStartMonth > 12 || taxReportEndMonth < 1 || taxReportEndMonth > 12) {
      message.error("Invalid month selection");
      return;
    }

    const startDate = new Date(taxReportStartYear, taxReportStartMonth - 1);
    const endDate = new Date(taxReportEndYear, taxReportEndMonth - 1);

    if (startDate > endDate) {
      message.error("Start date must be before end date");
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await earningsRepository.downloadTaxReport(
        taxReportStartMonth,
        taxReportStartYear,
        taxReportEndMonth,
        taxReportEndYear
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const startMonthStr = taxReportStartMonth.toString().padStart(2, "0");
      const endMonthStr = taxReportEndMonth.toString().padStart(2, "0");
      const fileName = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
        ? `Chowmate_Tax_Report_${taxReportStartYear}_${startMonthStr}.pdf`
        : `Chowmate_Tax_Report_${taxReportStartYear}_${startMonthStr}_to_${taxReportEndYear}_${endMonthStr}.pdf`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Tax report downloaded successfully");
    } catch (error) {
      console.error("Error downloading tax report:", error);
      message.error("Failed to download tax report");
    } finally {
      setIsDownloading(false);
    }
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

        {/* Tax Report Download */}
        <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
          <button
            onClick={() => setIsTaxReportExpanded(!isTaxReportExpanded)}
            className="w-full flex items-center justify-between gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-soft">
                <DocumentArrowDownIcon className="h-5 w-5 text-primary-500" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">Download Tax Report</h2>
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-text-secondary transition-transform duration-300 ${
                isTaxReportExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
              isTaxReportExpanded
                ? 'max-h-96 opacity-100 mt-4'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Start Month
              </label>
              <select
                value={taxReportStartMonth}
                onChange={(e) => setTaxReportStartMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border-light rounded-soft focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-0 text-text-primary"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Start Year
              </label>
              <input
                type="number"
                value={taxReportStartYear}
                onChange={(e) => setTaxReportStartYear(Number(e.target.value))}
                min={2020}
                max={2100}
                className="w-full px-3 py-2 border border-border-light rounded-soft focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-0 text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                End Month
              </label>
              <select
                value={taxReportEndMonth}
                onChange={(e) => setTaxReportEndMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-border-light rounded-soft focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-0 text-text-primary"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                End Year
              </label>
              <input
                type="number"
                value={taxReportEndYear}
                onChange={(e) => setTaxReportEndYear(Number(e.target.value))}
                min={2020}
                max={2100}
                className="w-full px-3 py-2 border border-border-light rounded-soft focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-0 text-text-primary"
              />
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleViewTaxReport}
                disabled={isDownloading}
                className="flex-1 px-4 py-2 bg-info-500 text-white rounded-soft hover:bg-info-600 focus:outline-none focus:ring-2 focus:ring-info-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <EyeIcon className="h-5 w-5" />
                {isDownloading ? "Loading..." : "View"}
              </button>
              <button
                onClick={handleDownloadTaxReport}
                disabled={isDownloading}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-soft hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                {isDownloading ? "Loading..." : "Download"}
              </button>
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
