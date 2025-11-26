"use client";

import { useState } from "react";
import { message } from "antd";
import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import CustomerClassReportFilters from "./CustomerClassReportFilters";
import CSVPreviewTable from "./CSVPreviewTable";
import {
  ReportRepository,
  CustomerClassReportFilterDto,
} from "@/app/lib/api/repositories/report-repository";

export default function CustomerClassReportCard() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<CustomerClassReportFilterDto>({});

  const reportRepository = new ReportRepository();

  const handleApplyFilters = async (filters: CustomerClassReportFilterDto) => {
    setCurrentFilters(filters);
    message.success("Filters applied successfully");
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const data = await reportRepository.getCustomerClassReportPreview(currentFilters);
      setCsvData(data);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error previewing report:", error);
      message.error("Failed to load report preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const blob = await reportRepository.downloadCustomerClassReportCsv(currentFilters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customer_class_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error downloading report:", error);
      message.error("Failed to download report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-surface-0 rounded-card shadow-soft hover:shadow-soft-md border border-border-light transition-all duration-200">
        {/* Card Header */}
        <div className="p-6 border-b border-border-light">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-50 rounded-soft">
                <UserGroupIcon className="h-6 w-6 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                  Customer Class Report
                </h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  Analyze customer spending patterns and classifications
                </p>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-100 rounded-soft p-3 border border-border-default">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Report Type
              </p>
              <p className="text-sm font-medium text-text-primary mt-1">
                Customer Classification
              </p>
            </div>
            <div className="bg-surface-100 rounded-soft p-3 border border-border-default">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Format
              </p>
              <p className="text-sm font-medium text-text-primary mt-1">CSV Export</p>
            </div>
          </div>

          {/* Current Filters Display */}
          {Object.keys(currentFilters).length > 0 && (
            <div className="mt-4 p-3 bg-primary-50 rounded-soft border border-primary-200">
              <p className="text-xs font-medium text-primary-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {currentFilters.startMonth && currentFilters.startYear && (
                  <span className="text-xs px-2 py-1 bg-surface-0 text-text-secondary rounded-soft border border-border-default">
                    From: {currentFilters.startMonth}/{currentFilters.startYear}
                  </span>
                )}
                {currentFilters.endMonth && currentFilters.endYear && (
                  <span className="text-xs px-2 py-1 bg-surface-0 text-text-secondary rounded-soft border border-border-default">
                    To: {currentFilters.endMonth}/{currentFilters.endYear}
                  </span>
                )}
                {currentFilters.usePercentileClassification !== undefined && (
                  <span className="text-xs px-2 py-1 bg-surface-0 text-text-secondary rounded-soft border border-border-default">
                    {currentFilters.usePercentileClassification
                      ? "Percentile-Based"
                      : "Fixed Threshold"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="p-6 bg-surface-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
              aria-label="Configure report filters"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Configure Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
            <button
              onClick={handlePreview}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-info-500 text-text-inverse rounded-button hover:bg-info-600 active:bg-info-700 focus:ring-2 focus:ring-info-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Preview report"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview Report</span>
                  <span className="sm:hidden">Preview</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Download report"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Download CSV</span>
                  <span className="sm:hidden">Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CustomerClassReportFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={currentFilters}
      />

      <CSVPreviewTable
        csvData={csvData}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        reportTitle="Customer Class Report Preview"
        onDownload={handleDownload}
      />
    </>
  );
}
