"use client";

import { XMarkIcon, BanknotesIcon, UserIcon, TruckIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { OrderEarningsDto, EarningsDistributionStatus } from "@/app/data/types/earnings";

interface EarningsDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  earning: OrderEarningsDto | null;
}

export default function EarningsDetailsModal({ isOpen, onClose, earning }: EarningsDetailsModalProps) {
  if (!isOpen || !earning) return null;

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
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-3xl border border-border-light">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
                  Earnings Breakdown
                </h2>
                <p className="text-sm text-text-tertiary mt-1">
                  Order #{earning.orderNumber}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-soft transition-colors focus:ring-2 focus:ring-primary-500"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5 text-text-tertiary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Distribution Status</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(earning.distributionStatus)}`}>
                  {earning.distributionStatusText}
                </span>
              </div>

              {/* Total Amount Card */}
              <div className="bg-primary-50 rounded-card p-6 border border-primary-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary-700 uppercase tracking-wider">Total Order Amount</p>
                    <p className="text-3xl font-bold text-primary-900 mt-1">₦{earning.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-soft">
                    <BanknotesIcon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* Earnings Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Vendor Earnings */}
                <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-success-50 rounded-soft">
                      <BuildingStorefrontIcon className="h-5 w-5 text-success-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Vendor</p>
                      <p className="text-sm font-medium text-text-primary truncate">{earning.vendorName}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-success-600">₦{earning.vendorEarnings.toLocaleString()}</p>
                </div>

                {/* Rider Earnings */}
                <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-info-50 rounded-soft">
                      <TruckIcon className="h-5 w-5 text-info-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Rider</p>
                      <p className="text-sm font-medium text-text-primary truncate">{earning.riderName || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-info-600">₦{earning.riderEarnings.toLocaleString()}</p>
                </div>

                {/* Platform Earnings */}
                <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-50 rounded-soft">
                      <BanknotesIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Platform</p>
                      <p className="text-sm font-medium text-text-primary">Chowmate</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">₦{earning.platformEarnings.toLocaleString()}</p>
                </div>
              </div>

              {/* Order Breakdown */}
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-3">Order Breakdown</h3>
                <div className="bg-surface-100 rounded-card p-4 border border-border-default space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-medium text-text-primary">₦{earning.subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Delivery Fee</span>
                    <span className="font-medium text-text-primary">₦{earning.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Service Fee</span>
                    <span className="font-medium text-text-primary">₦{earning.serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border-default pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-text-primary">Total Amount</span>
                      <span className="text-primary-600">₦{earning.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Rates */}
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-3">Commission Rates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Platform Rate</p>
                    <p className="text-lg font-bold text-text-primary">{earning.platformCommissionRate * 100}%</p>
                  </div>
                  <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Rider Rate</p>
                    <p className="text-lg font-bold text-text-primary">{earning.riderCommissionRate * 100}%</p>
                  </div>
                </div>
              </div>

              {/* Distribution Info */}
              {(earning.distributedAt || earning.refundedAt || earning.distributionNotes) && (
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-3">Distribution Information</h3>
                  <div className="bg-surface-100 rounded-card p-4 border border-border-default space-y-2">
                    {earning.distributedAt && (
                      <div>
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Distributed At</p>
                        <p className="text-sm text-text-primary mt-1">{new Date(earning.distributedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {earning.refundedAt && (
                      <div>
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Refunded At</p>
                        <p className="text-sm text-text-primary mt-1">{new Date(earning.refundedAt).toLocaleString()}</p>
                      </div>
                    )}
                    {earning.distributionNotes && (
                      <div>
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Notes</p>
                        <p className="text-sm text-text-primary mt-1">{earning.distributionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-border-light bg-surface-50">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
