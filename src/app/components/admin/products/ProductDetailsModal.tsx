"use client";

import { useState } from "react";
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Permission } from "@/app/data/types/permissions";
import { PermissionService } from "@/app/lib/auth/permissions";
import { useProductDetails, useApproveProduct, useRejectProduct, useUpdateProductStatus } from "@/app/lib/hooks/api-hooks.ts/use-product";
import { ProductImage, ProductOptionCategory, ProductOption } from "@/app/lib/api/repositories/product-repository";
import Toast, { ToastType } from "@/app/components/ui/Toast";

interface Props {
  productId: string;
  onClose: () => void;
  onUpdate: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function ProductDetailsModal({ productId, onClose, onUpdate }: Props) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });

  const { data: product, isLoading } = useProductDetails(productId);
  const approveMutation = useApproveProduct();
  const rejectMutation = useRejectProduct();
  const updateStatusMutation = useUpdateProductStatus();

  const canApprove = PermissionService.hasPermission(Permission.VIEW_VENDORS);
  const canManage = PermissionService.hasPermission(Permission.VIEW_VENDORS);
  const isPending = product?.status === 'PendingApproval';
  const approving = approveMutation.isPending;
  const rejecting = rejectMutation.isPending;
  const updatingStatus = updateStatusMutation.isPending;

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const handleApprove = async () => {
    if (!canApprove || !product) return;

    try {
      await approveMutation.mutateAsync({
        productId: product.id,
        request: { notifyVendor: true }
      });

      showToast("Product approved successfully! Vendor has been notified.", "success");
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error approving product:", error);
      showToast("Failed to approve product. Please try again.", "error");
    }
  };

  const handleReject = async () => {
    if (!canApprove || !rejectionReason.trim() || !product) {
      showToast("Please provide a reason for rejection", "warning");
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        productId: product.id,
        request: {
          reason: rejectionReason,
          notifyVendor: true
        }
      });

      showToast("Product rejected. Vendor has been notified with the reason.", "success");
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error rejecting product:", error);
      showToast("Failed to reject product. Please try again.", "error");
    }
  };

  const handleStatusChange = async () => {
    if (!canManage || !selectedStatus || !product) return;

    try {
      await updateStatusMutation.mutateAsync({
        productId: product.id,
        request: { status: selectedStatus }
      });

      showToast(`Product status changed to ${selectedStatus}`, "success");
      setEditingStatus(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating product status:", error);
      showToast("Failed to update product status. Please try again.", "error");
    }
  };

  const handleQuickToggle = async (newStatus: 'Active' | 'Draft') => {
    if (!canManage || !product) return;

    try {
      await updateStatusMutation.mutateAsync({
        productId: product.id,
        request: { status: newStatus }
      });

      showToast(`Product set to ${newStatus}`, "success");
      onUpdate();
    } catch (error) {
      console.error("Error toggling product status:", error);
      showToast(`Failed to set product to ${newStatus}. Please try again.`, "error");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PendingApproval: { bg: 'bg-warning-50', text: 'text-warning-700', label: 'Pending Approval' },
      Active: { bg: 'bg-success-50', text: 'text-success-700', label: 'Active' },
      Rejected: { bg: 'bg-danger-50', text: 'text-danger-700', label: 'Rejected' },
      OutOfStock: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Out of Stock' },
      Discontinued: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Discontinued' },
      Draft: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Draft' }
    };

    const config = statusConfig[status] || statusConfig.Active;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg max-w-4xl w-full p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg max-w-md w-full p-8">
          <p className="text-center text-text-secondary">Product not found</p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-6 py-3 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-light sticky top-0 bg-surface-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Product Details</h2>
            <p className="text-sm text-text-tertiary mt-1">Review and manage product information</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {editingStatus ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-border-default rounded-button focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="">Select status...</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="PendingApproval">Pending Approval</option>
                    <option value="Rejected">Rejected</option>
                    <option value="OutOfStock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={!selectedStatus || updatingStatus}
                    className="px-4 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 text-sm font-medium disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingStatus(false);
                      setSelectedStatus("");
                    }}
                    className="px-4 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {getStatusBadge(product.status)}
                  {canManage && (
                    <>
                      <button
                        onClick={() => {
                          setEditingStatus(true);
                          setSelectedStatus(product.status);
                        }}
                        className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                      >
                        Change Status
                      </button>
                      {/* Quick Toggle Active/Draft */}
                      {(product.status === 'Active' || product.status === 'Draft') && (
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border-light">
                          <span className="text-xs text-text-tertiary">Quick toggle:</span>
                          {product.status !== 'Active' && (
                            <button
                              onClick={() => handleQuickToggle('Active')}
                              disabled={updatingStatus}
                              className="px-3 py-1 bg-success-500 text-white text-xs rounded-button hover:bg-success-600 disabled:opacity-50 transition-colors"
                            >
                              Set Active
                            </button>
                          )}
                          {product.status !== 'Draft' && (
                            <button
                              onClick={() => handleQuickToggle('Draft')}
                              disabled={updatingStatus}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded-button hover:bg-gray-600 disabled:opacity-50 transition-colors"
                            >
                              Set Draft
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <span className="text-sm text-text-tertiary">
              Created: {formatDate(product.createdAt)}
            </span>
          </div>

          {/* Product Images */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Product Images</h3>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image: ProductImage) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.imageUrl}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-card shadow-soft border border-border-light"
                    />
                    {image.isMain && (
                      <span className="absolute top-2 right-2 bg-primary-500 text-text-inverse text-xs px-2 py-1 rounded-full">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-64 bg-surface-100 rounded-card flex items-center justify-center">
                <p className="text-text-tertiary">No images available</p>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Product Name</p>
                <p className="text-base font-medium text-text-primary">{product.productName}</p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Vendor</p>
                <p className="text-base font-medium text-text-primary">{product.vendorName || 'Unknown'}</p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Category</p>
                <p className="text-base font-medium text-text-primary">{product.categoryName || 'Unknown'}</p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Base Price</p>
                <p className="text-base font-medium text-text-primary">{formatPrice(product.basePrice)}</p>
                {product.priceDescription && (
                  <p className="text-sm text-text-tertiary mt-1">{product.priceDescription}</p>
                )}
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Stock Status</p>
                <p className="text-base font-medium text-text-primary">
                  {product.inStock ? (
                    <span className="text-success-600">In Stock</span>
                  ) : (
                    <span className="text-danger-600">Out of Stock</span>
                  )}
                </p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Preparation Time</p>
                <p className="text-base font-medium text-text-primary">{product.preparationTime}</p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Available for Pickup</p>
                <p className="text-base font-medium text-text-primary">
                  {product.isAvailableForPickup ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-sm text-text-tertiary mb-1">Available for Delivery</p>
                <p className="text-base font-medium text-text-primary">
                  {product.isAvailableForDelivery ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Description</h3>
              <div className="bg-surface-50 p-4 rounded-card border border-border-light">
                <p className="text-base text-text-secondary whitespace-pre-wrap">{product.description}</p>
              </div>
            </div>
          )}

          {/* Option Categories and Options */}
          {product.optionCategories && product.optionCategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">Option Categories</h3>
              <div className="space-y-4">
                {product.optionCategories.map((category: ProductOptionCategory) => (
                  <div key={category.id} className="bg-surface-50 p-4 rounded-card border border-border-light">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-text-primary">{category.name}</h4>
                        <div className="flex gap-3 mt-1">
                          {category.isRequired && (
                            <span className="text-xs bg-danger-50 text-danger-700 px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          )}
                          {category.minOptions !== null && category.minOptions !== undefined && (
                            <span className="text-xs text-text-tertiary">
                              Min: {category.minOptions}
                            </span>
                          )}
                          {category.maxOptions !== null && category.maxOptions !== undefined && (
                            <span className="text-xs text-text-tertiary">
                              Max: {category.maxOptions}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {category.options && category.options.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {category.options.map((option: ProductOption) => (
                          <div
                            key={option.id}
                            className="flex items-center justify-between bg-surface-0 p-3 rounded border border-border-light"
                          >
                            <div>
                              <p className="text-sm font-medium text-text-primary">{option.name}</p>
                              <p className="text-xs text-text-tertiary">
                                {option.inStock ? (
                                  <span className="text-success-600">In Stock</span>
                                ) : (
                                  <span className="text-danger-600">Out of Stock</span>
                                )}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-text-primary">
                              {option.additionalPrice > 0 ? `+${formatPrice(option.additionalPrice)}` : 'Free'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-tertiary">No options available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="border-t border-border-light pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Rejection Reason</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejecting this product..."
                rows={4}
                className="w-full px-4 py-3 border border-border-default rounded-card focus:ring-2 focus:ring-danger-500 focus:border-danger-500 text-sm bg-surface-50 resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-light bg-surface-50 flex flex-col sm:flex-row gap-3 sticky bottom-0">
          {canApprove && isPending && !showRejectForm ? (
            <>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="flex-1 sm:flex-none px-6 py-3 bg-success-500 text-text-inverse rounded-button hover:bg-success-600 active:bg-success-700 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                {approving ? 'Approving...' : 'Approve Product'}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 sm:flex-none px-6 py-3 bg-danger-500 text-text-inverse rounded-button hover:bg-danger-600 active:bg-danger-700 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <XCircleIcon className="h-5 w-5" />
                Reject Product
              </button>
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
              >
                Close
              </button>
            </>
          ) : showRejectForm ? (
            <>
              <button
                onClick={handleReject}
                disabled={rejecting || !rejectionReason.trim()}
                className="flex-1 sm:flex-none px-6 py-3 bg-danger-500 text-text-inverse rounded-button hover:bg-danger-600 active:bg-danger-700 focus:ring-2 focus:ring-danger-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
                disabled={rejecting}
                className="flex-1 sm:flex-none px-6 py-3 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-100 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
