import React, { useState } from "react";
import InputField from "../ui/InputField";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button1";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { clearSession } from "../../utils/sessionManager";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onSubmit: (oldPassword: string, newPassword: string) => void;
  isFormSubmitting: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onSubmit,
  isFormSubmitting,
}) => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      message.warning("Passwords do not match.");
      return;
    }
    onSubmit(oldPassword, newPassword);
  };

  // Password Validation Logic
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
  const isMinLength = newPassword.length >= 8;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <h3 className="text-2xl mb-4 text-dark-1 text-center font-semibold">
          Change Password
        </h3>

        {/* Informative Paragraph */}
        <div className="bg-blue-50 border border-primary-3 p-4 rounded-lg mb-6">
          <p className="text-primary-1 text-center font-medium">
            🚨 <strong>Security Check!</strong> Before you can proceed with
            onboarding, you’ll need to change your password. This helps ensure
            your account is secure and ready for use. 🔐
          </p>
          <p className="text-primary-1 text-center mt-2">
            It’ll only take a moment. Let’s get you set up and on your way to
            onboarding! 🎉
          </p>
        </div>

        <div className="space-y-4">
          {/* Old Password Field */}
          <div className="relative">
            <InputField
              label="Old Password"
              name="oldPassword"
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-8"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <InputField
              label="New Password"
              name="newPassword"
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-8"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 top-8"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-700 font-medium">
            Your password must contain:
          </p>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  isMinLength ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              />
              At least 8 characters
            </li>
            <li className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  hasUpperCase ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              />
              An uppercase letter (A-Z)
            </li>
            <li className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  hasLowerCase ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              />
              A lowercase letter (a-z)
            </li>
            <li className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  hasNumber ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              />
              A number (0-9)
            </li>
            <li className="flex items-center">
              <span
                className={`h-3 w-3 rounded-full ${
                  hasSpecialChar ? "bg-green-500" : "bg-red-500"
                } mr-2`}
              />
              A special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="w-full h-[38px]">
            <Button
              mode="solid"
              buttonText="Change Password"
              defaultColor="primary-1"
              hoverColor="primary-2"
              onClick={handleSubmit}
              loading={isFormSubmitting}
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="#"
            onClick={() => {
              clearSession();
              navigate("/auth/login", { replace: true });
            }}
            className="rounded-md px-3.5 py-[6px] text-sm font-semibold text-primary-1 hover:bg-primary-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
          >
            <span aria-hidden="true">&larr; &nbsp;</span> Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
