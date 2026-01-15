"use client";

import { ChatBubbleLeftRightIcon, EnvelopeIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import PushNotificationCard from "@/app/components/admin/messaging/PushNotificationCard";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import { Permission } from "@/app/data/types/permissions";

export default function MessagingPage() {
  return (
    <PermissionGuard permission={Permission.VIEW_SETTINGS}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 rounded-soft">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-500" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                  Messaging
                </h1>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Send push notifications, SMS, and emails to your users
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-info-50 border border-info-200 rounded-card p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-info-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-info-800">About Messaging</h3>
              <p className="text-sm text-info-700 mt-1 leading-relaxed">
                Use this section to communicate with your users through various channels.
                Push notifications are delivered instantly to users who have the app installed.
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Sections */}
        <div className="space-y-6">
          {/* Push Notifications Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              Push Notifications
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PushNotificationCard />

              {/* Tips Card */}
              <div className="bg-surface-0 rounded-card shadow-soft border border-border-light">
                <div className="p-6 border-b border-border-light">
                  <h3 className="text-base font-semibold text-text-primary">
                    Push Notification Tips
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 text-sm text-text-secondary">
                    <li className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span>
                        Keep titles short and attention-grabbing (under 50 characters)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span>
                        Include a clear call-to-action in your message
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span>
                        Consider timing - avoid sending notifications late at night
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span>
                        Use targeted notifications for promotions to relevant users
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-500 mr-2">•</span>
                      <span>
                        Don&apos;t over-notify - too many notifications can lead to uninstalls
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Section - Placeholder */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              SMS Messages
            </h2>
            <div className="bg-surface-0 rounded-card shadow-soft border border-border-light border-dashed">
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="p-4 bg-surface-100 rounded-full mb-4">
                  <DevicePhoneMobileIcon className="h-8 w-8 text-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-text-secondary mb-2">
                  SMS Messaging Coming Soon
                </h3>
                <p className="text-sm text-text-tertiary max-w-xs">
                  Send SMS messages directly to your customers&apos; phones
                </p>
              </div>
            </div>
          </div>

          {/* Email Section - Placeholder */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight mb-4">
              Email Campaigns
            </h2>
            <div className="bg-surface-0 rounded-card shadow-soft border border-border-light border-dashed">
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="p-4 bg-surface-100 rounded-full mb-4">
                  <EnvelopeIcon className="h-8 w-8 text-text-tertiary" />
                </div>
                <h3 className="text-base font-medium text-text-secondary mb-2">
                  Email Campaigns Coming Soon
                </h3>
                <p className="text-sm text-text-tertiary max-w-xs">
                  Create and send email campaigns to your user base
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
