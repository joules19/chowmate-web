"use client";

import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages?: number;
  };
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  pagination,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRowClick
}: Props<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key] as React.ReactNode;
  };

  const generatePaginationButtons = () => {
    if (!pagination) return [];
    
    const totalPages = pagination.totalPages || Math.ceil(pagination.totalCount / pagination.pageSize);
    const currentPage = pagination.pageNumber;
    const buttons = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);
      
      if (currentPage <= 4) {
        // Show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          buttons.push(i);
        }
        buttons.push('...');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show 1, ..., last-4, last-3, last-2, last-1, last
        buttons.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // Show 1, ..., current-1, current, current+1, ..., last
        buttons.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push('...');
        buttons.push(totalPages);
      }
    }
    
    return buttons;
  };

  if (loading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-100 rounded-t-card" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-50 border-t border-border-light" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-default">
          <thead className="bg-surface-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-surface-200' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon 
                          className={`h-3 w-3 ${
                            sortConfig?.key === column.key && sortConfig?.direction === 'asc'
                              ? 'text-primary-500'
                              : 'text-text-quaternary'
                          }`}
                        />
                        <ChevronDownIcon 
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig?.key === column.key && sortConfig?.direction === 'desc'
                              ? 'text-primary-500'
                              : 'text-text-quaternary'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-0 divide-y divide-border-light">
            {data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-surface-50' : ''
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-tertiary">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-surface-0 px-4 py-3 border-t border-border-default sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Page Size Selector */}
            {onPageSizeChange && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Show</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="border border-border-default rounded-button px-3 py-1 text-sm bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-text-secondary">items</span>
              </div>
            )}

            {/* Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange?.(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber <= 1}
                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary self-center">
                Page {pagination.pageNumber} of {Math.ceil(pagination.totalCount / pagination.pageSize)}
              </span>
              <button
                onClick={() => onPageChange?.(pagination.pageNumber + 1)}
                disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-secondary bg-surface-0 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Desktop Info and Pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between sm:flex-1">
              <div>
                <p className="text-sm text-text-secondary">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.pageNumber - 1) * pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span> results
                </p>
              </div>

              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange?.(pagination.pageNumber - 1)}
                    disabled={pagination.pageNumber <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {generatePaginationButtons().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange?.(page as number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-surface-0 border-border-default text-text-tertiary hover:bg-surface-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => onPageChange?.(pagination.pageNumber + 1)}
                    disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}