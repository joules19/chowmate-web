"use client";

import { useState } from 'react';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { UserForRoleSwitch, RoleSwitchResponse } from '@/app/data/types/vendor';
import UserSearchModal from './UserSearchModal';
import RoleSwitchModal from './RoleSwitchModal';

interface Props {
    onSuccess?: (result: RoleSwitchResponse) => void;
    onError?: (error: string) => void;
}

export default function UserRoleSwitcher({ onSuccess, onError }: Props) {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserForRoleSwitch | null>(null);

    const handleUserSelect = (user: UserForRoleSwitch) => {
        setSelectedUser(user);
        setIsRoleSwitchModalOpen(true);
    };

    const handleRoleSwitchSuccess = (result: RoleSwitchResponse) => {
        setSelectedUser(null);
        if (onSuccess) {
            onSuccess(result);
        }
    };

    const handleRoleSwitchClose = () => {
        setIsRoleSwitchModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsSearchModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-button transition-colors"
            >
                <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-2" />
                Switch User Role
            </button>

            {/* User Search Modal */}
            <UserSearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onUserSelect={handleUserSelect}
            />

            {/* Role Switch Modal */}
            {selectedUser && (
                <RoleSwitchModal
                    user={selectedUser}
                    isOpen={isRoleSwitchModalOpen}
                    onClose={handleRoleSwitchClose}
                    onSuccess={handleRoleSwitchSuccess}
                />
            )}
        </>
    );
}

// Export function for success/error handling
export const showRoleSwitchSuccess = (result: RoleSwitchResponse) => {
    // You can integrate with your notification system here
    console.log(`Successfully switched ${result.fromRole} to ${result.toRole}`);
};

export const showRoleSwitchError = (error: Error) => {
    // You can integrate with your notification system here
    if (error.message.includes('active orders')) {
        console.error('Cannot switch role: User has active orders that must be completed first');
    } else if (error.message.includes('active deliveries')) {
        console.error('Cannot switch role: Rider has active deliveries that must be completed first');
    } else {
        console.error('Role switch failed:', error.message);
    }
};