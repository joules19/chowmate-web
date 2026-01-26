"use client";

import { useState } from 'react';
import { useDisputedStrikes } from '@/app/lib/hooks/api-hooks/use-strikes';
import { StrikeDetailsDto } from '@/app/data/types/strikes';
import { DisputeStatus } from '@/app/data/types/deductions';
import { ShieldCheckIcon, EyeIcon } from '@heroicons/react/24/outline';
import AdminPageHeader from '@/app/components/admin/layout/AdminPageHeader';
import StrikesSidebar from '@/app/components/admin/strikes/StrikesSidebar';
import StrikeDetailsModal from '@/app/components/admin/strikes/StrikeDetailsModal';

export default function DisputedStrikesPage() {
    const [selectedDisputeStatus, setSelectedDisputeStatus] = useState<DisputeStatus | undefined>(undefined);
    const [selectedStrike, setSelectedStrike] = useState<StrikeDetailsDto | undefined>(undefined);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const { data: disputes, isLoading } = useDisputedStrikes({ disputeStatus: selectedDisputeStatus });

    const handleViewDetails = (strike: StrikeDetailsDto) => {
        setSelectedStrike(strike);
        setShowDetailsModal(true);
    };

    const getDisputeStatusBadgeClass = (status: DisputeStatus) => {
        switch (status) {
            case DisputeStatus.Pending:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case DisputeStatus.UnderReview:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case DisputeStatus.Approved:
                return 'bg-green-100 text-green-700 border-green-200';
            case DisputeStatus.Rejected:
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <AdminPageHeader
                title="Disputed Strikes"
                subtitle="Review and manage disputed strikes from vendors."
                icon={ShieldCheckIcon}
            />

            {showDetailsModal && selectedStrike && (
                <StrikeDetailsModal
                    strikeId={selectedStrike.id}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedStrike(undefined);
                    }}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <StrikesSidebar />
                </div>

                <div className="lg:col-span-3 bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
                    {/* Filters */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                            Filter by Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedDisputeStatus(undefined)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    selectedDisputeStatus === undefined
                                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Disputes
                            </button>
                            <button
                                onClick={() => setSelectedDisputeStatus(DisputeStatus.Pending)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    selectedDisputeStatus === DisputeStatus.Pending
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setSelectedDisputeStatus(DisputeStatus.UnderReview)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    selectedDisputeStatus === DisputeStatus.UnderReview
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Under Review
                            </button>
                            <button
                                onClick={() => setSelectedDisputeStatus(DisputeStatus.Approved)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    selectedDisputeStatus === DisputeStatus.Approved
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setSelectedDisputeStatus(DisputeStatus.Rejected)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    selectedDisputeStatus === DisputeStatus.Rejected
                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

                    {/* Disputes List */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
                            Disputed Strikes
                            {disputes && (
                                <span className="ml-2 text-sm font-normal text-text-secondary">
                                    ({disputes.totalCount} total)
                                </span>
                            )}
                        </h2>

                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                            </div>
                        )}

                        {!isLoading && disputes?.items.length === 0 && (
                            <div className="text-center py-12">
                                <ShieldCheckIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-text-secondary">
                                    No disputed strikes found
                                    {selectedDisputeStatus && ' for this status filter'}
                                </p>
                            </div>
                        )}

                        {!isLoading && disputes && disputes.items.length > 0 && (
                            <ul className="space-y-4">
                                {disputes.items.map((strike) => (
                                    <li key={strike.id} className="p-4 border rounded-lg hover:border-primary-300 transition-colors">
                                        <div className="flex flex-col sm:flex-row justify-between">
                                            <div className="mb-2 sm:mb-0 flex-1">
                                                <div className="flex items-start space-x-2">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-text-primary">{strike.reason}</p>
                                                        <p className="text-sm text-text-secondary mt-1">{strike.description}</p>
                                                        <p className="text-sm text-text-tertiary mt-2">
                                                            Vendor: {strike.vendorBusinessName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-2 sm:ml-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded border ${getDisputeStatusBadgeClass(
                                                        strike.disputeStatus!
                                                    )}`}
                                                >
                                                    {strike.disputeStatusDisplay}
                                                </span>
                                                <button
                                                    onClick={() => handleViewDetails(strike)}
                                                    className="p-2 rounded-full hover:bg-gray-200"
                                                    title="View Details & Review"
                                                >
                                                    <EyeIcon className="h-5 w-5 text-blue-500" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-tertiary">
                                                <div>
                                                    <span className="font-medium">Ref:</span> {strike.referenceNumber}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Disputed:</span>{' '}
                                                    {strike.disputedAt ? new Date(strike.disputedAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                                {strike.disputeReason && (
                                                    <div className="col-span-2">
                                                        <span className="font-medium">Dispute Reason:</span>{' '}
                                                        <span className="text-purple-600">{strike.disputeReason}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {strike.disputeStatus === DisputeStatus.Pending && (
                                            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                                                ⏳ This dispute is pending review. Click "View Details" to review and take action.
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
