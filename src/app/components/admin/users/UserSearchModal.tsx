"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
    XMarkIcon,
    MagnifyingGlassIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { UserForRoleSwitch } from '@/app/data/types/vendor';
import { userService } from '@/app/lib/api/services/user-service';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (user: UserForRoleSwitch) => void;
}

export default function UserSearchModal({ isOpen, onClose, onUserSelect }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserForRoleSwitch[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleSearch = async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const results = await userService.searchUsers(query);
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleUserSelect = (user: UserForRoleSwitch) => {
        onUserSelect(user);
        onClose();
        setSearchQuery('');
        setSearchResults([]);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Customer':
                return 'bg-blue-100 text-blue-700';
            case 'Vendor':
                return 'bg-green-100 text-green-700';
            case 'Rider':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-border-light">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-text-primary flex items-center">
                                            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                            Search Users
                                        </h2>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-surface-100 rounded-full transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-primary" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-4">
                                    {/* Search Input */}
                                    <div className="relative mb-4">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, email, or phone number..."
                                            className="w-full pl-10 pr-4 py-3 border border-border-light rounded-button bg-surface-0 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Search Results */}
                                    <div className="max-h-96 overflow-y-auto">
                                        {isLoading && (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                                                <span className="ml-2 text-text-secondary">Searching...</span>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="p-4 bg-danger-50 border border-danger-200 rounded-card">
                                                <p className="text-sm text-danger-800">{error}</p>
                                            </div>
                                        )}

                                        {!isLoading && !error && searchQuery && searchQuery.length >= 2 && searchResults.length === 0 && (
                                            <div className="text-center py-8 text-text-tertiary">
                                                <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p>No users found matching "{searchQuery}"</p>
                                                <p className="text-sm mt-1">Try searching by name, email, or phone number</p>
                                            </div>
                                        )}

                                        {!isLoading && !error && searchResults.length > 0 && (
                                            <div className="space-y-2">
                                                {searchResults.map((user) => (
                                                    <button
                                                        key={user.userId}
                                                        onClick={() => handleUserSelect(user)}
                                                        className="w-full p-4 bg-surface-50 hover:bg-surface-100 rounded-card text-left transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                                        <UserIcon className="h-5 w-5 text-primary-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium text-text-primary">{user.name}</h3>
                                                                        <p className="text-sm text-text-secondary">{user.email}</p>
                                                                        <p className="text-sm text-text-tertiary">{user.phone}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end space-y-1">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.currentRole)}`}>
                                                                    {user.currentRole}
                                                                </span>
                                                                <span className="text-xs text-text-tertiary">
                                                                    {user.status}
                                                                </span>
                                                                {(user.hasActiveOrders || user.hasActiveDeliveries) && (
                                                                    <span className="text-xs text-warning-600 font-medium">
                                                                        Has active {user.hasActiveOrders ? 'orders' : 'deliveries'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {(!searchQuery || searchQuery.length < 2) && (
                                            <div className="text-center py-8 text-text-tertiary">
                                                <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                <p>Type at least 2 characters to search for users...</p>
                                                <p className="text-sm mt-1">Search by name, email, or phone number</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-border-light bg-surface-50">
                                    <p className="text-sm text-text-tertiary">
                                        Select a user to switch their role. Users with active orders or deliveries cannot have their roles changed.
                                    </p>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}