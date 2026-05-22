"use client";

import { useState } from 'react';
import { useDisputedDeductions, useReviewDispute, useDeduction } from '@/app/lib/hooks/api-hooks/use-deductions';
import { DeductionDto, DisputeStatus, DeductionStatus } from '@/app/data/types/deductions';
import { ShieldExclamationIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AuthService } from '@/app/lib/auth/auth-service';
import Image from 'next/image';
import AdminPageHeader from '@/app/components/admin/layout/AdminPageHeader';
import StatusBadge from '@/app/components/admin/shared/StatusBadge';
import DeductionsSidebar from '@/app/components/admin/deductions/DeductionsSidebar';

export default function DisputedDeductionsPage() {
    const { data: disputedDeductions, isLoading: deductionsLoading } = useDisputedDeductions();
    const reviewDispute = useReviewDispute();
    const user = AuthService.getUser();
    const [reviewingDeductionId, setReviewingDeductionId] = useState<string | null>(null);

    const handleReview = (deductionId: string) => {
        setReviewingDeductionId(deductionId);
    };

    const handleCloseModal = () => {
        setReviewingDeductionId(null);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <AdminPageHeader
                title="Disputed Deductions"
                subtitle="Review and resolve disputed deductions."
                icon={ShieldExclamationIcon}
            />

            {reviewingDeductionId && (
                <ReviewDisputeModal
                    deductionId={reviewingDeductionId}
                    onClose={handleCloseModal}
                    reviewDisputeMutation={reviewDispute}
                    currentUserId={user?.id}
                    currentUserName={`${user?.firstName} ${user?.lastName}`}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <DeductionsSidebar />
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
                {deductionsLoading && <p>Loading disputed deductions...</p>}
                {!deductionsLoading && disputedDeductions?.items.length === 0 && (
                    <p className="text-sm text-text-secondary">No disputed deductions found.</p>
                )}
                <ul className="space-y-4">
                    {disputedDeductions?.items.map((deduction) => (
                        <li key={deduction.id} className="p-5 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all bg-white">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className='flex-1'>
                                    <div className="flex items-center gap-3 flex-wrap mb-2">
                                        <p className="font-bold text-lg text-gray-900">{deduction.vendorBusinessName}</p>
                                        {deduction.disputeStatus && <StatusBadge status={deduction.disputeStatus} />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-700">{deduction.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Amount:</span>
                                                <span className="font-bold text-red-600">₦{deduction.amount.toFixed(2)}</span>
                                            </span>
                                            <span className="text-gray-300">|</span>
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Disputed:</span>
                                                {new Date(deduction.disputedAt!).toLocaleDateString()}
                                            </span>
                                            {deduction.disputeStatusDisplay && (
                                                <>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">Status:</span>
                                                        {deduction.disputeStatusDisplay}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleReview(deduction.id)}
                                    className="whitespace-nowrap px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold"
                                >
                                    Review Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewDisputeModal({ deductionId, onClose, reviewDisputeMutation, currentUserId, currentUserName }: any) {
    const { data: deductionDetails, isLoading } = useDeduction(deductionId);
    const [resolutionNotes, setResolutionNotes] = useState('');

    const handleApprove = () => {
        if (deductionDetails) {
            reviewDisputeMutation.mutate({
                deductionId: deductionDetails.id,
                request: {
                    approve: true,
                    resolutionNotes: resolutionNotes || 'Approved by admin',
                    adminUserId: currentUserId,
                    adminUserName: currentUserName,
                },
            });
            onClose();
        }
    };

    const handleReject = () => {
        if (deductionDetails) {
            reviewDisputeMutation.mutate({
                deductionId: deductionDetails.id,
                request: {
                    approve: false,
                    resolutionNotes: resolutionNotes || 'Rejected by admin',
                    adminUserId: currentUserId,
                    adminUserName: currentUserName,
                },
            });
            onClose();
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                    <p>Loading details...</p>
                </div>
            </div>
        );
    }

    const isResolved = deductionDetails?.disputeStatus === DisputeStatus.Approved || deductionDetails?.disputeStatus === DisputeStatus.Rejected;
    const isCancelled = deductionDetails?.status === DeductionStatus.Cancelled;
    const canTakeAction = !isResolved && !isCancelled;
    const isPending = reviewDisputeMutation.isPending;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Review Dispute</h2>
                        {deductionDetails?.disputeStatus && (
                            <StatusBadge status={deductionDetails.disputeStatus} />
                        )}
                        {isCancelled && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                Deduction Cancelled
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        disabled={isPending}
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {deductionDetails && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-2 space-y-5">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Vendor Information</h3>
                                    <p className="text-xl font-bold text-gray-900">{deductionDetails.vendorBusinessName}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Deduction Amount</h3>
                                        <p className="text-2xl font-bold text-red-600">₦{deductionDetails.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Description</h3>
                                        <p className="text-base text-gray-800">{deductionDetails.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Deduction Status</h3>
                                        <p className="text-base font-semibold text-gray-800">{deductionDetails.statusDisplay || deductionDetails.status}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Disputed On</h3>
                                        <p className="text-base text-gray-800">
                                            {deductionDetails.disputedAt ? new Date(deductionDetails.disputedAt).toLocaleString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Dispute Reason</h3>
                                    <p className="text-base text-gray-800 leading-relaxed">{deductionDetails.disputeReason || 'No reason provided'}</p>
                                </div>

                                {(isResolved || isCancelled) && deductionDetails.disputeResolutionNotes && (
                                    <div className={`p-5 rounded-xl border ${isResolved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Resolution Notes</h3>
                                        <p className="text-base text-gray-800 leading-relaxed">{deductionDetails.disputeResolutionNotes}</p>
                                        {deductionDetails.disputeReviewedAt && (
                                            <p className="text-xs text-gray-500 mt-3">
                                                Reviewed on: {new Date(deductionDetails.disputeReviewedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {isCancelled && deductionDetails.cancellationReason && (
                                    <div className="bg-red-50 p-5 rounded-xl border border-red-200">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Cancellation Reason</h3>
                                        <p className="text-base text-gray-800 leading-relaxed">{deductionDetails.cancellationReason}</p>
                                        {deductionDetails.cancelledAt && (
                                            <p className="text-xs text-gray-500 mt-3">
                                                Cancelled on: {new Date(deductionDetails.cancelledAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {canTakeAction && (
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Resolution Notes</h3>
                                        <textarea
                                            value={resolutionNotes}
                                            onChange={(e) => setResolutionNotes(e.target.value)}
                                            placeholder="Add your resolution notes here..."
                                            rows={4}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-gray-800"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1">
                                {deductionDetails.disputeEvidenceFiles && deductionDetails.disputeEvidenceFiles.length > 0 ? (
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Evidence Files</h3>
                                        <div className="space-y-3">
                                            {deductionDetails.disputeEvidenceFiles.map((file) => (
                                                <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                                    <Image
                                                        src={file.fileUrl}
                                                        alt={file.fileName}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 h-full flex items-center justify-center">
                                        <p className="text-sm text-gray-500">No evidence files provided</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm font-semibold"
                                disabled={isPending}
                            >
                                {canTakeAction ? 'Cancel' : 'Close'}
                            </button>
                            {canTakeAction && (
                                <>
                                    <button
                                        onClick={handleReject}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50"
                                        disabled={isPending}
                                    >
                                        {isPending ? 'Rejecting...' : 'Reject Dispute'}
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50"
                                        disabled={isPending}
                                    >
                                        {isPending ? 'Approving...' : 'Approve Dispute'}
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
