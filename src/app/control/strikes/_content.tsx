"use client";

import { useState } from 'react';
import { useVendors } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import { VendorStatus, VendorSummary } from '@/app/data/types/vendor';
import { useStrikes, useResolveStrike } from '@/app/lib/hooks/api-hooks/use-strikes';
import { StrikeDto, StrikeStatus } from '@/app/data/types/strikes';
import { ShieldExclamationIcon, CheckCircleIcon, EyeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import StrikeForm from '@/app/components/admin/strikes/StrikeForm';
import StrikeDetailsModal from '@/app/components/admin/strikes/StrikeDetailsModal';
import { AuthService } from '@/app/lib/auth/auth-service';
import ConfirmationModal from '@/app/components/admin/shared/ConfirmationModal';
import AdminPageHeader from '@/app/components/admin/layout/AdminPageHeader';
import StrikesSidebar from '@/app/components/admin/strikes/StrikesSidebar';
import Link from 'next/link';

export default function StrikesPage() {
    const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStrike, setSelectedStrike] = useState<StrikeDto | undefined>(undefined);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    const { data: vendors, isLoading: vendorsLoading } = useVendors({ status: VendorStatus.Approved, pageSize: 1000 });
    const { data: strikes, isLoading: strikesLoading } = useStrikes({ vendorId: selectedVendor?.id });
    const resolveStrike = useResolveStrike();
    const user = AuthService.getUser();

    const handleCreate = () => {
        setShowCreateModal(true);
    };

    const handleViewDetails = (strike: StrikeDto) => {
        setSelectedStrike(strike);
        setShowDetailsModal(true);
    };

    const handleResolve = (strike: StrikeDto) => {
        setConfirmTitle('Resolve Strike');
        setConfirmMessage(`Are you sure you want to resolve this strike: ${strike.reason}? This action cannot be undone.`);
        setConfirmAction(() => () => {
            const adminUserId = user?.id || '';
            const adminUserName = `${user?.firstName} ${user?.lastName}`.trim() || 'Admin';
            resolveStrike.mutate({
                strikeId: strike.id,
                request: {
                    resolutionReason: 'Resolved by admin',
                    adminUserId,
                    adminUserName,
                },
            });
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const getStatusBadgeClass = (status: StrikeStatus) => {
        switch (status) {
            case StrikeStatus.Active:
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case StrikeStatus.Resolved:
                return 'bg-green-100 text-green-700 border-green-200';
            case StrikeStatus.Disputed:
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case StrikeStatus.ConvertedToDeduction:
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <AdminPageHeader
                title="Vendor Strikes"
                subtitle="Manage and track strikes for vendors."
                icon={ShieldExclamationIcon}
            />

            {showCreateModal && selectedVendor && (
                <StrikeForm
                    vendor={selectedVendor}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {showDetailsModal && selectedStrike && (
                <StrikeDetailsModal
                    strikeId={selectedStrike.id}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedStrike(undefined);
                    }}
                />
            )}

            {showConfirmModal && confirmAction && (
                <ConfirmationModal
                    title={confirmTitle}
                    message={confirmMessage}
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <StrikesSidebar />
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">Approved Vendors</h2>
                        </div>
                        {vendorsLoading && <p>Loading vendors...</p>}
                        <ul className="space-y-2">
                            {vendors?.items.map((vendor) => (
                                <li
                                    key={vendor.id}
                                    onClick={() => setSelectedVendor(vendor)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedVendor?.id === vendor.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100'}`}
                                >
                                    {vendor.businessName}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
                        {selectedVendor ? (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
                                        Strikes for {selectedVendor.businessName}
                                    </h2>
                                    <div className="flex space-x-2 w-full sm:w-auto">
                                        <Link
                                            href="/control/strikes/disputes"
                                            className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 bg-purple-500 text-text-inverse rounded-button hover:bg-purple-600 active:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium flex items-center justify-center"
                                        >
                                            <ShieldCheckIcon className="h-5 w-5 sm:mr-2" />
                                            <span className="hidden sm:inline">View Disputes</span>
                                        </Link>
                                        <button
                                            onClick={handleCreate}
                                            className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                        >
                                            <span className="hidden sm:inline">Create Strike</span>
                                            <span className="sm:hidden">Create</span>
                                        </button>
                                    </div>
                                </div>
                                {strikesLoading && <p>Loading strikes...</p>}
                                {strikes?.items.length === 0 && (
                                    <p className="text-sm text-text-secondary">No strikes found for this vendor.</p>
                                )}
                                <ul className="space-y-4">
                                    {strikes?.items.map((strike) => (
                                        <li key={strike.id} className="p-4 border rounded-lg">
                                            <div className="flex flex-col sm:flex-row justify-between">
                                                <div className='mb-2 sm:mb-0'>
                                                    <p className="font-semibold text-text-primary">{strike.reason}</p>
                                                    <p className="text-sm text-text-secondary">{strike.description}</p>
                                                    {strike.evidenceImageUrl && (
                                                        <p className="text-xs text-blue-500 mt-1">📎 Evidence attached</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeClass(strike.status)}`}>
                                                        {strike.statusDisplay}
                                                    </span>
                                                    <button
                                                        onClick={() => handleViewDetails(strike)}
                                                        className="p-2 rounded-full hover:bg-gray-200"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="h-5 w-5 text-blue-500" />
                                                    </button>
                                                    {strike.status === StrikeStatus.Active && !strike.isDisputed && (
                                                        <button
                                                            onClick={() => handleResolve(strike)}
                                                            className="p-2 rounded-full hover:bg-gray-200"
                                                            title="Resolve Strike"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-text-tertiary mt-2">
                                                <span>Ref: {strike.referenceNumber}</span>
                                                <span className="mx-2">|</span>
                                                <span>Created: {new Date(strike.createdAt).toLocaleDateString()}</span>
                                                {strike.isDisputed && (
                                                    <>
                                                        <span className="mx-2">|</span>
                                                        <span className="text-purple-600 font-semibold">⚠️ Disputed</span>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-text-secondary">Select a vendor to view their strikes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
