"use client";
import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Logo from "../../assets/images/Logo.png";
import Illustration from "../../assets/images/illustration.png";
import LoginForm from "@/app/components/forms/LoginForm";
import { Button } from "antd";
import { LinkIcon } from "@heroicons/react/24/outline";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginAsAdmin, setLoginAsAdmin] = useState(false);

  // Handle form submission
  const handleSubmit = async (values: {
    email: string;
    password: string;
    isAdmin?: boolean;
  }) => {
    setIsLoading(true);

    try {
      const baseUrl = ``;
      const response = await axios.post(`${baseUrl}auth/login`, {
        ...values,
        isAdmin: loginAsAdmin,
      });

      if (response.status === 200) {
        const userDetails = {
          email: response?.data?.user.email,
          token: response?.data?.token,
          refreshToken: response?.data?.token,
          firstname: response?.data?.user.firstName,
          lastname: response?.data?.user.lastName,
          role: response?.data?.user.role,
          initialSetup: response?.data?.user.initialSetup,
          passwordChangedStatus: response?.data?.user.passwordChangedStatus,
          isOnboardingComplete: response?.data?.user.isOnboardingComplete,
        };
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-[1400px] mx-auto px-2 sm:px-2 md:px-4">
      <div className="h-full w-full flex flex-col">
        <div className="logo-section py-4">
          <Image src={Logo} alt="Logo" width={150} height={70} />
        </div>

        <div className="h-full w-full flex flex-col p-0 lg:flex-row mt-[2rem]">
          {/* Left Column */}
          <div className="lg:flex-1 hidden lg:flex flex-col">
            <div className="sm:ml-16 w-[453px] h-[440px]">
              <Image src={Illustration} width={500} alt="login" />
            </div>
            <div className="flex flex-col gap-1 mt-4 px-6 lg:px-0">
              <p className="ml-[80px] text-3xl leading-10 lg:text-4xl font-semibold text-dark-1 text-center lg:text-left">
                Empowering Careers
              </p>
              <div className="flex gap-3 items-center text-center -ml-0 relative bg-primary-4 -skew-y-1 mx-auto max-w-4xl px-6 py-1 lg:px-10">
                <p className="relative leading-10 text-xl lg:text-4xl font-semibold text-dark-1 text-center">
                  With AI-Driven Recruitment{" "}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center mt-4 px-6 lg:px-0">
              <p className="text-[18px] leading-10 font-normal text-dark-1 text-center lg:text-left">
                Made for recruiters and jobseekers everywhere.
              </p>
              <div className="h-[38px] sm:w-[150px]">
                <Button>
                  Learn more
                  <LinkIcon className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="lg:flex-1 w-full flex items-start justify-center rounded-[8px] p-2 sm:p-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-1">
                Log in
              </h2>

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
