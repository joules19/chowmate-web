"use client";

import { useState } from "react";
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon, 
  PauseIcon, 
  PlayIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ArrowUturnLeftIcon
} from "@heroicons/react/24/outline";
import DataTable, { Column } from "../shared/DataTable";
import { SearchFilters } from "../../../data/types/api";
import { RiderSummary } from "@/app/data/types/rider";
import { useRiders, useApproveRider, useRejectRider, useSuspendRider, useActivateRider, useSendRiderBackToPending } from "@/app/lib/hooks/api-hooks.ts/use-rider";
import { RiderFilters, ApproveRiderRequest, SuspendRiderRequest } from "@/app/lib/api/repositories/rider-repository";
import RiderDetailsModal from "./RiderDetailsModal";
import ConfirmDialog from "../../ui/ConfirmDialog";
import RiderZoneAssignmentModal from "./RiderZoneAssignmentModal";
import RiderApproveModal from "./RiderApproveModal";
import RiderRejectModal from "./RiderRejectModal";
import RiderSendBackToPendingModal from "./RiderSendBackToPendingModal";

interface Props {
  filters: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
}

export default function RiderManagementTable({ filters }: Props) {
  const [selectedRider, setSelectedRider] = useState<RiderSummary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [riderForZoneAssignment, setRiderForZoneAssignment] = useState<RiderSummary | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSendBackModal, setShowSendBackModal] = useState(false);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'suspend' | 'activate' | 'reject';
    rider: RiderSummary | null;
    reason?: string;
  }>({
    isOpen: false,
    type: 'approve',
    rider: null
  });
  const [suspendReason, setSuspendReason] = useState('');
  const [notifyRider, setNotifyRider] = useState(true);
  const [suspensionEndDate, setSuspensionEndDate] = useState('');

  // Convert SearchFilters to RiderFilters
  const riderFilters: RiderFilters = {
    pageNumber: filters.page || 1,
    pageSize: filters.limit || 10,
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status as any })
  };

  const { data: ridersResponse, isLoading, error } = useRiders(riderFilters);
  
  // Mutation hooks
  const approveRiderMutation = useApproveRider();
  const rejectRiderMutation = useRejectRider();
  const suspendRiderMutation = useSuspendRider();
  const activateRiderMutation = useActivateRider();
  const sendBackToPendingMutation = useSendRiderBackToPending();

  const handleViewRider = (rider: RiderSummary) => {
    setSelectedRider(rider);
    setShowDetailsModal(true);
  };


  const handleSuspendRider = (rider: RiderSummary) => {
    setSuspendReason('Suspended by admin for review');
    setConfirmDialog({
      isOpen: true,
      type: 'suspend',
      rider
    });
  };

  const handleActivateRider = (rider: RiderSummary) => {
    setConfirmDialog({
      isOpen: true,
      type: 'activate',
      rider
    });
  };

  const handleZoneAssignment = (rider: RiderSummary) => {
    setRiderForZoneAssignment(rider);
    setShowZoneModal(true);
  };

  const handleRejectRider = (rider: RiderSummary) => {
    setSelectedRider(rider);
    setShowRejectModal(true);
  };

  const handleSendBackToPending = (rider: RiderSummary) => {
    setSelectedRider(rider);
    setShowSendBackModal(true);
  };

  const handleConfirmApprove = async (data: { zoneIds: string[]; notes: string; notifyRider: boolean }) => {
    if (!selectedRider) return;
    
    try {
      // TODO: Update this to include zone assignment once the API is ready
      const approveRequest: ApproveRiderRequest = {
        notes: data.notes,
        notifyRider: data.notifyRider
        // zoneIds: data.zoneIds // Add this when backend supports it
      };
      
      await approveRiderMutation.mutateAsync({ 
        id: selectedRider.id, 
        request: approveRequest
      });
      
      // TODO: Assign zones separately if needed
      console.log('Zone assignment needed:', data.zoneIds);
      
    } catch (error) {
      console.error('Failed to approve rider:', error);
    } finally {
      setShowApproveModal(false);
      setSelectedRider(null);
    }
  };

  const handleConfirmReject = async (data: { reason: string; notifyRider: boolean }) => {
    if (!selectedRider) return;
    
    try {
      await rejectRiderMutation.mutateAsync({
        id: selectedRider.id,
        reason: data.reason
      });
    } catch (error) {
      console.error('Failed to reject rider:', error);
    } finally {
      setShowRejectModal(false);
      setSelectedRider(null);
    }
  };

  const handleConfirmSendBackToPending = async (message: string) => {
    if (!selectedRider) return;
    
    try {
      await sendBackToPendingMutation.mutateAsync({
        riderId: selectedRider.id,
        message: message
      });
    } catch (error) {
      console.error('Failed to send rider back to pending:', error);
    } finally {
      setShowSendBackModal(false);
      setSelectedRider(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.rider) return;

    try {
      switch (confirmDialog.type) {
        case 'approve':
          const approveRequest: ApproveRiderRequest = {
            notes: `Approved by admin on ${new Date().toLocaleDateString()}`,
            notifyRider: notifyRider
          };
          await approveRiderMutation.mutateAsync({ 
            id: confirmDialog.rider.id, 
            request: approveRequest
          });
          break;
        case 'suspend':
          if (!suspendReason.trim()) return;
          const suspendRequest: SuspendRiderRequest = {
            reason: suspendReason.trim(),
            notifyRider: notifyRider,
            ...(suspensionEndDate && { suspensionEndDate: suspensionEndDate })
          };
          await suspendRiderMutation.mutateAsync({ 
            id: confirmDialog.rider.id, 
            request: suspendRequest
          });
          break;
        case 'activate':
          await activateRiderMutation.mutateAsync(confirmDialog.rider.id);
          break;
      }
      
      // Close dialog on success
      setConfirmDialog({ isOpen: false, type: 'approve', rider: null });
      setSuspendReason('');
    } catch (error) {
      console.error(`${confirmDialog.type} rider error:`, error);
      // Keep dialog open on error so user can retry
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: 'approve', rider: null });
    setSuspendReason('');
    setNotifyRider(true);
    setSuspensionEndDate('');
  };

  const getStatusBadge = (status: number | string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'PendingVerification': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'UnderReview': { color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
      'Available': { color: 'bg-green-100 text-green-800', label: 'Available' },
      'Busy': { color: 'bg-orange-100 text-orange-800', label: 'Busy' },
      'Offline': { color: 'bg-gray-100 text-gray-800', label: 'Offline' },
      'OnBreak': { color: 'bg-blue-100 text-blue-800', label: 'On Break' },
      'Suspended': { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      'Rejected': { color: 'bg-gray-100 text-gray-800', label: 'Rejected' }
    };

    const config = statusConfig[status as string] || statusConfig['Offline'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<RiderSummary>[] = [
    {
      key: 'firstName',
      label: 'Rider',
      sortable: true,
      render: (rider) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {rider.fullName ? rider.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'N/A'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-text-primary">
              {rider.fullName || 'N/A'}
            </div>
            <div className="text-sm text-text-tertiary">
              {rider.phoneNumber}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      render: (rider) => rider.vehicleType || 'Not specified'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (rider) => getStatusBadge(rider.statusText)
    },
    {
      key: 'isOnline',
      label: 'Online Status',
      render: (rider) => (
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${rider.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm">{rider.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (rider) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{rider.rating.toFixed(1)}</span>
          <span className="text-yellow-400 ml-1">★</span>
        </div>
      )
    },
    {
      key: 'completedDeliveries',
      label: 'Deliveries',
      sortable: true,
      render: (rider) => rider.completedDeliveries.toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (rider) => (
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewRider(rider);
            }}
            className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4" />
          </button>

          {rider.statusText === 'UnderReview' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRider(rider);
                  setShowApproveModal(true);
                }}
                disabled={approveRiderMutation.isPending}
                className="text-success-600 hover:text-success-700 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Approve Rider"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectRider(rider);
                }}
                className="text-danger-600 hover:text-danger-700 p-1 rounded transition-colors"
                title="Reject Rider"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendBackToPending(rider);
                }}
                className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
                title="Send Back to Pending"
              >
                <ArrowUturnLeftIcon className="h-4 w-4" />
              </button>
            </>
          )}

          {(rider.statusText === 'Rejected') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendBackToPending(rider);
              }}
              className="text-orange-600 hover:text-orange-700 p-1 rounded transition-colors"
              title="Send Back to Pending"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
          )}

          {(rider.statusText === 'Available' || rider.statusText === 'Offline') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSuspendRider(rider);
              }}
              disabled={suspendRiderMutation.isPending}
              className="text-danger-600 hover:text-danger-700 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={suspendRiderMutation.isPending ? "Suspending..." : "Suspend Rider"}
            >
              {suspendRiderMutation.isPending ? (
                <div className="animate-spin h-4 w-4 border-2 border-danger-600 border-t-transparent rounded-full" />
              ) : (
                <PauseIcon className="h-4 w-4" />
              )}
            </button>
          )}

          {rider.statusText === 'Suspended' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleActivateRider(rider);
              }}
              disabled={activateRiderMutation.isPending}
              className="text-success-600 hover:text-success-700 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={activateRiderMutation.isPending ? "Activating..." : "Activate Rider"}
            >
              {activateRiderMutation.isPending ? (
                <div className="animate-spin h-4 w-4 border-2 border-success-600 border-t-transparent rounded-full" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Zone Assignment button - always show */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoneAssignment(rider);
            }}
            className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
            title="Manage Zones"
          >
            <MapPinIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-surface-100 rounded mb-4 w-40"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="h-16 bg-surface-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light p-6">
        <div className="text-center">
          <div className="bg-danger-50 rounded-full p-3 inline-flex">
            <svg className="h-6 w-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-text-primary">Failed to load riders</h3>
          <p className="mt-1 text-sm text-text-secondary">Unable to fetch rider data. Please try again.</p>
        </div>
      </div>
    );
  }

  const riders = ridersResponse?.items || [];
  const pagination = ridersResponse ? {
    pageNumber: ridersResponse.pageNumber,
    pageSize: ridersResponse.pageSize,
    totalCount: ridersResponse.totalCount
  } : undefined;

  return (
    <>
      <DataTable<RiderSummary>
        data={riders}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onRowClick={handleViewRider}
      />

      <RiderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRider(null);
        }}
        rider={selectedRider}
      />

      {riderForZoneAssignment && (
        <RiderZoneAssignmentModal
          riderId={riderForZoneAssignment.id}
          isOpen={showZoneModal}
          onClose={() => {
            setShowZoneModal(false);
            setRiderForZoneAssignment(null);
          }}
        />
      )}

      <RiderApproveModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedRider(null);
        }}
        onConfirm={handleConfirmApprove}
        rider={selectedRider}
        isLoading={approveRiderMutation.isPending}
      />

      <RiderRejectModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedRider(null);
        }}
        onConfirm={handleConfirmReject}
        rider={selectedRider}
        isLoading={rejectRiderMutation.isPending}
      />

      <RiderSendBackToPendingModal
        isOpen={showSendBackModal}
        onClose={() => {
          setShowSendBackModal(false);
          setSelectedRider(null);
        }}
        onConfirm={handleConfirmSendBackToPending}
        rider={selectedRider}
        isLoading={sendBackToPendingMutation.isPending}
      />

      {/* Confirmation Dialogs */}
      {confirmDialog.isOpen && confirmDialog.type === 'approve' && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeConfirmDialog} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-surface-0 rounded-card text-left overflow-hidden shadow-soft-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-surface-0 px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-text-primary" id="modal-title">
                      Approve Rider
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-text-secondary">
                        Are you sure you want to approve <strong>{confirmDialog.rider?.fullName}</strong>? This will allow them to start accepting delivery requests.
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <input
                            id="notify-rider-approve"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                            checked={notifyRider}
                            onChange={(e) => setNotifyRider(e.target.checked)}
                          />
                          <label htmlFor="notify-rider-approve" className="ml-2 block text-sm text-text-secondary">
                            Notify rider via email/SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-button border border-transparent shadow-soft px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmAction}
                  disabled={approveRiderMutation.isPending}
                >
                  {approveRiderMutation.isPending ? 'Approving...' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-button border border-border-default shadow-soft px-4 py-2 bg-surface-0 text-base font-medium text-text-secondary hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeConfirmDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && confirmDialog.type === 'activate' && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={handleConfirmAction}
          title="Activate Rider"
          message={`Are you sure you want to activate ${confirmDialog.rider?.fullName}? This will allow them to start receiving delivery assignments again.`}
          confirmText="Activate"
          variant="success"
          isLoading={activateRiderMutation.isPending}
        />
      )}

      {confirmDialog.isOpen && confirmDialog.type === 'suspend' && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeConfirmDialog} />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="relative inline-block align-bottom bg-surface-0 rounded-card text-left overflow-hidden shadow-soft-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-surface-0 px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-text-primary" id="modal-title">
                      Suspend Rider
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-text-secondary">
                        Are you sure you want to suspend <strong>{confirmDialog.rider?.fullName}</strong>? This will prevent them from accepting new orders.
                      </p>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="suspend-reason" className="block text-sm font-medium text-text-secondary mb-2">
                            Reason for suspension: <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="suspend-reason"
                            rows={3}
                            className="block w-full px-3 py-2 border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            placeholder="Enter reason for suspension..."
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="suspension-end-date" className="block text-sm font-medium text-text-secondary mb-2">
                            Suspension end date (optional):
                          </label>
                          <input
                            type="date"
                            id="suspension-end-date"
                            className="block w-full px-3 py-2 border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={suspensionEndDate}
                            onChange={(e) => setSuspensionEndDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} // Today or later
                          />
                          <p className="text-xs text-text-tertiary mt-1">
                            Leave empty for indefinite suspension
                          </p>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="notify-rider"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                            checked={notifyRider}
                            onChange={(e) => setNotifyRider(e.target.checked)}
                          />
                          <label htmlFor="notify-rider" className="ml-2 block text-sm text-text-secondary">
                            Notify rider via email/SMS
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-button border border-transparent shadow-soft px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmAction}
                  disabled={!suspendReason.trim() || suspendRiderMutation.isPending}
                >
                  {suspendRiderMutation.isPending ? 'Suspending...' : 'Suspend'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-button border border-border-default shadow-soft px-4 py-2 bg-surface-0 text-base font-medium text-text-secondary hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeConfirmDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}