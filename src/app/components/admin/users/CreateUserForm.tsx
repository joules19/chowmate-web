"use client";

import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useAdminCreateUser } from "../../../lib/hooks/api-hooks.ts/use-admin";
import { AdminCreateUserRequest } from "../../../lib/api/services/user-service";

interface CreateUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: string;
}

const userRoles = [
  { value: "Customer", label: "Customer" },
  { value: "Vendor", label: "Vendor" },
  { value: "Rider", label: "Rider" },
];

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const getCurrentDate = () => {
    const today = new Date();
    const fifteenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    return fifteenYearsAgo.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: getCurrentDate(),
    role: "Customer",
  });

  const [errors, setErrors] = useState<Partial<CreateUserFormData>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createUserMutation = useAdminCreateUser();

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^(\+234|234|0)?[789][01]\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid Nigerian phone number";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData: AdminCreateUserRequest = {
      email: formData.email.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
      role: formData.role,
    };

    createUserMutation.mutate(submitData, {
      onSuccess: (data) => {
        const userName = `${data.firstName} ${data.lastName}`;
        setSuccessMessage(
          `${userName} has been successfully created as a ${formData.role}! Account details have been sent to ${data.email}.`
        );
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          dateOfBirth: getCurrentDate(),
          role: "Customer",
        });
        setErrors({});
        setTimeout(() => {
          setSuccessMessage(null);
          onSuccess?.();
        }, 3000);
      },
      onError: (error) => {
        console.error('User creation failed:', error);
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateUserFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleClear = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: getCurrentDate(),
      role: "Customer",
    });
    setErrors({});
    setSuccessMessage(null);
  };

  return (
    <div className="bg-surface-0">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
              First Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary ${
                errors.firstName ? 'border-danger-500' : 'border-border-default'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-danger-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
              Last Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary ${
                errors.lastName ? 'border-danger-500' : 'border-border-default'
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-danger-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`w-full px-3 py-2 border rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary ${
                errors.email ? 'border-danger-500' : 'border-border-default'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number <span className="text-danger-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary ${
                errors.phoneNumber ? 'border-danger-500' : 'border-border-default'
              }`}
              placeholder="09012345678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-danger-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Role and Date of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
              User Role <span className="text-danger-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
            >
              {userRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-text-primary mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              max={getCurrentDate()}
              className={`w-full px-3 py-2 border rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary ${
                errors.dateOfBirth ? 'border-danger-500' : 'border-border-default'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-danger-500">{errors.dateOfBirth}</p>
            )}
            <p className="mt-1 text-xs text-text-tertiary">
              Leave empty to default to 15 years ago
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-default">
          <button
            type="button"
            onClick={onCancel || handleClear}
            className="px-4 py-2 border border-border-default rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500 text-text-secondary"
          >
            {onCancel ? "Cancel" : "Clear"}
          </button>
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {createUserMutation.isPending ? "Creating User..." : "Create User"}
          </button>
        </div>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mx-6 mb-6 p-4 bg-success-50 border border-success-200 text-success-800 rounded-lg">
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {createUserMutation.isError && (
        <div className="mx-6 mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-800 rounded-lg">
          <p className="text-sm font-medium">
            Failed to create user. Please check the information and try again.
          </p>
          {createUserMutation.error && (
            <p className="text-xs text-danger-600 mt-1">
              {createUserMutation.error.message || "An unexpected error occurred"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}