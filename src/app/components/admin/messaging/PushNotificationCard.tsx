"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import {
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UsersIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useSendPushNotification } from "@/app/lib/hooks/api-hooks.ts/use-messaging";
import { userService } from "@/app/lib/api/services/user-service";
import { UserSummaryDto } from "@/app/data/types/vendor";

export default function PushNotificationCard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserSummaryDto[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { mutate: sendNotification, isPending } = useSendPushNotification();

  const { data: usersData, isLoading: isSearching } = useQuery({
    queryKey: ["users", "search", debouncedSearch],
    queryFn: () => userService.getAllUsers({
      search: debouncedSearch,
      pageNumber: 1,
      pageSize: 10,
      role: "Customer",
    }),
    enabled: !!debouncedSearch && !sendToAll,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error("Please enter a notification title");
      return;
    }
    if (!body.trim()) {
      message.error("Please enter a notification message");
      return;
    }
    if (!sendToAll && selectedUsers.length === 0) {
      message.error("Please select at least one customer");
      return;
    }

    const phoneNumbers = sendToAll
      ? undefined
      : selectedUsers.map((u) => u.phoneNumber).filter(Boolean);

    sendNotification(
      {
        title: title.trim(),
        body: body.trim(),
        phoneNumbers,
      },
      {
        onSuccess: () => {
          message.success(
            sendToAll
              ? "Notification sent to all users"
              : `Notification sent to ${selectedUsers.length} user(s)`
          );
          setTitle("");
          setBody("");
          setSelectedUsers([]);
          setSearchQuery("");
        },
        onError: (error) => {
          console.error("Error sending notification:", error);
          message.error("Failed to send notification");
        },
      }
    );
  };

  const handleSelectUser = (user: UserSummaryDto) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const filteredResults = usersData?.items?.filter(
    (user) => !selectedUsers.find((u) => u.id === user.id)
  ) || [];

  return (
    <div className="bg-surface-0 rounded-card shadow-soft hover:shadow-soft-md border border-border-light transition-all duration-200">
      {/* Card Header */}
      <div className="p-6 border-b border-border-light">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-primary-50 rounded-soft">
            <DevicePhoneMobileIcon className="h-6 w-6 text-primary-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary">
              Push Notifications
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Send push notifications to all users or specific customers
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="notification-title"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Notification Title <span className="text-error-500">*</span>
          </label>
          <input
            id="notification-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title..."
            className="w-full px-4 py-2.5 border border-border-default rounded-button text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            maxLength={100}
          />
          <p className="text-xs text-text-tertiary mt-1">{title.length}/100 characters</p>
        </div>

        {/* Body Input */}
        <div>
          <label
            htmlFor="notification-body"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Message <span className="text-error-500">*</span>
          </label>
          <textarea
            id="notification-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message..."
            rows={4}
            className="w-full px-4 py-2.5 border border-border-default rounded-button text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-text-tertiary mt-1">{body.length}/500 characters</p>
        </div>

        {/* Target Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Send To
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSendToAll(true)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 transition-all duration-200 ${
                sendToAll
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-border-default bg-surface-0 text-text-secondary hover:border-border-medium"
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span className="font-medium">All Users</span>
            </button>
            <button
              type="button"
              onClick={() => setSendToAll(false)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 transition-all duration-200 ${
                !sendToAll
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-border-default bg-surface-0 text-text-secondary hover:border-border-medium"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              <span className="font-medium">Specific Users</span>
            </button>
          </div>
        </div>

        {/* Customer Search (only when not sending to all) */}
        {!sendToAll && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Customers
            </label>
            <div className="relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search by name or phone number..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-button text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && debouncedSearch && (
                <div className="absolute z-10 w-full mt-1 bg-surface-0 border border-border-default rounded-card shadow-soft-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-text-secondary">
                      <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="w-full px-4 py-3 text-left hover:bg-surface-100 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            {user.phoneNumber}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-text-secondary text-sm">
                      No customers found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-text-tertiary mb-2">
                  Selected ({selectedUsers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm"
                    >
                      {user.fullName}
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-0.5 hover:bg-primary-100 rounded-full transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-6 bg-surface-50 border-t border-border-light">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full px-4 py-3 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>Send Push Notification</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
