"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import {
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UsersIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import {
  useBroadcastNotification,
  useSendToUserNotification,
} from "@/app/lib/hooks/api-hooks.ts/use-notifications";
import { userService } from "@/app/lib/api/services/user-service";
import { UserSummaryDto } from "@/app/data/types/vendor";

type Mode = "broadcast" | "targeted";

export default function InAppNotificationCard() {
  const [mode, setMode] = useState<Mode>("broadcast");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSummaryDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { mutate: broadcast, isPending: isBroadcasting } =
    useBroadcastNotification();
  const { mutate: sendToUser, isPending: isSending } =
    useSendToUserNotification();

  const isPending = isBroadcasting || isSending;

  const { data: usersData, isLoading: isSearching } = useQuery({
    queryKey: ["users", "search", debouncedSearch],
    queryFn: () =>
      userService.getAllUsers({
        search: debouncedSearch,
        pageNumber: 1,
        pageSize: 8,
        role: "Customer",
      }),
    enabled: !!debouncedSearch && mode === "targeted",
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const reset = () => {
    setTitle("");
    setBody("");
    setExpiresAt("");
    setSelectedUser(null);
    setSearchQuery("");
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error("Please enter a notification title");
      return;
    }
    if (!body.trim()) {
      message.error("Please enter a notification message");
      return;
    }
    if (mode === "targeted" && !selectedUser) {
      message.error("Please select a customer");
      return;
    }

    const expiresAtIso = expiresAt ? new Date(expiresAt).toISOString() : undefined;

    if (mode === "broadcast") {
      broadcast(
        { title: title.trim(), body: body.trim(), expiresAt: expiresAtIso },
        {
          onSuccess: () => {
            message.success("Notification sent to all customers");
            reset();
          },
          onError: () => message.error("Failed to send notification"),
        }
      );
    } else {
      sendToUser(
        {
          userId: selectedUser!.id,
          title: title.trim(),
          body: body.trim(),
          expiresAt: expiresAtIso,
        },
        {
          onSuccess: () => {
            message.success(`Notification sent to ${selectedUser!.fullName}`);
            reset();
          },
          onError: () => message.error("Failed to send notification"),
        }
      );
    }
  };

  const filteredResults =
    usersData?.items?.filter((u) => u.id !== selectedUser?.id) ?? [];

  return (
    <div className="bg-surface-0 rounded-card shadow-soft hover:shadow-soft-md border border-border-light transition-all duration-200">
      {/* Header */}
      <div className="p-6 border-b border-border-light">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-50 rounded-soft">
            <BellIcon className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary">
              In-App Notifications
            </h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              Send a persistent notification that appears in the customer's
              notification bell inbox
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Mode toggle */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Send To
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setMode("broadcast"); setSelectedUser(null); setSearchQuery(""); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 transition-all duration-200 ${
                mode === "broadcast"
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-border-default bg-surface-0 text-text-secondary hover:border-border-medium"
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span className="font-medium text-sm">All Customers</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("targeted")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-button border-2 transition-all duration-200 ${
                mode === "targeted"
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-border-default bg-surface-0 text-text-secondary hover:border-border-medium"
              }`}
            >
              <UserIcon className="h-5 w-5" />
              <span className="font-medium text-sm">Specific Customer</span>
            </button>
          </div>
        </div>

        {/* Customer search — targeted only */}
        {mode === "targeted" && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Customer <span className="text-error-500">*</span>
            </label>

            {selectedUser ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-button">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {selectedUser.fullName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {selectedUser.phoneNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setSearchQuery(""); }}
                  className="p-1 hover:bg-amber-100 rounded-full transition-colors shrink-0"
                >
                  <XMarkIcon className="h-4 w-4 text-amber-600" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search by name or phone..."
                  className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-button text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                />

                {isSearchFocused && debouncedSearch && (
                  <div className="absolute z-20 w-full mt-1 bg-surface-0 border border-border-default rounded-card shadow-soft-lg max-h-56 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 flex items-center justify-center gap-2 text-text-secondary text-sm">
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : filteredResults.length > 0 ? (
                      filteredResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setSearchQuery("");
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-surface-100 transition-colors"
                        >
                          <p className="text-sm font-medium text-text-primary">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-text-tertiary mt-0.5">
                            {user.phoneNumber}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-text-secondary">
                        No customers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="inapp-title"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Title <span className="text-error-500">*</span>
          </label>
          <input
            id="inapp-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekend promo — free delivery!"
            maxLength={100}
            className="w-full px-4 py-2.5 border border-border-default rounded-button text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
          />
          <p className="text-xs text-text-tertiary mt-1">{title.length}/100</p>
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="inapp-body"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Message <span className="text-error-500">*</span>
          </label>
          <textarea
            id="inapp-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 border border-border-default rounded-button text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all resize-none"
          />
          <p className="text-xs text-text-tertiary mt-1">{body.length}/500</p>
        </div>

        {/* Expiry */}
        <div>
          <label
            htmlFor="inapp-expiry"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4 text-text-tertiary" />
              Expires On
              <span className="text-text-tertiary font-normal">(optional)</span>
            </span>
          </label>
          <input
            id="inapp-expiry"
            type="date"
            value={expiresAt}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-2.5 border border-border-default rounded-button text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
          />
          <p className="text-xs text-text-tertiary mt-1">
            Leave empty to keep the notification visible indefinitely
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-surface-50 border-t border-border-light">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full px-4 py-3 bg-amber-400 text-white rounded-button hover:bg-amber-500 active:bg-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>
                {mode === "broadcast"
                  ? "Send to All Customers"
                  : "Send to Customer"}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
