'use client';

import { Fragment } from 'react';
import { XMarkIcon, MapPinIcon, PhoneIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { AllOrdersDto } from '@/app/data/types/order';
import { formatCurrency } from '@/app/lib/utils/currency';
import CopyButton from '@/app/components/ui/CopyButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: AllOrdersDto | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: Props) {
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

                  {/* Customer Address */}
                  {((order.customer as any).address || (order as any).customerAddress || order.deliveryAddress) && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        {order.isDelivery ? 'Delivery Address' : 'Address'}
                      </div>
                      <div className="space-y-1 text-sm">
                        {/* Full address details if available */}
                        {(() => {
                          const address = (order.customer as any).address || (order as any).customerAddress;
                          if (address) {
                            return (
                              <>
                                {address.addressLine1 && (
                                  <div>{address.addressLine1}</div>
                                )}
                                {address.addressLine2 && (
                                  <div>{address.addressLine2}</div>
                                )}
                                {address.landmarkName && (
                                  <div className="text-gray-600">
                                    <MapPinIcon className="h-3 w-3 inline mr-1" />
                                    Near {address.landmarkName}
                                  </div>
                                )}
                                {address.directionsFromLandmark && (
                                  <div className="text-gray-600 text-xs italic">
                                    {address.directionsFromLandmark}
                                  </div>
                                )}
                                {address.zoneName && (
                                  <div className="text-xs text-gray-500">Zone: {address.zoneName}</div>
                                )}
                                {(address.primaryPhone || address.backupPhone) && (
                                  <div className="flex flex-col space-y-1 text-xs">
                                    {address.primaryPhone && (
                                      <div className="flex items-center">
                                        <PhoneIcon className="h-3 w-3 mr-1" />
                                        Primary: {address.primaryPhone}
                                        <CopyButton text={address.primaryPhone} className="ml-1" iconClassName="h-3 w-3" />
                                      </div>
                                    )}
                                    {address.backupPhone && (
                                      <div className="flex items-center">
                                        <PhoneIcon className="h-3 w-3 mr-1" />
                                        Backup: {address.backupPhone}
                                        <CopyButton text={address.backupPhone} className="ml-1" iconClassName="h-3 w-3" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          } else if (order.deliveryAddress) {
                            /* Fallback to basic delivery address */
                            return (
                              <div className="text-gray-700">
                                <MapPinIcon className="h-3 w-3 inline mr-1" />
                                {order.deliveryAddress}
                              </div>
                            );
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
                    <span className="font-medium">
                      {order.vendor.businessName || `${order.vendor.firstName} ${order.vendor.lastName}`}
                    </span>
                  </div>
                  {order.vendor.address && (
                    <div>
                      <span className="text-gray-600">Address: </span>
                      <span>{order.vendor.address}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{order.vendor.phoneNumber}</span>
                    <CopyButton text={order.vendor.phoneNumber} className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Details & Timeline */}
            <div className="space-y-6">
              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(order.subTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee:</span>
                    <span>{formatCurrency(order.serviceFee)}</span>
                  </div>
                  {order.promoCode && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo ({order.promoCode}):</span>
                      <span>-{formatCurrency(order.promoDiscountAmount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <div>
                      <span className="text-gray-600">Order Placed: </span>
                      <span>{new Date(order.orderDate).toLocaleString()}</span>
                    </div>
                  </div>

                  {order.preparingAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Preparing: </span>
                        <span>{new Date(order.preparingAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {order.riderAssignedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Rider Assigned: </span>
                        <span>{new Date(order.riderAssignedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {order.riderArrivedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Rider Arrived: </span>
                        <span>{new Date(order.riderArrivedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {order.outForDeliveryAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Out for Delivery: </span>
                        <span>{new Date(order.outForDeliveryAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {order.completedAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Completed: </span>
                        <span>{new Date(order.completedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {order.cancelledAt && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <div>
                        <span className="text-gray-600">Cancelled: </span>
                        <span>{new Date(order.cancelledAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {order.orderDuration && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm">
                      <span className="text-gray-600">Total Duration: </span>
                      <span className="font-medium">{order.orderDuration}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rider Info (if available) */}
              {order.rider && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Rider Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name: </span>
                      <span className="font-medium">{order.rider.firstName} {order.rider.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{order.rider.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rating: </span>
                      <span className="font-medium">{order.rider.rating.toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Attempts */}
              {order.assignmentAttempts > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Assignment Info</h3>
                  <div className="text-sm text-gray-600">
                    Assignment attempts: <span className="font-medium">{order.assignmentAttempts}</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Items Section */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div className="mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        {item.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                              <p className="text-sm text-gray-600">
                                Base Price: {formatCurrency(item.basePrice)} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                          
                          {/* Selected Options */}
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Selected Options:</p>
                              <div className="space-y-1">
                                {item.selectedOptions.map((option, optionIndex) => (
                                  <div 
                                    key={`${option.optionId}-${optionIndex}`}
                                    className="flex justify-between items-center text-xs"
                                  >
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

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}