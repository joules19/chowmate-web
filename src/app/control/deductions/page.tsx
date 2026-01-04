"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useVendors } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import { VendorStatus, VendorSummary } from '@/app/data/types/vendor';
import { useDeductions, useCancelDeduction, useProcessDeductionsForVendor, useProcessSingleDeduction } from '@/app/lib/hooks/api-hooks/use-deductions';
import { DeductionDto, DisputeStatus, DeductionStatus } from '@/app/data/types/deductions';
import { PencilIcon, TrashIcon, PlayIcon, ShieldCheckIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';
import DeductionForm from '@/app/components/admin/deductions/DeductionForm';
import { AuthService } from '@/app/lib/auth/auth-service';
import ConfirmationModal from '@/app/components/admin/shared/ConfirmationModal';
import AdminPageHeader from '@/app/components/admin/layout/AdminPageHeader';
import DeductionsSidebar from '@/app/components/admin/deductions/DeductionsSidebar';

export default function DeductionsPage() {
    const [selectedVendor, setSelectedVendor] = useState<VendorSummary | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingDeduction, setEditingDeduction] = useState<DeductionDto | undefined>(undefined);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    const { data: vendors, isLoading: vendorsLoading } = useVendors({ status: VendorStatus.Approved, pageSize: 1000 });
    const { data: deductions, isLoading: deductionsLoading } = useDeductions({ vendorId: selectedVendor?.id });
    const cancelDeduction = useCancelDeduction();
    const processAllDeductions = useProcessDeductionsForVendor();
    const processSingleDeduction = useProcessSingleDeduction();
    const user = AuthService.getUser();

    const handleCreate = () => {
        setEditingDeduction(undefined);
        setShowModal(true);
    };

    const handleEdit = (deduction: DeductionDto) => {
        setEditingDeduction(deduction);
        setShowModal(true);
    };

    const handleCancel = (deduction: DeductionDto) => {
        setConfirmTitle('Cancel Deduction');
        setConfirmMessage(`Are you sure you want to cancel this deduction: ${deduction.description}? This action cannot be undone.`);
        setConfirmAction(() => () => {
            const adminUserId = user?.id || '';
            const adminUserName = `${user?.firstName} ${user?.lastName}`.trim() || 'Admin';
            cancelDeduction.mutate({
                deductionId: deduction.id,
                request: {
                    cancellationReason: 'Cancelled by admin',
                    adminUserId,
                    adminUserName,
                },
            });
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handleProcessAllDeductions = () => {
        if (selectedVendor) {
            setConfirmTitle('Process All Deductions');
            setConfirmMessage(`Are you sure you want to process all pending deductions for ${selectedVendor.businessName}?`);
            setConfirmAction(() => () => {
                processAllDeductions.mutate(selectedVendor.id);
                setShowConfirmModal(false);
            });
            setShowConfirmModal(true);
        }
    };

    const handleProcessSingleDeduction = (deduction: DeductionDto) => {
        setConfirmTitle('Process Single Deduction');
        setConfirmMessage(`Are you sure you want to process this deduction: ${deduction.description}?`);
        setConfirmAction(() => () => {
            processSingleDeduction.mutate(deduction.id);
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <AdminPageHeader
                title="Vendor Deductions"
                subtitle="Manage and track deductions for vendors."
                icon={ReceiptRefundIcon}
            />

            {showModal && selectedVendor && (
                <DeductionForm
                    vendor={selectedVendor}
                    deduction={editingDeduction}
                    onClose={() => setShowModal(false)}
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
                    <DeductionsSidebar />
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">Approved Vendors</h2>
                            {/* <Link href="/control/deductions/disputes" className="w-full sm:w-auto px-3 py-2 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium flex items-center">
                            <ShieldCheckIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline">View Disputed</span>
                        </Link> */}
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
                                        Deductions for {selectedVendor.businessName}
                                    </h2>
                                    <div className="flex space-x-2 w-full sm:w-auto">
                                        {/* <button
                                        onClick={handleProcessAllDeductions}
                                        className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 bg-purple-500 text-text-inverse rounded-button hover:bg-purple-600 active:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                        disabled={processAllDeductions.isPending}
                                    >
                                        <span className="hidden sm:inline">{processAllDeductions.isPending ? 'Processing...' : 'Process All'}</span>
                                        <span className="sm:hidden">Process All</span>
                                    </button> */}
                                        <button
                                            onClick={handleCreate}
                                            className="flex-1 sm:flex-none w-full sm:w-auto px-3 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                        >
                                            <span className="hidden sm:inline">Create Deduction</span>
                                            <span className="sm:hidden">Create</span>
                                        </button>
                                    </div>
                                </div>
                                {deductionsLoading && <p>Loading deductions...</p>}
                                {deductions?.items.length === 0 && (
                                    <p className="text-sm text-text-secondary">No deductions found for this vendor.</p>
                                )}
                                <ul className="space-y-4">
                                    {deductions?.items.map((deduction) => (
                                        <li key={deduction.id} className="p-4 border rounded-lg">
                                                                                            <div className="flex flex-col sm:flex-row justify-between">
                                                                                                <div className='mb-2 sm:mb-0'>
                                                                                                    <p className="font-semibold text-text-primary">{deduction.description}</p>
                                                                                                    <p className="text-sm text-text-secondary">{deduction.reason}</p>
                                                                                                </div>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                    <p className="text-red-500 font-semibold">
                                                                                                        ₦{deduction.amount.toFixed(2)}
                                                                                                    </p>
                                                                                                    {deduction.status !== DeductionStatus.Cancelled && deduction.status !== DeductionStatus.FullyPaid && deduction.disputeStatus !== DisputeStatus.Approved && (
                                                                                                        <>
                                                                                                            <button onClick={() => handleProcessSingleDeduction(deduction)} className="p-2 rounded-full hover:bg-gray-200">
                                                                                                                <PlayIcon className="h-5 w-5 text-green-500" />
                                                                                                            </button>
                                                                                                            <button onClick={() => handleEdit(deduction)} className="p-2 rounded-full hover:bg-gray-200">
                                                                                                                <PencilIcon className="h-5 w-5" />
                                                                                                            </button>
                                                                                                            <button onClick={() => handleCancel(deduction)} className="p-2 rounded-full hover:bg-gray-200">
                                                                                                                <TrashIcon className="h-5 w-5 text-red-500" />
                                                                                                            </button>
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>                                            <div className="text-xs text-text-tertiary mt-2">
                                                <span>Status: {deduction.statusDisplay}</span>
                                                <span className="mx-2">|</span>
                                                <span>Created: {new Date(deduction.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-text-secondary">Select a vendor to view their deductions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}