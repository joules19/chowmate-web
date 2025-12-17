"use client";

import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { OrderEarningsDto, EarningsDistributionStatus } from "@/app/data/types/earnings";
import { PaginatedResponse } from "@/app/data/types/api";
import EarningsDetailsModal from "./EarningsDetailsModal";

interface EarningsManagementTableProps {
  data: PaginatedResponse<OrderEarningsDto>;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function EarningsManagementTable({
  data,
  onPageChange,
  isLoading = false,
}: EarningsManagementTableProps) {
  const [selectedEarning, setSelectedEarning] = useState<OrderEarningsDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (earning: OrderEarningsDto) => {
    setSelectedEarning(earning);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: EarningsDistributionStatus) => {
    switch (status) {
      case EarningsDistributionStatus.Completed:
        return "bg-success-50 text-success-700 border-success-200";
      case EarningsDistributionStatus.Processing:
        return "bg-info-50 text-info-700 border-info-200";
      case EarningsDistributionStatus.Pending:
        return "bg-warning-50 text-warning-700 border-warning-200";
      case EarningsDistributionStatus.Failed:
        return "bg-danger-50 text-danger-700 border-danger-200";
      case EarningsDistributionStatus.Refunding:
        return "bg-warning-50 text-warning-700 border-warning-200";
      case EarningsDistributionStatus.Refunded:
        return "bg-surface-100 text-text-tertiary border-border-default";
      default:
        return "bg-surface-100 text-text-tertiary border-border-default";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(data.totalCount / data.pageSize);

  return (
    <>
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-default">
            <thead className="bg-surface-100">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider hidden md:table-cell">
                  Rider
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider hidden lg:table-cell">
                  Platform
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-light">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-sm text-text-secondary">Loading earnings...</span>
                    </div>
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-text-tertiary">
                    No earnings found
                  </td>
                </tr>
              ) : (
                data.items.map((earning) => (
                  <tr key={earning.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-text-primary">{earning.orderNumber}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-text-secondary hidden sm:table-cell">
                      {formatDate(earning.createdDate)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm">
                        <p className="font-medium text-text-primary truncate max-w-[120px]">{earning.vendorName}</p>
                        <p className="text-text-tertiary text-xs">₦{earning.vendorEarnings.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <div className="text-sm">
                        <p className="font-medium text-text-primary truncate max-w-[100px]">{earning.riderName || 'N/A'}</p>
                        <p className="text-text-tertiary text-xs">₦{earning.riderEarnings.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <span className="text-xs font-bold text-primary-600">₦{earning.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap hidden lg:table-cell">
                      <span className="text-xs font-medium text-text-primary">₦{earning.platformEarnings.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(earning.distributionStatus)}`}>
                        {earning.distributionStatusText}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(earning)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 bg-info-500 text-text-inverse rounded-button hover:bg-info-600 active:bg-info-700 focus:ring-2 focus:ring-info-500 focus:ring-offset-2 transition-all duration-200 text-xs font-medium"
                        aria-label="View details"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && data.items.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-border-light bg-surface-50">
            <p className="text-sm text-text-tertiary text-center sm:text-left">
              Showing {((data.pageNumber - 1) * data.pageSize) + 1} to {Math.min(data.pageNumber * data.pageSize, data.totalCount)} of {data.totalCount} entries
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onPageChange(data.pageNumber - 1)}
                disabled={data.pageNumber === 1}
                className="px-3 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-sm text-text-primary font-medium px-3">
                Page {data.pageNumber} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(data.pageNumber + 1)}
                disabled={data.pageNumber >= totalPages}
                className="px-3 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <EarningsDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        earning={selectedEarning}
      />
    </>
  );
}
