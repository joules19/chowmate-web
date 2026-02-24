"use client";

import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    GiftIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import { message } from 'antd';
import { useGrantDeliveryCredits } from '@/app/lib/hooks/api-hooks.ts/use-customer';
import { userService } from '@/app/lib/api/services/user-service';
import { UserSummaryDto } from '@/app/data/types/vendor';

interface BulkDeliveryCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkDeliveryCreditsModal({ isOpen, onClose }: BulkDeliveryCreditsModalProps) {
    const [sendToAll, setSendToAll] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<UserSummaryDto[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserSummaryDto[]>([]);
    const [credits, setCredits] = useState('');
    const [expiryDays, setExpiryDays] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const grantMutation = useGrantDeliveryCredits();

    useEffect(() => {
        if (!search.trim()) {
            setSearchResults([]);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await userService.getAllUsers({
                    search: search.trim(),
                    role: 'Customer',
                    pageSize: 10,
                });
                setSearchResults(response.items);
            } catch {
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);
    }, [search]);

    const addUser = (user: UserSummaryDto) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearch('');
        setSearchResults([]);
    };

    const removeUser = (id: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleClose = () => {
        setSendToAll(false);
        setSearch('');
        setSearchResults([]);
        setSelectedUsers([]);
        setCredits('');
        setExpiryDays('');
        setReason('');
        setError('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!sendToAll && selectedUsers.length === 0) {
            setError('Add at least one customer to the list.');
            return;
        }
        const creditsNum = parseInt(credits, 10);
        if (!credits || isNaN(creditsNum) || creditsNum < 1 || creditsNum > 1000) {
            setError('Credits must be a number between 1 and 1000.');
            return;
        }
        const expiryNum = expiryDays ? parseInt(expiryDays, 10) : undefined;
        if (expiryDays && (isNaN(expiryNum!) || expiryNum! < 1 || expiryNum! > 365)) {
            setError('Expiry days must be between 1 and 365.');
            return;
        }
        setError('');
        try {
            const result = await grantMutation.mutateAsync({
                sendToAll: sendToAll || undefined,
                userIds: sendToAll ? undefined : selectedUsers.map(u => u.id),
                credits: creditsNum,
                reason: reason.trim() || undefined,
                expiryDays: expiryNum,
            });
            if (sendToAll) {
                message.success(`Delivery credits granted to all ${result.successful} customer${result.successful !== 1 ? 's' : ''} successfully.`);
            } else {
                const failMsg = result.failed > 0 ? ` (${result.failed} failed)` : '';
                message.success(`Delivery credits granted to ${result.successful} customer${result.successful !== 1 ? 's' : ''}${failMsg}.`);
            }
            handleClose();
        } catch {
            message.error('Failed to grant delivery credits. Please try again.');
            setError('Failed to grant delivery credits. Please try again.');
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
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
                            <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary-50 rounded-lg">
                                            <GiftIcon className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            Bulk Grant Delivery Credits
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500 p-1 rounded transition-colors"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Send to All toggle */}
                                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-amber-900">Send to all customers</p>
                                            <p className="text-xs text-amber-700 mt-0.5">Ignores the recipient list and grants to every customer</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSendToAll(v => !v)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                sendToAll ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                                                    sendToAll ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Search + recipients — hidden when sendToAll */}
                                    {!sendToAll && (
                                        <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Search Customers
                                            </label>
                                            <div className="relative">
                                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={e => setSearch(e.target.value)}
                                                    placeholder="Search by name or email..."
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                                />
                                            </div>

                                            {/* Dropdown results */}
                                            {(searching || searchResults.length > 0) && (
                                                <div className="mt-1 border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-y-auto bg-white">
                                                    {searching ? (
                                                        <div className="px-3 py-3 text-sm text-gray-500">Searching...</div>
                                                    ) : searchResults.length === 0 ? (
                                                        <div className="px-3 py-3 text-sm text-gray-500">No customers found.</div>
                                                    ) : (
                                                        searchResults.map(user => {
                                                            const alreadyAdded = !!selectedUsers.find(u => u.id === user.id);
                                                            return (
                                                                <button
                                                                    key={user.id}
                                                                    onClick={() => addUser(user)}
                                                                    disabled={alreadyAdded}
                                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                                                                >
                                                                    <div>
                                                                        <div className="font-medium text-gray-900">{user.fullName}</div>
                                                                        <div className="text-gray-500 text-xs">{user.email}</div>
                                                                    </div>
                                                                    {alreadyAdded ? (
                                                                        <span className="text-xs text-gray-400">Added</span>
                                                                    ) : (
                                                                        <PlusIcon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                                                    )}
                                                                </button>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected recipients */}
                                        {selectedUsers.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Recipients ({selectedUsers.length})
                                                </p>
                                                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                                                    {selectedUsers.map(user => (
                                                        <span
                                                            key={user.id}
                                                            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                                                        >
                                                            {user.fullName}
                                                            <button
                                                                onClick={() => removeUser(user.id)}
                                                                className="hover:text-primary-900 ml-0.5"
                                                            >
                                                                <XMarkIcon className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        </>
                                    )}

                                    {/* Credits fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Credits <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={1000}
                                                value={credits}
                                                onChange={e => setCredits(e.target.value)}
                                                placeholder="e.g. 3"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Expiry Days <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={365}
                                                value={expiryDays}
                                                onChange={e => setExpiryDays(e.target.value)}
                                                placeholder="e.g. 30"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reason <span className="text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            placeholder="e.g. Holiday promotion"
                                            rows={2}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {error && <p className="text-sm text-red-600">{error}</p>}
                                </div>

                                <div className="flex items-center justify-end space-x-3 mt-6">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={grantMutation.isPending || (!sendToAll && selectedUsers.length === 0)}
                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {grantMutation.isPending
                                            ? 'Granting...'
                                            : sendToAll
                                                ? 'Grant to All Customers'
                                                : `Grant to ${selectedUsers.length} customer${selectedUsers.length !== 1 ? 's' : ''}`}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
