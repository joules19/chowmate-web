"use client";

import { useState } from "react";
import { UserPlusIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAddAdmin } from "../../../lib/hooks/api-hooks.ts/use-admin";

interface AddAdminFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  generatePassword: boolean;
  password?: string;
}

const adminRoles = [
  { value: "Admin", label: "Admin" },
  { value: "Moderator", label: "Moderator" },
  { value: "Support", label: "Support" },
  { value: "RiderAdmin", label: "Rider Admin" },
  { value: "OperationsAdmin", label: "Operations Admin" },
];

export default function AddAdminForm() {
  const [formData, setFormData] = useState<AddAdminFormData>({
    email: "",
    firstName: "",
    lastName: "",
    role: "Admin",
    generatePassword: true,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addAdminMutation = useAddAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      generatePassword: formData.generatePassword,
      ...(formData.generatePassword ? {} : { password: formData.password }),
    };

    addAdminMutation.mutate(submitData, {
      onSuccess: (data) => {
        console.log('Admin creation successful:', data);
        const adminName = `${data.firstName} ${data.lastName}`;
        setSuccessMessage(
          formData.generatePassword 
            ? `${adminName} created successfully as ${data.roles[0]}! A temporary password has been sent to ${data.email}`
            : `${adminName} created successfully as ${data.roles[0]}!`
        );
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          role: "Admin",
          generatePassword: true,
          password: "",
        });
        setTimeout(() => setSuccessMessage(null), 8000);
      },
      onError: (error) => {
        console.error('Admin creation failed:', error);
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="bg-surface-0 rounded-card border border-border-default">
      <div className="px-6 py-4 border-b border-border-default">
        <div className="flex items-center space-x-3">
          <UserPlusIcon className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Add New Admin</h2>
            <p className="text-sm text-text-secondary">
              Create a new admin user with specified role and permissions.
            </p>
          </div>
        </div>
      </div>

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
              required
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              placeholder="Enter first name"
            />
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
              required
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
              placeholder="Enter last name"
            />
          </div>
        </div>

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
            className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
            placeholder="Enter email address"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
            Admin Role <span className="text-danger-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
          >
            {adminRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Password Options */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="generatePassword"
              name="generatePassword"
              checked={formData.generatePassword}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
            />
            <label htmlFor="generatePassword" className="ml-2 block text-sm text-text-primary">
              Generate temporary password (recommended)
            </label>
          </div>

          {!formData.generatePassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!formData.generatePassword}
                  className="w-full px-3 py-2 pr-10 border border-border-default rounded-input focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border-default">
          <button
            type="button"
            onClick={() => {
              setFormData({
                email: "",
                firstName: "",
                lastName: "",
                role: "Admin",
                generatePassword: true,
                password: "",
              });
            }}
            className="px-4 py-2 border border-border-default rounded-lg hover:bg-surface-100 transition-colors focus:ring-2 focus:ring-primary-500 text-text-secondary"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={addAdminMutation.isPending}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {addAdminMutation.isPending ? "Creating Admin..." : "Create Admin"}
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
      {addAdminMutation.isError && (
        <div className="mx-6 mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-800 rounded-lg">
          <p className="text-sm font-medium">
            Failed to create admin. Please check the information and try again.
          </p>
        </div>
      )}
    </div>
  );
}