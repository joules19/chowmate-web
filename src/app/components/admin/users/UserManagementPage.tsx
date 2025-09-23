"use client";

import { useState } from 'react';
import UserRoleSwitcher, { showRoleSwitchSuccess, showRoleSwitchError } from './UserRoleSwitcher';
import { RoleSwitchResponse } from '@/app/data/types/vendor';

// Example integration page showing how to use the UserRoleSwitcher component
export default function UserManagementPage() {
    const [lastSwitchResult, setLastSwitchResult] = useState<RoleSwitchResponse | null>(null);

    const handleRoleSwitchSuccess = (result: RoleSwitchResponse) => {
        setLastSwitchResult(result);
        showRoleSwitchSuccess(result);
        
        // You can add additional logic here:
        // - Refresh user lists
        // - Show toast notifications
        // - Update activity logs
        // - Send analytics events
    };

    const handleRoleSwitchError = (error: string) => {
        showRoleSwitchError(new Error(error));
        
        // You can add additional error handling here:
        // - Show error notifications
        // - Log errors to monitoring services
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
                    <p className="text-text-secondary">Manage user roles and permissions</p>
                </div>
                
                {/* Role Switcher Component */}
                <UserRoleSwitcher
                    onSuccess={handleRoleSwitchSuccess}
                    onError={handleRoleSwitchError}
                />
            </div>

            {/* Show last switch result for demo */}
            {lastSwitchResult && (
                <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-card">
                    <h3 className="font-medium text-success-800 mb-2">Last Role Switch</h3>
                    <div className="text-sm text-success-700 space-y-1">
                        <p><strong>User ID:</strong> {lastSwitchResult.userId}</p>
                        <p><strong>Changed from:</strong> {lastSwitchResult.fromRole} → {lastSwitchResult.toRole}</p>
                        <p><strong>When:</strong> {new Date(lastSwitchResult.switchedAt).toLocaleString()}</p>
                        <p><strong>By:</strong> {lastSwitchResult.switchedBy}</p>
                        {lastSwitchResult.reason && (
                            <p><strong>Reason:</strong> {lastSwitchResult.reason}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Rest of your user management interface */}
            <div className="bg-surface-0 rounded-card border border-border-light p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">User Management Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-50 rounded-card">
                        <h3 className="font-medium text-text-primary">Role Switching</h3>
                        <p className="text-sm text-text-secondary mt-1">
                            Switch users between Customer, Vendor, and Rider roles with proper validation.
                        </p>
                    </div>
                    <div className="p-4 bg-surface-50 rounded-card">
                        <h3 className="font-medium text-text-primary">User Search</h3>
                        <p className="text-sm text-text-secondary mt-1">
                            Search users by name, email, or phone number to find the right user quickly.
                        </p>
                    </div>
                    <div className="p-4 bg-surface-50 rounded-card">
                        <h3 className="font-medium text-text-primary">Activity Logging</h3>
                        <p className="text-sm text-text-secondary mt-1">
                            All role switches are logged with full audit trail for compliance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}