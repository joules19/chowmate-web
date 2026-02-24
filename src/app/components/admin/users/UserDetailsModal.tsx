"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CakeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  StarIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';
import { UserSummaryDto } from '@/app/data/types/vendor';
import { message } from 'antd';
import { useRevokeDeliveryCredits } from '@/app/lib/hooks/api-hooks.ts/use-customer';
import DeliveryCreditsModal from '../customers/DeliveryCreditsModal';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSummaryDto | null;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const revokeMutation = useRevokeDeliveryCredits();
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  if (!user) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Customer':
        return 'bg-blue-100 text-blue-700';
      case 'Vendor':
        return 'bg-green-100 text-green-700';
      case 'Rider':
        return 'bg-purple-100 text-purple-700';
      case 'Admin':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'suspended':
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
      case 'pendingapproval':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    User Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* User Header */}
                <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">{user.fullName}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
                      Personal Information
                    </h5>
                    
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.isEmailVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-green-500 mt-1" title="Email verified" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone Number</p>
                        <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                        {user.isPhoneVerified && (
                          <CheckBadgeIcon className="h-4 w-4 text-green-500 mt-1" title="Phone verified" />
                        )}
                      </div>
                    </div>

                    {user.dateOfBirth && (
                      <div className="flex items-center space-x-3">
                        <CakeIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                          <p className="text-sm text-gray-600">{formatDate(user.dateOfBirth)}</p>
                        </div>
                      </div>
                    )}

                    {(user.city || user.state) && (
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Location</p>
                          <p className="text-sm text-gray-600">
                            {[user.city, user.state].filter(Boolean).join(', ') || 'Not provided'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Registration Date</p>
                        <p className="text-sm text-gray-600">{formatDateTime(user.createdAt)}</p>
                        <p className="text-xs text-gray-500">Member since {user.memberSince}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business & Activity Information */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
                      Activity & Business
                    </h5>

                    {user.businessName && (
                      <div className="flex items-center space-x-3">
                        <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Business Name</p>
                          <p className="text-sm text-gray-600">{user.businessName}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Orders</p>
                        <p className="text-sm text-gray-600">{user.totalOrders} orders</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Spent</p>
                        <p className="text-sm text-gray-600">{formatCurrency(user.totalSpent ?? 0)}</p>
                      </div>
                    </div>

                    {user.totalEarnings !== null && (
                      <div className="flex items-center space-x-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Total Earnings</p>
                          <p className="text-sm text-gray-600">{formatCurrency(user.totalEarnings ?? 0)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Wallet Balance</p>
                        <p className="text-sm text-gray-600">{formatCurrency(user.walletBalance ?? 0)}</p>
                        <p className="text-xs text-gray-500">ID: {user.walletId}</p>
                      </div>
                    </div>

                    {user.rating !== null && (
                      <div className="flex items-center space-x-3">
                        <StarIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Rating</p>
                          <p className="text-sm text-gray-600">{user.rating}/5.0</p>
                        </div>
                      </div>
                    )}

                    {user.isOnline !== null && (
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Status</p>
                          <p className="text-sm text-gray-600">{user.isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Credits — customers only */}
                {user.role === 'Customer' && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <GiftIcon className="h-5 w-5 text-primary-600" />
                        <p className="text-sm font-medium text-primary-800">Delivery Credits</p>
                      </div>
                      <button
                        onClick={() => setShowGrantModal(true)}
                        className="text-xs px-3 py-1 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors font-medium"
                      >
                        + Grant Credits
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-primary-900">
                            {user.activeDeliveryCredits ?? 0}
                          </span>
                          <span className="text-sm text-primary-700">active free deliveries</span>
                        </div>
                        {user.deliveryCreditsExpiry ? (
                          <p className="text-xs text-amber-700 mt-1">
                            Earliest expiry: {formatDate(user.deliveryCreditsExpiry)}
                          </p>
                        ) : (user.activeDeliveryCredits ?? 0) > 0 ? (
                          <p className="text-xs text-primary-600 mt-1">No expiry set</p>
                        ) : (
                          <p className="text-xs text-primary-600 mt-1">No active credits</p>
                        )}
                      </div>
                      {(user.activeDeliveryCredits ?? 0) > 0 && (
                        <div className="flex-shrink-0">
                          {confirmRevoke ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600">Revoke all?</span>
                              <button
                                onClick={async () => {
                                  try {
                                    const result = await revokeMutation.mutateAsync({ userIds: [user.id] });
                                    message.success(`${result.creditsRevoked} delivery credit${result.creditsRevoked !== 1 ? 's' : ''} revoked from ${user.fullName}.`);
                                  } catch {
                                    message.error('Failed to revoke delivery credits. Please try again.');
                                  }
                                  setConfirmRevoke(false);
                                }}
                                disabled={revokeMutation.isPending}
                                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {revokeMutation.isPending ? 'Revoking...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setConfirmRevoke(false)}
                                className="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmRevoke(true)}
                              className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Status */}
                {(user.hasActiveOrders || user.hasActiveDeliveries) && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">
                        Active {user.hasActiveOrders ? 'Orders' : 'Deliveries'}
                      </p>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      This user currently has active {user.hasActiveOrders ? 'orders' : 'deliveries'}.
                    </p>
                  </div>
                )}

                {/* Suspension Information */}
                {user.suspensionReason && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Suspension Reason</p>
                    <p className="text-sm text-red-700 mt-1">{user.suspensionReason}</p>
                    {user.suspendedAt && (
                      <p className="text-xs text-red-600 mt-2">
                        Suspended on: {formatDateTime(user.suspendedAt)}
                      </p>
                    )}
                  </div>
                )}

                {/* Last Activity */}
                {user.lastActivity && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Last Activity</p>
                    <p className="text-sm text-blue-700">{user.lastActivity}</p>
                    {user.lastLoginAt && (
                      <p className="text-xs text-blue-600 mt-1">
                        Last login: {formatDateTime(user.lastLoginAt)}
                      </p>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

    <DeliveryCreditsModal
      userId={user.id}
      customerName={user.fullName}
      isOpen={showGrantModal}
      onClose={() => setShowGrantModal(false)}
    />
    </>
  );
}