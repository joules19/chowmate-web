"use client";

import React, { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { AdminSendOtpRequest, OtpReason } from '@/app/data/types/otp';
import { useSendOtpToUser } from '@/app/lib/hooks/api-hooks/use-otp';
import { message } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

export default function SendOtpModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  userPhone, 
  userName 
}: Props) {
  const [contactInfo, setContactInfo] = useState(userEmail || userPhone || '');
  const [isEmail, setIsEmail] = useState(!!userEmail);
  const [reason, setReason] = useState<string>(OtpReason.ADMIN_ACTION);
  const [customReason, setCustomReason] = useState('');

  const sendOtpMutation = useSendOtpToUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactInfo.trim()) {
      message.error('Please enter contact information');
      return;
    }

    const finalReason = reason === 'custom' ? customReason : reason;
    if (!finalReason.trim()) {
      message.error('Please specify a reason for sending OTP');
      return;
    }

    const request: AdminSendOtpRequest = {
      contactInfo: contactInfo.trim(),
      isEmail,
      reason: finalReason
    };

    try {
      await sendOtpMutation.mutateAsync(request);
      message.success(`OTP sent successfully to ${isEmail ? 'email' : 'phone'}`);
      onClose();
    } catch (error: any) {
      message.error(error?.message || 'Failed to send OTP');
    }
  };

  const handleContactTypeChange = (emailType: boolean) => {
    setIsEmail(emailType);
    if (emailType && userEmail) {
      setContactInfo(userEmail);
    } else if (!emailType && userPhone) {
      setContactInfo(userPhone);
    } else {
      setContactInfo('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md bg-surface-0 rounded-card shadow-modal border border-border-light">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h3 className="text-lg font-semibold text-text-primary">
              Send OTP to User
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-hover rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {userName && (
              <div className="p-3 bg-primary-50 border border-primary-200 rounded-md">
                <p className="text-sm text-primary-800">
                  Sending OTP to: <span className="font-medium">{userName}</span>
                </p>
              </div>
            )}

            {/* Contact Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Contact Method
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleContactTypeChange(true)}
                  disabled={!userEmail}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    isEmail
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-surface-0 border-border-default text-text-secondary hover:bg-surface-50'
                  } ${!userEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => handleContactTypeChange(false)}
                  disabled={!userPhone}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    !isEmail
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-surface-0 border-border-default text-text-secondary hover:bg-surface-50'
                  } ${!userPhone ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <DevicePhoneMobileIcon className="h-4 w-4 mr-2" />
                  SMS
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                {isEmail ? 'Email Address' : 'Phone Number'}
              </label>
              <input
                type={isEmail ? 'email' : 'tel'}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={isEmail ? 'user@example.com' : '+1234567890'}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Reason for OTP
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                required
              >
                <option value={OtpReason.PASSWORD_RESET}>{OtpReason.PASSWORD_RESET}</option>
                <option value={OtpReason.ACCOUNT_VERIFICATION}>{OtpReason.ACCOUNT_VERIFICATION}</option>
                <option value={OtpReason.TWO_FACTOR_AUTH}>{OtpReason.TWO_FACTOR_AUTH}</option>
                <option value={OtpReason.ADMIN_ACTION}>{OtpReason.ADMIN_ACTION}</option>
                <option value="custom">Custom Reason</option>
              </select>
            </div>

            {/* Custom Reason Input */}
            {reason === 'custom' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Custom Reason
                </label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter custom reason..."
                  className="w-full px-3 py-2 border border-border-default rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  required
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-100 hover:bg-surface-200 border border-border-default rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send OTP
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}