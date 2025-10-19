"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useChangeAdminPassword } from "../../../lib/hooks/api-hooks.ts/use-admin";
import { AuthService } from "../../../lib/auth/auth-service";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangePasswordFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  [key: string]: unknown;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Auto-populate email with current user's email
  useEffect(() => {
    const currentUser = AuthService.getUser();
    if (currentUser?.email) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email,
      }));
    }
  }, [isOpen]);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changePasswordMutation = useChangeAdminPassword();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    const newPasswordErrors = validatePassword(formData.newPassword);
    if (newPasswordErrors.length > 0) {
      setValidationErrors(newPasswordErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setValidationErrors(["New password and confirmation do not match"]);
      return;
    }

    setValidationErrors([]);

    changePasswordMutation.mutate(formData, {
      onSuccess: () => {
        console.log('Password changed successfully');
        setSuccessMessage("Password changed successfully!");
        const currentUser = AuthService.getUser();
        setFormData({
          email: currentUser?.email || "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 2000);
      },
      onError: (error) => {
        console.error('Password change failed:', error);
        setSuccessMessage(null);
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors([]);
    setSuccessMessage(null);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClose = () => {
    const currentUser = AuthService.getUser();
    setFormData({
      email: currentUser?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setValidationErrors([]);
    setSuccessMessage(null);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-0 rounded-card shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-default">
          <div className="flex items-center space-x-3">
            <KeyIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-text-primary">
              Change Password
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500"
          >
            <XMarkIcon className="h-5 w-5 text-text-tertiary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address <span className="text-danger-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-100 text-text-secondary cursor-not-allowed"
              placeholder="Enter your email address"
            />
          </div>

          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-text-primary mb-2">
              Current Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPasswords.current ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-2">
              New Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPasswords.new ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPasswords.confirm ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-surface-50 rounded-lg p-3">
            <p className="text-sm font-medium text-text-primary mb-2">Password Requirements:</p>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character (@$!%*?&)</li>
            </ul>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-danger-50 border border-danger-200 text-danger-800 rounded-lg p-3">
              <ul className="text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-success-50 border border-success-200 text-success-800 rounded-lg p-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* API Error */}
          {changePasswordMutation.isError && !successMessage && (
            <div className="bg-danger-50 border border-danger-200 text-danger-800 rounded-lg p-3">
              <p className="text-sm font-medium">
                Failed to change password. Please check your current password and try again.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
              className="px-4 py-2 border border-border-default rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500 text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}