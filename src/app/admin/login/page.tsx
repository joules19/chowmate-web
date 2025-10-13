"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Logo from "../../assets/images/chowmate-light.png";
import Illustration from "../../assets/images/illustration.png";
import { Button, message } from "antd";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { AuthService } from "../../lib/auth/auth-service";
import InputField from "../../components/ui/InputField";

const AdminLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Check if user is already authenticated as admin
  useEffect(() => {
    const checkAuth = async () => {
      const user = await AuthService.initializeAuth();
      if (user && AuthService.hasAdminAccess()) {
        // Admin is already authenticated, redirect to admin dashboard
        const targetUrl = redirectUrl || '/admin/dashboard';
        router.replace(targetUrl);
      }
    }


    checkAuth();
  }, [router, redirectUrl]);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use actual AuthService.login with real API
      await AuthService.login(email, password);

      // Check if user has admin access
      if (!AuthService.hasAdminAccess()) {
        message.error('Access denied. Admin privileges required.');
        await AuthService.logout();
        return;
      }

      message.success('Admin login successful!');

      // Redirect to admin dashboard
      const targetUrl = redirectUrl || '/admin/dashboard';
      router.replace(targetUrl);

    } catch (err: any) {
      console.error("Admin login failed:", err);
      message.error(err.message || 'Login failed. Please verify your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-[1400px] mx-auto px-2 sm:px-2 md:px-4">
      <div className="h-full w-full flex flex-col">
        <div className="logo-section py-4">
          <Image src={Logo} alt="Chowmate Logo" width={180} />
        </div>

        <div className="h-full w-full flex flex-col p-0 lg:flex-row mt-[2rem]">
          {/* Left Column */}
          <div className="lg:flex-1 hidden lg:flex flex-col">
            <div className="sm:ml-16 w-[453px] h-[440px]">
              <Image src={Illustration} width={500} alt="Admin dashboard illustration" />
            </div>
            <div className="flex flex-col gap-1 mt-4 px-6 lg:px-0">
              <p className="ml-[80px] text-3xl leading-10 lg:text-4xl font-semibold text-dark-1 text-center lg:text-left">
                Secure Admin Access
              </p>
              <div className="flex gap-3 items-center text-center -ml-0 relative bg-primary-4 -skew-y-1 mx-auto max-w-4xl px-6 py-1 lg:px-10">
                <p className="relative leading-10 text-xl lg:text-[32px] font-semibold text-dark-1 text-center">
                  Manage Your Chowmate Platform
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center mt-4 px-6 lg:px-0">
              <p className="text-[18px] leading-10 font-normal text-dark-1 text-center lg:text-left">
                Monitor operations, manage users, and oversee platform performance.
              </p>
              <div className="h-[38px] sm:w-[150px]">
                <Button disabled className="opacity-50">
                  Admin Only
                  <ShieldCheckIcon className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Login Section */}
          <div className="lg:flex-1 w-full flex items-start justify-center rounded-[8px] p-2 sm:p-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-primary-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-center text-1">
                    Admin Login
                  </h2>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Secure access for authorized administrators only
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  id="admin-email"
                  name="email"
                  type="email"
                  label="Admin Email"
                  placeholder="admin@chowmate.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />

                <InputField
                  id="admin-password"
                  name="password"
                  type="password"
                  label="Admin Password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  required
                />

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <ShieldCheckIcon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-primary-800">Security Notice</h4>
                      <p className="text-xs text-primary-700 mt-1">
                        This is a secure admin portal. Only authorized personnel with admin privileges can access this system.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In to Admin Panel'}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Need access? Contact your system administrator
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;