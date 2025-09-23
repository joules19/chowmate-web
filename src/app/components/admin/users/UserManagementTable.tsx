"use client";

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CheckBadgeIcon,
  XMarkIcon,
  EyeIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';
import { userService } from '@/app/lib/api/services/user-service';
import { UserSummaryDto, GetAllUsersRequest } from '@/app/data/types/vendor';
import { PaginatedResponse } from '@/app/data/types/api';

interface Props {
  filters: GetAllUsersRequest;
  onFiltersChange: (filters: GetAllUsersRequest) => void;
  onUserSelect?: (user: UserSummaryDto) => void;
}

export default function UserManagementTable({ filters, onFiltersChange, onUserSelect }: Props) {
  const [users, setUsers] = useState<PaginatedResponse<UserSummaryDto> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await userService.getAllUsers(filters);
      setUsers(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, pageNumber: page });
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
        return 'text-green-600';
      case 'suspended':
      case 'rejected':
        return 'text-red-600';
      case 'pending':
      case 'pendingapproval':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-0 rounded-card border border-border-light">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-0 rounded-card border border-border-light p-6">
        <div className="text-center">
          <p className="text-danger-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-primary-500 text-white rounded-button hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 rounded-card border border-border-light">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            All Users ({users?.totalCount || 0})
          </h3>
          <button
            onClick={fetchUsers}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-100 rounded-button"
          >
            <ArrowPathRoundedSquareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Role & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {users?.items?.map((user) => (
              <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-text-primary">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-text-tertiary">
                        {user.businessName || `Member since ${user.memberSince}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <div className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-text-primary">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-text-tertiary" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-text-primary">
                      <PhoneIcon className="h-4 w-4 mr-2 text-text-tertiary" />
                      {user.phoneNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-text-primary">
                      {user.lastActivity}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {user.totalOrders ? `${user.totalOrders} orders` : 'No orders'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {user.isEmailVerified ? (
                      <CheckBadgeIcon className="h-4 w-4 text-success-600" title="Email verified" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 text-danger-600" title="Email not verified" />
                    )}
                    {user.isPhoneVerified ? (
                      <CheckBadgeIcon className="h-4 w-4 text-success-600" title="Phone verified" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 text-danger-600" title="Phone not verified" />
                    )}
                  </div>
                  {(user.hasActiveOrders || user.hasActiveDeliveries) && (
                    <div className="text-xs text-warning-600 mt-1">
                      Has active {user.hasActiveOrders ? 'orders' : 'deliveries'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onUserSelect?.(user)}
                    className="inline-flex items-center px-3 py-1 border border-border-light rounded-button text-sm text-text-primary hover:bg-surface-100 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users && users.totalCount > users.pageSize && (
        <div className="px-6 py-4 border-t border-border-light">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-tertiary">
              Showing {((users.pageNumber - 1) * users.pageSize) + 1} to{' '}
              {Math.min(users.pageNumber * users.pageSize, users.totalCount)} of{' '}
              {users.totalCount} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(users.pageNumber - 1)}
                disabled={users.pageNumber <= 1}
                className="px-3 py-1 border border-border-light rounded-button text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-100"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {users.pageNumber} of {Math.ceil(users.totalCount / users.pageSize)}
              </span>
              <button
                onClick={() => handlePageChange(users.pageNumber + 1)}
                disabled={users.pageNumber >= Math.ceil(users.totalCount / users.pageSize)}
                className="px-3 py-1 border border-border-light rounded-button text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {users && users.items.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 mx-auto text-text-tertiary opacity-50 mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No users found</h3>
          <p className="text-text-tertiary">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      )}
    </div>
  );
}