'use client';
import { 
  XMarkIcon, 
  PhoneIcon, 
  UserIcon, 
  StarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Bike } from 'lucide-react';
import { RiderSummary } from '@/app/data/types/rider';
import CopyButton from '@/app/components/ui/CopyButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rider: RiderSummary | null;
}

export default function RiderDetailsModal({ isOpen, onClose, rider }: Props) {
  if (!rider) return null;

  const getStatusBadge = (statusText: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'PendingVerification': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'Available': { color: 'bg-green-100 text-green-800', label: 'Available' },
      'Busy': { color: 'bg-orange-100 text-orange-800', label: 'Busy' },
      'Offline': { color: 'bg-gray-100 text-gray-800', label: 'Offline' },
      'OnBreak': { color: 'bg-blue-100 text-blue-800', label: 'On Break' },
      'Suspended': { color: 'bg-red-100 text-red-800', label: 'Suspended' }
    };

    const config = statusConfig[statusText] || statusConfig['Offline'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getOnlineStatus = (isOnline: boolean) => {
    return (
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Rider Details - {rider.fullName}
                </h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Rider Info */}
                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Rider Profile
                      </h3>
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-primary-700">
                            {rider.fullName ? rider.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'N/A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-900">{rider.fullName}</div>
                          <div className="flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-sm text-gray-600">{rider.phoneNumber}</span>
                            <CopyButton text={rider.phoneNumber} className="ml-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span>{getStatusBadge(rider.statusText)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Online Status:</span>
                          <span>{getOnlineStatus(rider.isOnline)}</span>
                        </div>
                        {rider.vehicleType && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle:</span>
                            <span className="flex items-center">
                              <Bike className="h-4 w-4 mr-1" />
                              {rider.vehicleType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Performance Section */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <StarIcon className="h-4 w-4 mr-2" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <span className="text-lg font-semibold mr-1">{rider.rating.toFixed(1)}</span>
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Acceptance Rate:</span>
                          <span className="font-medium">{rider.acceptanceRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed Deliveries:</span>
                          <span className="font-medium">{rider.completedDeliveries.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Assignments:</span>
                          <span className="font-medium">{rider.activeAssignments}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Activity */}
                  <div className="space-y-6">
                    {/* Location Section */}
                    {(rider.currentLatitude && rider.currentLongitude) && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Current Location
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Latitude:</span>
                            <span className="font-mono">{rider.currentLatitude.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Longitude:</span>
                            <span className="font-mono">{rider.currentLongitude.toFixed(6)}</span>
                          </div>
                          {rider.lastLocationUpdate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Update:</span>
                              <span className="text-xs">
                                {new Date(rider.lastLocationUpdate).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Map Preview */}
                        <div className="mt-3 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                            <div className="text-sm">Map Preview</div>
                            <div className="text-xs">Lat: {rider.currentLatitude.toFixed(4)}, Lng: {rider.currentLongitude.toFixed(4)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activity Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Activity Summary
                      </h3>
                      <div className="space-y-3">
                        {rider.completedDeliveries > 0 && (
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-primary-600">
                              {rider.completedDeliveries}
                            </div>
                            <div className="text-xs text-gray-500">Total Deliveries</div>
                          </div>
                        )}
                        
                        {rider.rating > 0 && (
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-yellow-500">
                              {rider.rating.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">Average Rating</div>
                          </div>
                        )}

                        {rider.acceptanceRate > 0 && (
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-500">
                              {rider.acceptanceRate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-500">Acceptance Rate</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Info */}
                    {rider.lastLocationUpdate && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Last Activity</h3>
                        <div className="text-sm text-gray-600">
                          Last seen: <span className="font-medium">
                            {new Date(rider.lastLocationUpdate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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