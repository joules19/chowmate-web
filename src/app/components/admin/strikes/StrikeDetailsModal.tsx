"use client";

import { useState } from 'react';
import { useStrike } from '@/app/lib/hooks/api-hooks/use-strikes';
import { XMarkIcon, ShieldExclamationIcon, PhotoIcon } from '@heroicons/react/24/outline';
import DisputeReviewModal from './DisputeReviewModal';
import DisputeEvidenceViewer from './DisputeEvidenceViewer';
import { DisputeStatus } from '@/app/data/types/deductions';
import { StrikeStatus } from '@/app/data/types/strikes';

interface StrikeDetailsModalProps {
    strikeId: string;
    onClose: () => void;
}

export default function StrikeDetailsModal({ strikeId, onClose }: StrikeDetailsModalProps) {
    const { data: strike, isLoading, error } = useStrike(strikeId);
    const [showDisputeReview, setShowDisputeReview] = useState(false);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !strike) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white rounded-lg p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="text-center">
                        <p className="text-red-500">Error loading strike details</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-button hover:bg-primary-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div
                    className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ShieldExclamationIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Strike Details</h2>
                                <p className="text-sm text-text-secondary mt-1">{strike.referenceNumber}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-lg border ${getStatusBadgeClass(strike.status)}`}>
                            {strike.statusDisplay}
                        </span>
                        {strike.isDisputed && (
                            <span className="ml-2 inline-block px-3 py-1.5 text-sm font-semibold rounded-lg border bg-purple-100 text-purple-700 border-purple-200">
                                ⚖️ Disputed
                            </span>
                        )}
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Vendor</h3>
                        <p className="text-lg font-semibold text-text-primary">{strike.vendorBusinessName}</p>
                    </div>

                    {/* Strike Information */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Strike Reason</h3>
                            <p className="text-base text-text-primary font-medium">{strike.reason}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-base text-text-primary">{strike.description}</p>
                        </div>

                        {strike.notes && (
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Admin Notes</h3>
                                <p className="text-base text-text-primary italic">{strike.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Evidence Image */}
                    {strike.evidenceImageUrl && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Evidence Image</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <img
                                    src={strike.evidenceImageUrl}
                                    alt="Strike evidence"
                                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                                />
                            </div>
                            {strike.evidenceImageFileName && (
                                <p className="text-xs text-text-tertiary mt-2">File: {strike.evidenceImageFileName}</p>
                            )}
                        </div>
                    )}

                    {/* Dispute Information */}
                    {strike.isDisputed && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider mb-3">
                                Dispute Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-purple-700 mb-1">Status</p>
                                    <p className="text-sm text-purple-900">{strike.disputeStatusDisplay || 'Pending'}</p>
                                </div>
                                {strike.disputeReason && (
                                    <div>
                                        <p className="text-xs font-medium text-purple-700 mb-1">Vendor's Dispute Reason</p>
                                        <p className="text-sm text-purple-900">{strike.disputeReason}</p>
                                    </div>
                                )}
                                {strike.disputedAt && (
                                    <div>
                                        <p className="text-xs font-medium text-purple-700 mb-1">Disputed At</p>
                                        <p className="text-sm text-purple-900">
                                            {new Date(strike.disputedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                                {strike.disputeResolutionNotes && (
                                    <div>
                                        <p className="text-xs font-medium text-purple-700 mb-1">Admin Resolution Notes</p>
                                        <p className="text-sm text-purple-900">{strike.disputeResolutionNotes}</p>
                                    </div>
                                )}
                                {strike.disputeReviewedAt && (
                                    <div>
                                        <p className="text-xs font-medium text-purple-700 mb-1">Reviewed At</p>
                                        <p className="text-sm text-purple-900">
                                            {new Date(strike.disputeReviewedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {strike.disputeStatus === DisputeStatus.Pending && (
                                <button
                                    onClick={() => setShowDisputeReview(true)}
                                    className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-button hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                >
                                    Review Dispute
                                </button>
                            )}
                        </div>
                    )}

                    {/* Dispute Evidence Files */}
                    {strike.isDisputed && strike.disputeEvidenceFiles && strike.disputeEvidenceFiles.length > 0 && (
                        <div className="mb-6">
                            <DisputeEvidenceViewer files={strike.disputeEvidenceFiles} />
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t pt-4 mt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-text-tertiary">Created At</p>
                                <p className="text-text-primary font-medium">
                                    {new Date(strike.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {strike.resolvedAt && (
                                <div>
                                    <p className="text-text-tertiary">Resolved At</p>
                                    <p className="text-text-primary font-medium">
                                        {new Date(strike.resolvedAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-text-tertiary">Created By</p>
                                <p className="text-text-primary font-medium">{strike.createdByAdminName}</p>
                            </div>
                            {strike.resolutionReason && (
                                <div className="col-span-2">
                                    <p className="text-text-tertiary">Resolution Reason</p>
                                    <p className="text-text-primary font-medium">{strike.resolutionReason}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Dispute Review Modal */}
            {showDisputeReview && (
                <DisputeReviewModal
                    strikeId={strikeId}
                    onClose={() => {
                        setShowDisputeReview(false);
                        onClose(); // Close the details modal too
                    }}
                />
            )}
        </>
    );
}
