"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    MapPinIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

import { useAssignVendorToZone, useAvailableZones, useVendorZones, useRemoveVendorFromZone } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import LoadingState from '../../ui/LoadingState';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Spinner from '../../ui/Spinner';
import { message } from 'antd';

interface Props {
    vendorId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ZoneAssignmentModal({ vendorId, isOpen, onClose }: Props) {
    const [selectedZoneId, setSelectedZoneId] = useState('');
    const [canDeliverTo, setCanDeliverTo] = useState(true);
    const [customDeliveryFee, setCustomDeliveryFee] = useState('');
    const [customDeliveryTime, setCustomDeliveryTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingZone, setEditingZone] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        zoneId: string;
        zoneName: string;
        isRemoving: boolean;
    }>({
        isOpen: false,
        zoneId: '',
        zoneName: '',
        isRemoving: false
    });
    const [editData, setEditData] = useState<{
        canDeliverTo: boolean;
        customDeliveryFee: string;
        customDeliveryTime: string;
    }>({
        canDeliverTo: true,
        customDeliveryFee: '',
        customDeliveryTime: ''
    });

    const { data: currentZones, isLoading: zonesLoading, refetch } = useVendorZones(vendorId);
    const { data: availableZones, isLoading: availableZonesLoading } = useAvailableZones();
    const assignZoneMutation = useAssignVendorToZone();
    const removeZoneMutation = useRemoveVendorFromZone();
    // const updateZoneMutation = useUpdateZoneAssignment();

