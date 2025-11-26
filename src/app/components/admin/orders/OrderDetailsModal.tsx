'use client';

import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon, PhoneIcon, UserIcon, BuildingStorefrontIcon, BanknotesIcon, TruckIcon } from '@heroicons/react/24/outline';
import { AllOrdersDto } from '@/app/data/types/order';
import { formatCurrency } from '@/app/lib/utils/currency';
import CopyButton from '@/app/components/ui/CopyButton';
import { EarningsRepository } from '@/app/lib/api/repositories/earnings-repository';
import { OrderEarningsDto, EarningsDistributionStatus } from '@/app/data/types/earnings';
import { Tab } from '@headlessui/react';
import { message } from 'antd';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: AllOrdersDto | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: Props) {
  const [earning, setEarning] = useState<OrderEarningsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const earningsRepository = new EarningsRepository();

  useEffect(() => {
    if (isOpen && order) {
      fetchEarnings();
    }
  }, [isOpen, order]);

  const fetchEarnings = async () => {
    if (!order) return;
    setIsLoading(true);
    try {
      const data = await earningsRepository.getOrderEarningByOrderId(order.id);
      setEarning(data);
    } catch (error) {
      console.error("Error fetching order earnings:", error);
      // message.error("Failed to load earnings details for this order.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) return null;

  const getStatusBadge = (statusText: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'Preparing': { color: 'bg-primary-100 text-primary-800', label: 'Preparing' },
      'RiderAssigned': { color: 'bg-purple-100 text-purple-800', label: 'Rider Assigned' },
      'RiderArrived': { color: 'bg-indigo-100 text-indigo-800', label: 'Rider Arrived' },
      'OutForDelivery': { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      'Completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'Cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[statusText] || statusConfig['Pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getEarningStatusColor = (status: EarningsDistributionStatus) => {
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
        return "bg-yellow-300 text-yellow-800 border-yellow-400";
      case EarningsDistributionStatus.Refunded:
        return "bg-gray-200 text-gray-800 border-gray-300";
      default:
        return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Order Details - {order.orderId}
            </h2>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(order.statusText)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span className="flex items-center">
                      {order.isDelivery ? (
                        <>
                          <MapPinIcon className="h-4 w-4 mr-1 text-blue-500" />
                          Delivery
                        </>
                      ) : (
                        <>
                          <BuildingStorefrontIcon className="h-4 w-4 mr-1 text-green-500" />
                          Pickup
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name: </span>
                    <span className="font-medium">{order.customer.firstName} {order.customer.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email: </span>
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{order.customer.phoneNumber}</span>
                    <CopyButton text={order.customer.phoneNumber} className="ml-2" />
                  </div>

                  {((order.customer as any).address || (order as any).customerAddress || order.deliveryAddress) && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {order.isDelivery ? 'Delivery Address' : 'Address'}
                      </div>
                      <div className="space-y-1 text-sm">
                        {(() => {
                          const address = (order.customer as any).address || (order as any).customerAddress;
                          if (address) {
                            return (
                              <>
                                {address.addressLine1 && <div>{address.addressLine1}</div>}
                                {address.addressLine2 && <div>{address.addressLine2}</div>}
                                {address.landmarkName && <div className="text-gray-600"><MapPinIcon className="h-3 w-3 inline mr-1" /> Near {address.landmarkName}</div>}
                                {address.directionsFromLandmark && <div className="text-gray-600 text-xs italic">{address.directionsFromLandmark}</div>}
                                {address.zoneName && <div className="text-xs text-gray-500">Zone: {address.zoneName}</div>}
                                {(address.primaryPhone || address.backupPhone) && (
                                  <div className="flex flex-col space-y-1 text-xs">
                                    {address.primaryPhone && <div className="flex items-center"><PhoneIcon className="h-3 w-3 mr-1" /> Primary: {address.primaryPhone}<CopyButton text={address.primaryPhone} className="ml-1" iconClassName="h-3 w-3" /></div>}
                                    {address.backupPhone && <div className="flex items-center"><PhoneIcon className="h-3 w-3 mr-1" /> Backup: {address.backupPhone}<CopyButton text={address.backupPhone} className="ml-1" iconClassName="h-3 w-3" /></div>}
                                  </div>
                                )}
                              </>
                            );
                          } else if (order.deliveryAddress) {
                            return <div className="text-gray-700"><MapPinIcon className="h-3 w-3 inline mr-1" />{order.deliveryAddress}</div>;
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <BuildingStorefrontIcon className="h-4 w-4 mr-2" />
                  Vendor Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Business: </span>
                    <span className="font-medium">{order.vendor.businessName || `${order.vendor.firstName} ${order.vendor.lastName}`}</span>
                  </div>
                  {order.vendor.address && <div><span className="text-gray-600">Address: </span><span>{order.vendor.address}</span></div>}
                  <div className="flex items-center"><PhoneIcon className="h-4 w-4 mr-1 text-gray-400" /><span>{order.vendor.phoneNumber}</span><CopyButton text={order.vendor.phoneNumber} className="ml-2" /></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span>{formatCurrency(order.subTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Delivery Fee:</span><span>{formatCurrency(order.deliveryFee)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Service Fee:</span><span>{formatCurrency(order.serviceFee)}</span></div>
                  {order.promoCode && <div className="flex justify-between text-green-600"><span>Promo ({order.promoCode}):</span><span>-{formatCurrency(order.promoDiscountAmount || 0)}</span></div>}
                  <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2"><span>Total:</span><span>{formatCurrency(order.totalAmount)}</span></div>
                </div>
              </div>

              {/* Rider Info (if available) */}
              {order.rider && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Rider Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name: </span><span className="font-medium">{order.rider.firstName} {order.rider.lastName}</span></div>
                    <div className="flex items-center"><PhoneIcon className="h-4 w-4 mr-1 text-gray-400" /><span>{order.rider.phoneNumber}</span></div>
                    <div><span className="text-gray-600">Rating: </span><span className="font-medium">{order.rider.rating.toFixed(1)} ⭐</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full px-2 py-8 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <Tab className={({ selected }) => classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-700', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2', selected ? 'bg-white shadow' : 'text-white hover:bg-white/[0.12] hover:text-white')}>
                  Order Items & Timeline
                </Tab>
                <Tab className={({ selected }) => classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary-700', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2', selected ? 'bg-white shadow' : 'text-white hover:bg-white/[0.12] hover:text-white')}>
                  Earnings Breakdown
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className={classNames('rounded-xl bg-white p-3', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items Section */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                          <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                              <div key={`${item.productId}-${index}`} className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-4">
                                  {item.imageUrl && <div className="flex-shrink-0"><img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                                        <p className="text-sm text-gray-600">Base Price: {formatCurrency(item.basePrice)} × {item.quantity}</p>
                                      </div>
                                      <div className="text-right"><p className="text-sm font-medium text-gray-900">{formatCurrency(item.totalPrice)}</p></div>
                                    </div>
                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Selected Options:</p>
                                        <div className="space-y-1">
                                          {item.selectedOptions.map((option, optionIndex) => (
                                            <div key={`${option.optionId}-${optionIndex}`} className="flex justify-between items-center text-xs">
                                              <span className="text-gray-600">• {option.optionName}</span>
                                              <span className="text-gray-900">+{formatCurrency(option.price)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Order Timeline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Order Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm"><div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div><div><span className="text-gray-600">Order Placed: </span><span>{new Date(order.orderDate).toLocaleString()}</span></div></div>
                        {order.preparingAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div><div><span className="text-gray-600">Preparing: </span><span>{new Date(order.preparingAt).toLocaleString()}</span></div></div>}
                        {order.riderAssignedAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div><div><span className="text-gray-600">Rider Assigned: </span><span>{new Date(order.riderAssignedAt).toLocaleString()}</span></div></div>}
                        {order.riderArrivedAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div><div><span className="text-gray-600">Rider Arrived: </span><span>{new Date(order.riderArrivedAt).toLocaleString()}</span></div></div>}
                        {order.outForDeliveryAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div><div><span className="text-gray-600">Out for Delivery: </span><span>{new Date(order.outForDeliveryAt).toLocaleString()}</span></div></div>}
                        {order.completedAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div><div><span className="text-gray-600">Completed: </span><span>{new Date(order.completedAt).toLocaleString()}</span></div></div>}
                        {order.cancelledAt && <div className="flex items-center text-sm"><div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div><div><span className="text-gray-600">Cancelled: </span><span>{new Date(order.cancelledAt).toLocaleString()}</span></div></div>}
                      </div>
                      {order.orderDuration && <div className="mt-3 pt-3 border-t border-gray-200"><div className="text-sm"><span className="text-gray-600">Total Duration: </span><span className="font-medium">{order.orderDuration}</span></div></div>}
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel className={classNames('rounded-xl bg-white p-3', 'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2')}>
                  {isLoading ? (
                    <div className="text-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div><p className="mt-2 text-sm text-gray-500">Loading earnings...</p></div>
                  ) : earning ? (
                    <div className="space-y-6">
                      <div className="bg-primary-50 rounded-card p-6 border border-primary-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-primary-700 uppercase tracking-wider">Total Order Amount</p>
                            <p className="text-3xl font-bold text-primary-900 mt-1">₦{earning.totalAmount.toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-primary-100 rounded-soft"><BanknotesIcon className="h-8 w-8 text-primary-600" /></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-success-50 rounded-soft"><BuildingStorefrontIcon className="h-5 w-5 text-success-600" /></div><div className="flex-1 min-w-0"><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Vendor</p><p className="text-sm font-medium text-text-primary truncate">{earning.vendorName}</p></div></div>
                          <p className="text-2xl font-bold text-success-600">₦{earning.vendorEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-info-50 rounded-soft"><TruckIcon className="h-5 w-5 text-info-600" /></div><div className="flex-1 min-w-0"><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Rider</p><p className="text-sm font-medium text-text-primary truncate">{earning.riderName || 'N/A'}</p></div></div>
                          <p className="text-2xl font-bold text-info-600">₦{earning.riderEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface-100 rounded-card p-4 border border-border-default">
                          <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-primary-50 rounded-soft"><BanknotesIcon className="h-5 w-5 text-primary-600" /></div><div className="flex-1 min-w-0"><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Platform</p><p className="text-sm font-medium text-text-primary">Chowmate</p></div></div>
                          <p className="text-2xl font-bold text-primary-600">₦{earning.platformEarnings.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-text-primary mb-3">Commission Rates</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-100 rounded-card p-4 border border-border-default"><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Platform Rate</p><p className="text-lg font-bold text-text-primary">{earning.platformCommissionRate * 100}%</p></div>
                          <div className="bg-surface-100 rounded-card p-4 border border-border-default"><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Rider Rate</p><p className="text-lg font-bold text-text-primary">{earning.riderCommissionRate * 100}%</p></div>
                        </div>
                      </div>
                      {(earning.distributedAt || earning.refundedAt || earning.distributionNotes) && (
                        <div>
                          <h3 className="text-base font-semibold text-text-primary mb-3">Distribution Information</h3>
                          <div className="bg-surface-100 rounded-card p-4 border border-border-default space-y-2">
                            {earning.distributedAt && <div><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Distributed At</p><p className="text-sm text-text-primary mt-1">{new Date(earning.distributedAt).toLocaleString()}</p></div>}
                            {earning.refundedAt && <div><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Refunded At</p><p className="text-sm text-text-primary mt-1">{new Date(earning.refundedAt).toLocaleString()}</p></div>}
                            {earning.distributionNotes && <div><p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Notes</p><p className="text-sm text-text-primary mt-1">{earning.distributionNotes}</p></div>}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8"><p className="text-sm text-gray-500">No earnings data available for this order.</p></div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
