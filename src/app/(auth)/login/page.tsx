"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Logo from "../../assets/images/chowmate-light.png";
import Illustration from "../../assets/images/illustration.png";
import LoginForm from "@/app/components/forms/LoginForm";
import { Button, message } from "antd";
import { LinkIcon } from "@heroicons/react/24/outline";
import { AuthService } from "../../lib/auth/auth-service";
import { Permission } from "../../data/types/permissions";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.initializeAuth();
        if (user) {
          // User is already authenticated, redirect them
          const targetUrl = redirectUrl || (AuthService.hasAdminAccess() ? '/admin/dashboard' : '/');
          router.replace(targetUrl);
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    };

    checkAuth();
  }, [router, redirectUrl]);

  // Handle form submission
  const handleSubmit = async (values: {
    email: string;
    password: string;
    isAdmin?: boolean;
  }) => {
    setIsLoading(true);

    try {
      // Use actual AuthService.login with real API
      const user = await AuthService.login(values.email, values.password);
      
      message.success('Login successful!');
      
      // Redirect based on user role and redirect URL
      const targetUrl = redirectUrl || (AuthService.hasAdminAccess() ? '/admin/dashboard' : '/');
      router.replace(targetUrl);

    } catch (err: any) {
      console.error("Login failed:", err);
      message.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-[1400px] mx-auto px-2 sm:px-2 md:px-4">
      <div className="h-full w-full flex flex-col">
        <div className="logo-section py-4">
          <Image src={Logo} alt="Logo" width={180} />
        </div>

        <div className="h-full w-full flex flex-col p-0 lg:flex-row mt-[2rem]">
          {/* Left Column */}
          <div className="lg:flex-1 hidden lg:flex flex-col">
            <div className="sm:ml-16 w-[453px] h-[440px]">
              <Image src={Illustration} width={500} alt="login" />
            </div>
            <div className="flex flex-col gap-1 mt-4 px-6 lg:px-0">
              <p className="ml-[80px] text-3xl leading-10 lg:text-4xl font-semibold text-dark-1 text-center lg:text-left">
                Bringing Flavors Home              </p>
              <div className="flex gap-3 items-center text-center -ml-0 relative bg-primary-4 -skew-y-1 mx-auto max-w-4xl px-6 py-1 lg:px-10">
                <p className="relative leading-10 text-xl lg:text-[32px] font-semibold text-dark-1 text-center">
                  Through Your Favorite Local Eats
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center mt-4 px-6 lg:px-0">
              <p className="text-[18px] leading-10 font-normal text-dark-1 text-center lg:text-left">
                For food lovers and taste adventurers everywhere.              </p>
              <div className="h-[38px] sm:w-[150px]">
                <Button>
                  Explore now                  <LinkIcon className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="lg:flex-1 w-full flex items-start justify-center rounded-[8px] p-2 sm:p-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-1">
                  Log in
                </h2>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Admin</label>
                  <input
                    type="checkbox"
                    checked={loginAsAdmin}
                    onChange={(e) => setLoginAsAdmin(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
              </div>

              <LoginForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onSubmit={handleSubmit}
                loginAsAdmin={loginAsAdmin}
                setLoginAsAdmin={setLoginAsAdmin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
