"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    BuildingStorefrontIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { VendorStatus } from '@/app/data/types/vendor';
import { useVendor } from '@/app/lib/hooks/api-hooks.ts/use-vendor';

interface Props {
    vendorId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function VendorDetailsModal({ vendorId, isOpen, onClose }: Props) {
    const { data: vendor, isLoading, error } = useVendor(vendorId);

    if (isLoading) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="w-full max-w-4xl bg-surface-0 rounded-card p-6">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-surface-100 rounded mb-4 w-1/3"></div>
                                    <div className="space-y-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-16 bg-surface-100 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    if (error || !vendor) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="w-full max-w-md bg-surface-0 rounded-card p-6">
                                <p className="text-danger-600">Failed to load vendor details</p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-button"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

    const getStatusIcon = (status: VendorStatus) => {
        switch (status) {
            case VendorStatus.Approved:
                return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
            case VendorStatus.Rejected:
            case VendorStatus.Suspended:
                return <XCircleIcon className="h-5 w-5 text-danger-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-warning-500" />;
        }
    };

    return (
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                {/* Header */}
                                <div className="relative">
                                    <div className="pt-6 px-6 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-card bg-surface-50 border-2 border-border-light overflow-hidden">
                                                {vendor.logoUrl ? (
                                                    <img
                                                        src={vendor.logoUrl}
                                                        alt={vendor.businessName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                                        <BuildingStorefrontIcon className="h-8 w-8 text-primary-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3">
                                                    <h1 className="text-xl font-bold text-text-primary">
                                                        {vendor.businessName || vendor.firstName + ' ' + vendor.lastName}
                                                    </h1>
                                                    {getStatusIcon(vendor.status)}
                                                </div>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <div className="flex items-center">
                                                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="ml-1 text-sm text-text-primary">
                                                            {vendor.rating?.toFixed(1) || 'N/A'} ({vendor.reviewCount || 0} reviews)
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-text-tertiary">
                                                        Member since {vendor.vendorSince}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-surface-100 rounded-full transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Main Info */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Business Information */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                                                    <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
                                                    Business Information
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Business Name</label>
                                                        <p className="text-text-primary">{vendor.businessName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Business Type</label>
                                                        <p className="text-text-primary">{vendor.businessType || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                                        <p className="text-text-primary">{vendor.user?.firstName + " " + vendor.user?.lastName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Zone Assigned</label>
                                                        <p className="text-text-primary">{vendor.isZoneAssigned ? 'Yes' : 'No'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">RC Number</label>
                                                        <p className="text-text-primary">{vendor.rcNumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center">
                                                        <EnvelopeIcon className="h-4 w-4 text-text-tertiary mr-2" />
                                                        <div>
                                                            <label className="text-sm font-medium text-text-secondary">Email</label>
                                                            <p className="text-text-primary">{vendor.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <PhoneIcon className="h-4 w-4 text-text-tertiary mr-2" />
                                                        <div>
                                                            <label className="text-sm font-medium text-text-secondary">Phone</label>
                                                            <p className="text-text-primary">{vendor.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Business Location */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                                                    <MapPinIcon className="h-5 w-5 mr-2" />
                                                    Business Location
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="text-sm font-medium text-text-secondary">Address</label>
                                                        <p className="text-text-primary">{vendor.address || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Email Verified</label>
                                                        <span className={vendor.verificationStatus?.emailVerified ? 'text-success-600' : 'text-danger-600'}>
                                                            {vendor.verificationStatus?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Phone Verified</label>
                                                        <span className={vendor.verificationStatus?.phoneVerified ? 'text-success-600' : 'text-danger-600'}>
                                                            {vendor.verificationStatus?.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-text-secondary">Location Verified</label>
                                                        <div className="flex items-center">
                                                            {vendor.verificationStatus?.locationVerified ? (
                                                                <CheckCircleIcon className="h-4 w-4 text-success-500 mr-1" />
                                                            ) : (
                                                                <XCircleIcon className="h-4 w-4 text-danger-500 mr-1" />
                                                            )}
                                                            <span className={vendor.verificationStatus?.locationVerified ? 'text-success-600' : 'text-danger-600'}>
                                                                {vendor.verificationStatus?.locationVerified ? 'Verified' : 'Not Verified'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sidebar */}
                                        <div className="space-y-6">
                                            {/* Quick Stats */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4">Performance</h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">Total Orders</span>
                                                        <span className="font-medium text-text-primary">{vendor.totalOrders?.toLocaleString() || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">Total Revenue</span>
                                                        <span className="font-medium text-text-primary">${vendor.totalRevenue?.toLocaleString() || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">Compliance Score</span>
                                                        <span className="font-medium text-text-primary">{vendor.complianceScore || 0}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Zone Assignments */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4">Zone Assignments</h3>
                                                {vendor.zoneAssignments && vendor.zoneAssignments.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {vendor.zoneAssignments.map((zone) => (
                                                            <div key={zone.id} className="bg-surface-0 rounded-button p-3 border">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-medium text-text-primary">{zone.zoneName}</div>
                                                                        <div className="text-sm text-text-secondary">
                                                                            {zone.canDeliverTo ? 'Can deliver' : 'Cannot deliver'}
                                                                        </div>
                                                                    </div>
                                                                    <div className={`h-2 w-2 rounded-full ${zone.isActive ? 'bg-success-500' : 'bg-danger-500'}`}></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 text-text-tertiary">
                                                        <MapPinIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                        <p>No zones assigned</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Verification Status */}
                                            {vendor.verificationStatus && (
                                                <div className="bg-surface-50 rounded-card p-4">
                                                    <h3 className="text-lg font-semibold text-text-primary mb-4">Verification Status</h3>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Email</span>
                                                            <span className={vendor.verificationStatus.emailVerified ? 'text-success-600' : 'text-danger-600'}>
                                                                {vendor.verificationStatus.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Phone</span>
                                                            <span className={vendor.verificationStatus.phoneVerified ? 'text-success-600' : 'text-danger-600'}>
                                                                {vendor.verificationStatus.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Business</span>
                                                            <span className={vendor.verificationStatus.businessVerified ? 'text-success-600' : 'text-danger-600'}>
                                                                {vendor.verificationStatus.businessVerified ? '✓ Verified' : '✗ Not Verified'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Documents</span>
                                                            <span className={vendor.verificationStatus.documentVerified ? 'text-success-600' : 'text-danger-600'}>
                                                                {vendor.verificationStatus.documentVerified ? '✓ Verified' : '✗ Not Verified'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Status History */}
                                            <div className="bg-surface-50 rounded-card p-4">
                                                <h3 className="text-lg font-semibold text-text-primary mb-4">Status History</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-text-secondary">Created</span>
                                                        <span className="text-text-primary">{new Date(vendor.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    {vendor.approvedAt && (
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Approved</span>
                                                            <span className="text-text-primary">{new Date(vendor.approvedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {vendor.rejectedAt && (
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Rejected</span>
                                                            <span className="text-text-primary">{new Date(vendor.rejectedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    {vendor.suspendedAt && (
                                                        <div className="flex justify-between">
                                                            <span className="text-text-secondary">Suspended</span>
                                                            <span className="text-text-primary">{new Date(vendor.suspendedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}