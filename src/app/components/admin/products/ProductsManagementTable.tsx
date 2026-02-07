"use client";

import { useState } from "react";
import { EyeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import ProductDetailsModal from "./ProductDetailsModal";
import { Permission } from "@/app/data/types/permissions";
import { PermissionService } from "@/app/lib/auth/permissions";
import { useProducts } from "@/app/lib/hooks/api-hooks.ts/use-product";

interface Product {
  id: string;
  productName: string;
  description?: string;
  basePrice: number;
  status: string;
  vendorId: string;
  vendorName?: string;
  categoryName?: string;
  imageUrl?: string;
  createdAt: string;
  inStock: boolean;
}

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

interface Props {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
}

export default function ProductsManagementTable({
  filters,
  onFiltersChange,
  selectedProducts,
  onSelectionChange
}: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch products from API
  const { data: productsData, isLoading, refetch } = useProducts(filters);
  const products = productsData?.items || [];
  const totalCount = productsData?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / filters.pageSize);

  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    setShowDetailsModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsModal(false);
    setSelectedProductId(null);
  };

  const handleUpdate = () => {
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...filters, pageNumber: newPage });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PendingApproval: { bg: 'bg-warning-50', text: 'text-warning-700', label: 'Pending' },
      Active: { bg: 'bg-success-50', text: 'text-success-700', label: 'Active' },
      Rejected: { bg: 'bg-danger-50', text: 'text-danger-700', label: 'Rejected' },
      OutOfStock: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Out of Stock' },
      Discontinued: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Discontinued' }
    };

    const config = statusConfig[status] || statusConfig.Active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const canApprove = PermissionService.hasPermission(Permission.APPROVE_PRODUCT);

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-surface-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-light">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-text-tertiary">
                      <svg className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.imageUrl ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.imageUrl}
                              alt={product.productName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-surface-100 flex items-center justify-center">
                              <span className="text-text-tertiary text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary">
                            {product.productName}
                          </div>
                          {product.description && (
                            <div className="text-sm text-text-tertiary truncate max-w-xs">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{product.vendorName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{product.categoryName || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">{formatPrice(product.basePrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(product.id)}
                        className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
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
        {totalCount > 0 && (
          <div className="bg-surface-50 px-4 py-3 flex items-center justify-between border-t border-border-light sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(filters.pageNumber - 1)}
                disabled={filters.pageNumber === 1}
                className="relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-primary bg-surface-0 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.pageNumber + 1)}
                disabled={filters.pageNumber >= totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-border-default text-sm font-medium rounded-button text-text-primary bg-surface-0 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  Showing <span className="font-medium">{(filters.pageNumber - 1) * filters.pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(filters.pageNumber * filters.pageSize, totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-button shadow-soft -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(filters.pageNumber - 1)}
                    disabled={filters.pageNumber === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-button border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          filters.pageNumber === pageNum
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-surface-0 border-border-default text-text-primary hover:bg-surface-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(filters.pageNumber + 1)}
                    disabled={filters.pageNumber >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-button border border-border-default bg-surface-0 text-sm font-medium text-text-tertiary hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showDetailsModal && selectedProductId && (
        <ProductDetailsModal
          productId={selectedProductId}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