    const assignedZoneIds = currentZones?.map(z => z.zoneId) || [];
    const unassignedZones = availableZones?.filter(zone =>
        !assignedZoneIds.includes(zone.id!) && zone.isActive
    ) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedZoneId) return;

        setIsSubmitting(true);
        try {
            await assignZoneMutation.mutateAsync({
                vendorId,
                request: {
                    zoneId: selectedZoneId,
                    canDeliverTo,
                    customDeliveryFee: customDeliveryFee ? parseFloat(customDeliveryFee) : undefined,
                    customDeliveryTime: customDeliveryTime || undefined
                }
            });

            // Show success notification
            const selectedZone = availableZones?.find(z => z.id === selectedZoneId);
            message.success(`Vendor has been successfully assigned to ${selectedZone?.zoneName || 'the selected zone'}!`);

            // Reset form
            setSelectedZoneId('');
            setCanDeliverTo(true);
            setCustomDeliveryFee('');
            setCustomDeliveryTime('');

            refetch();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            message.error(`Failed to assign zone: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveZoneClick = (zoneId: string, zoneName: string) => {
        setConfirmDialog({
            isOpen: true,
            zoneId,
            zoneName,
            isRemoving: false
        });
    };

    const handleConfirmRemove = async () => {
        setConfirmDialog(prev => ({ ...prev, isRemoving: true }));

        try {
            await removeZoneMutation.mutateAsync({
                vendorId,
                zoneId: confirmDialog.zoneId
            });
            
            // Show success notification
            message.success(`Vendor has been successfully unassigned from ${confirmDialog.zoneName}.`);
            
            refetch();
            setConfirmDialog({
                isOpen: false,
                zoneId: '',
                zoneName: '',
                isRemoving: false
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            message.error(`Failed to remove zone assignment: ${errorMessage}`);
            setConfirmDialog(prev => ({ ...prev, isRemoving: false }));
        }
    };

    const handleCancelRemove = () => {
        setConfirmDialog({
            isOpen: false,
            zoneId: '',
            zoneName: '',
            isRemoving: false
        });
    };

    // const handleEditZone = (zone: VendorZoneAssignment) => {
    //     setEditingZone(zone.id);
    //     setEditData({
    //         canDeliverTo: zone.canDeliverTo,
    //         customDeliveryFee: zone.customDeliveryFee?.toString() || '',
    //         customDeliveryTime: zone.customDeliveryTime || ''
    //     });
    // };

    // const handleSaveEdit = async (zoneId: string, vendorZoneId: string) => {
    //     try {
    //         await updateZoneMutation.mutateAsync({
    //             vendorId,
    //             zoneId,
    //             request: {
    //                 canDeliverTo: editData.canDeliverTo,
    //                 customDeliveryFee: editData.customDeliveryFee ? parseFloat(editData.customDeliveryFee) : undefined,
    //                 customDeliveryTime: editData.customDeliveryTime || undefined
    //             }
    //         });

    //         setEditingZone(null);
    //         refetch();
    //     } catch (error) {
    //         console.error('Failed to update zone assignment:', error);
    //     }
    // };

    const handleCancelEdit = () => {
        setEditingZone(null);
        setEditData({
            canDeliverTo: true,
            customDeliveryFee: '',
            customDeliveryTime: ''
        });
    };

    const formatDeliveryTime = (timeString?: string) => {
        if (!timeString) return 'Default';

        // Handle TimeSpan format "HH:mm:ss"
        const parts = timeString.split(':');
        if (parts.length >= 2) {
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);

            if (hours === 0) {
                return `${minutes} min`;
            } else if (minutes === 0) {
                return `${hours}h`;
            } else {
                return `${hours}h ${minutes}m`;
            }
        }

        return timeString;
    };

    if (zonesLoading || availableZonesLoading) {
        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div className="w-full max-w-2xl">
                                <LoadingState
                                    title="Loading Zone Data"
                                    description="Fetching zone assignments and available zones..."
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    }

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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-border-light">
                                        <div className="flex items-center space-x-3">
                                            <MapPinIcon className="h-6 w-6 text-primary-500" />
                                            <Dialog.Title className="text-lg font-semibold text-text-primary">
                                                Zone Assignments
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-1 hover:bg-surface-100 rounded transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-tertiary" />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {/* Current Assignments */}
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-text-secondary mb-3">Current Zone Assignments</h3>
                                            {currentZones && currentZones.length > 0 ? (
                                                <div className="space-y-3">
                                                    {currentZones.map((zone) => (
                                                        <div
                                                            key={zone.id}
                                                            className="flex items-center justify-between p-4 bg-surface-50 rounded-button border"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3">
                                                                    <span className="font-medium text-text-primary">{zone.zoneName}</span>
                                                                    <div className={`h-2 w-2 rounded-full ${zone.isActive ? 'bg-success-500' : 'bg-danger-500'}`}></div>
                                                                    {zone.zoneDescription && (
                                                                        <span className="text-sm text-text-tertiary">
                                                                            {zone.zoneDescription}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {editingZone === zone.id ? (
                                                                    // Edit Mode
                                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`edit-deliver-${zone.id}`}
                                                                                checked={editData.canDeliverTo}
                                                                                onChange={(e) => setEditData(prev => ({ ...prev, canDeliverTo: e.target.checked }))}
                                                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                                            />
                                                                            <label htmlFor={`edit-deliver-${zone.id}`} className="ml-2 text-sm text-text-primary">
                                                                                Can deliver
                                                                            </label>
                                                                        </div>

                                                                        <div>
                                                                            <input
                                                                                type="number"
                                                                                step="0.01"
                                                                                min="0"
                                                                                placeholder="Custom fee"
                                                                                value={editData.customDeliveryFee}
                                                                                onChange={(e) => setEditData(prev => ({ ...prev, customDeliveryFee: e.target.value }))}
                                                                                className="w-full text-sm border border-border-default rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <input
                                                                                type="time"
                                                                                value={editData.customDeliveryTime}
                                                                                onChange={(e) => setEditData(prev => ({ ...prev, customDeliveryTime: e.target.value }))}
                                                                                className="w-full text-sm border border-border-default rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    // View Mode
                                                                    <div className="flex items-center space-x-6 mt-2 text-sm text-text-secondary">
                                                                        <span className={zone.canDeliverTo ? 'text-success-600' : 'text-danger-600'}>
                                                                            {zone.canDeliverTo ? '✓ Can deliver' : '✗ Cannot deliver'}
                                                                        </span>
                                                                        {zone.customDeliveryFee && (
                                                                            <span>Fee: ${zone.customDeliveryFee}</span>
                                                                        )}
                                                                        <span>Time: {formatDeliveryTime(zone.customDeliveryTime)}</span>
                                                                        <span className="text-text-tertiary">
                                                                            Assigned by {zone.assignedByName} on {new Date(zone.assignedAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                {editingZone === zone.id ? (
                                                                    <>
                                                                        <button
                                                                            // onClick={() => handleSaveEdit(zone.zoneId, zone.id)}
                                                                            className="p-1 text-success-600 hover:text-success-700 hover:bg-success-50 rounded transition-colors"
                                                                            title="Save changes"
                                                                        >
                                                                            <CheckIcon className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
                                                                            title="Cancel edit"
                                                                        >
                                                                            <XCircleIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* <button
                                                                        // onClick={() => handleEditZone(zone)}
                                                                        className="p-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                                                                        title="Edit zone assignment"
                                                                    >
                                                                        <PencilIcon className="h-4 w-4" />
                                                                    </button> */}
                                                                        <button
                                                                            onClick={() => handleRemoveZoneClick(zone.zoneId, zone.zoneName)}
                                                                            className="p-1 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
                                                                            title="Remove zone assignment"
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-text-tertiary">
                                                    <MapPinIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                    <p className="text-lg font-medium">No zones assigned</p>
                                                    <p className="text-sm mt-1">Assign zones to enable delivery services</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Add New Assignment */}
                                        {unassignedZones.length > 0 && (
                                            <div className="border-t border-border-light pt-6">
                                                <form onSubmit={handleSubmit}>
                                                    <h3 className="text-sm font-medium text-text-secondary mb-4">Assign New Zone</h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        {/* Zone Selection */}
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                                Select Zone <span className="text-danger-500">*</span>
                                                            </label>
                                                            <select
                                                                value={selectedZoneId}
                                                                onChange={(e) => setSelectedZoneId(e.target.value)}
                                                                required
                                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                            >
                                                                <option value="">Choose a zone...</option>
                                                                {unassignedZones.map((zone) => (
                                                                    <option key={zone.id} value={zone.id}>
                                                                        {zone.zoneName} {zone.description && `- ${zone.description}`}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Custom Delivery Fee */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                                Custom Delivery Fee (Optional)
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">₦</span>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    value={customDeliveryFee}
                                                                    onChange={(e) => setCustomDeliveryFee(e.target.value)}
                                                                    placeholder="0.00"
                                                                    className="w-full border border-border-default rounded-input pl-8 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-text-tertiary mt-1">
                                                                Override default zone delivery fee
                                                            </p>
                                                        </div>

                                                        {/* Custom Delivery Time */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                                Custom Delivery Time (Optional)
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={customDeliveryTime}
                                                                onChange={(e) => setCustomDeliveryTime(e.target.value)}
                                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                            />
                                                            <p className="text-xs text-text-tertiary mt-1">
                                                                Override default zone delivery time
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Can Deliver To */}
                                                    <div className="flex items-center mb-6">
                                                        <input
                                                            type="checkbox"
                                                            id="canDeliverTo"
                                                            checked={canDeliverTo}
                                                            onChange={(e) => setCanDeliverTo(e.target.checked)}
                                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                        />
                                                        <label htmlFor="canDeliverTo" className="ml-2 text-sm text-text-primary">
                                                            Vendor can deliver to this zone
                                                        </label>
                                                    </div>

                                                    {/* Submit Button */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            disabled={!selectedZoneId || isSubmitting}
                                                            className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-button hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isSubmitting ? (
                                                                <Spinner size="sm" color="white" />
                                                            ) : (
                                                                <PlusIcon className="h-4 w-4" />
                                                            )}
                                                            <span>{isSubmitting ? 'Assigning...' : 'Assign Zone'}</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        {unassignedZones.length === 0 && currentZones && currentZones.length > 0 && (
                                            <div className="text-center py-6 border-t border-border-light">
                                                <p className="text-sm text-text-tertiary">All available zones have been assigned</p>
                                            </div>
                                        )}

                                        {(!availableZones || availableZones.length === 0) && (
                                            <div className="text-center py-6 border-t border-border-light">
                                                <p className="text-sm text-text-tertiary">No delivery zones are currently available</p>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={handleCancelRemove}
                onConfirm={handleConfirmRemove}
                title="Remove Zone Assignment"
                message={`Are you sure you want to remove the zone assignment for "${confirmDialog.zoneName}"? This action cannot be undone.`}
                confirmText="Remove"
                variant="danger"
                isLoading={confirmDialog.isRemoving}
            />
        </>
    );
}