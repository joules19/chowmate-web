"use client";

import { useState, useMemo } from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface CSVPreviewTableProps {
  csvData: string;
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  onDownload: () => void;
}

export default function CSVPreviewTable({
  csvData,
  isOpen,
  onClose,
  reportTitle,
  onDownload,
}: CSVPreviewTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Parse CSV data
  const { headers, rows, summary } = useMemo(() => {
    const lines = csvData.trim().split('\n');

    // Find where summary starts
    const summaryIndex = lines.findIndex(line => line.trim() === 'SUMMARY');

    const dataLines = summaryIndex > 0 ? lines.slice(0, summaryIndex) : lines;
    const summaryLines = summaryIndex > 0 ? lines.slice(summaryIndex + 1) : [];

    // Parse headers
    const headerLine = dataLines[0];
    const headers = parseCSVLine(headerLine);

    // Parse data rows
    const rows = dataLines.slice(1).map(line => parseCSVLine(line));

    // Parse summary
    const summaryData = summaryLines
      .filter(line => line.trim())
      .map(line => {
        const parts = parseCSVLine(line);
        return { label: parts[0], value: parts[1] || '' };
      });

    return { headers, rows, summary: summaryData };
  }, [csvData]);

  // Pagination
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-7xl border border-border-light max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-light">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight truncate">
                  {reportTitle}
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  {rows.length} customer{rows.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDownload}
                  className="px-3 sm:px-4 py-2.5 bg-success-500 text-text-inverse rounded-button hover:bg-success-600 active:bg-success-700 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium flex items-center gap-2"
                  aria-label="Download CSV"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Download CSV</span>
                  <span className="sm:hidden">Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100 rounded-soft transition-colors focus:ring-2 focus:ring-primary-500"
                  aria-label="Close preview"
                >
                  <XMarkIcon className="h-5 w-5 text-text-tertiary" />
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-default">
                  <thead className="bg-surface-100">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-surface-0 divide-y divide-border-light">
                    {currentRows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-surface-50 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 sm:px-4 py-3 text-sm text-text-secondary whitespace-nowrap"
                          >
                            {/* Highlight customer class */}
                            {headers[cellIndex] === "Customer Class" ? (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  cell === "First Class"
                                    ? "bg-success-50 text-success-700 border border-success-200"
                                    : cell === "Middle Class"
                                    ? "bg-warning-50 text-warning-700 border border-warning-200"
                                    : "bg-surface-100 text-text-tertiary border border-border-default"
                                }`}
                              >
                                {cell}
                              </span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              {summary.length > 0 && (
                <div className="mt-8 bg-surface-100 rounded-card p-6 border border-border-default">
                  <h3 className="text-base font-semibold text-text-primary mb-4">
                    Report Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {summary.map((item, index) => (
                      <div key={index} className="bg-surface-0 rounded-soft p-4 border border-border-light">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-lg font-bold text-text-primary mt-1">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-t border-border-light bg-surface-50">
                <p className="text-sm text-text-tertiary text-center sm:text-left">
                  Showing {startIndex + 1} to {Math.min(endIndex, rows.length)} of {rows.length} entries
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-text-primary font-medium px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
