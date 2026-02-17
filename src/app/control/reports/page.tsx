"use client";

import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import CustomerClassReportCard from "@/app/components/admin/reports/CustomerClassReportCard";
import LowFrequencyCustomerReportCard from "@/app/components/admin/reports/LowFrequencyCustomerReportCard";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import { Permission } from "@/app/data/types/permissions";

export default function ReportsPage() {
  return (
    <PermissionGuard permission={Permission.VIEW_DASHBOARD}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 rounded-soft">
                  <DocumentChartBarIcon className="h-6 w-6 text-primary-500" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                  Reports
                </h1>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generate and download detailed analytics reports
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-info-50 border border-info-200 rounded-card p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <DocumentChartBarIcon className="h-5 w-5 text-info-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-info-800">About Reports</h3>
              <p className="text-sm text-info-700 mt-1 leading-relaxed">
                Configure filters for each report type and either preview the data in your browser
                or download as CSV for further analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              Customer Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerClassReportCard />
              <LowFrequencyCustomerReportCard />
            </div>
          </div>

          {/* Placeholder sections for other report categories */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              Order Analytics
            </h2>
            <div className="bg-surface-0 rounded-card shadow-soft border border-border-light border-dashed">
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="p-4 bg-surface-100 rounded-full mb-4">
                  <DocumentChartBarIcon className="h-8 w-8 text-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-text-secondary mb-2">
                  Order Reports Coming Soon
                </h3>
                <p className="text-sm text-text-tertiary max-w-xs">
                  Order trends, vendor performance, and delivery analytics
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              Financial Analytics
            </h2>
            <div className="bg-surface-0 rounded-card shadow-soft border border-border-light border-dashed">
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="p-4 bg-surface-100 rounded-full mb-4">
                  <DocumentChartBarIcon className="h-8 w-8 text-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-text-secondary mb-2">
                  Financial Reports Coming Soon
                </h3>
                <p className="text-sm text-text-tertiary max-w-xs">
                  Revenue reports, payment analytics, and commission breakdowns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-surface-100 rounded-card p-6 border border-border-default">
          <h3 className="text-base font-semibold text-text-primary mb-3">
            Report Generation Tips
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>
                Use filters to narrow down your data to specific date ranges or criteria
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>
                Preview reports in your browser before downloading to verify the data
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>
                Downloaded CSV files can be opened in Excel, Google Sheets, or any spreadsheet software
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <span>
                Reports are generated with current data - there's no caching or delay
              </span>
            </li>
          </ul>
        </div>
      </div>
    </PermissionGuard>
  );
}
