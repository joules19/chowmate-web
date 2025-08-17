"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "../../assets/images/chowmate-dark-mont.png";
import {  message } from "antd";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { AuthService } from "../../lib/auth/auth-service";
import InputField from "../../components/ui/InputField";
import Image from "next/image";

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
      try {
        const user = await AuthService.initializeAuth();
        if (user && AuthService.hasAdminAccess()) {
          const targetUrl = redirectUrl || '/admin/dashboard';
          router.replace(targetUrl);
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    };

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
      const user = await AuthService.login(email, password);
      
      if (!AuthService.hasAdminAccess()) {
        message.error('Access denied. Admin privileges required.');
        await AuthService.logout();
        return;
      }
      
      message.success('Admin login successful!');
      
      const targetUrl = redirectUrl || '/admin/dashboard';
      router.replace(targetUrl);

    } catch (err: any) {
      console.error("Admin login failed:", err);
      message.error(err.message || 'Login failed. Please verify your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Better Admin Dashboard Illustration (SVG)
  const AdminDashboardIllustration = () => (
    <svg
      width="453"
      height="440"
      viewBox="0 0 453 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background */}
      <rect width="453" height="440" rx="8" fill="#FFFCF4" />
      
      {/* Dashboard Frame */}
      <rect x="40" y="60" width="373" height="320" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Header Bar */}
      <rect x="40" y="60" width="373" height="50" rx="12" fill="#B5520A" />
      <circle cx="70" cy="85" r="8" fill="#EF4444" />
      <circle cx="95" cy="85" r="8" fill="#FFC107" />
      <circle cx="120" cy="85" r="8" fill="#10B981" />
      <rect x="280" y="75" width="120" height="20" rx="10" fill="#FFFCF4" />
      
      {/* Sidebar */}
      <rect x="60" y="130" width="80" height="230" fill="#FFFCF4" />
      <rect x="70" y="140" width="60" height="15" rx="4" fill="#B5520A" />
      <rect x="70" y="165" width="60" height="12" rx="4" fill="#FFC107" />
      <rect x="70" y="185" width="60" height="12" rx="4" fill="#D4660F" />
      <rect x="70" y="205" width="60" height="12" rx="4" fill="#FFD54F" />
      <rect x="70" y="225" width="60" height="12" rx="4" fill="#E8711A" />
      
      {/* Main Content Area */}
      <rect x="160" y="130" width="233" height="230" fill="white" />
      
      {/* Charts and Analytics */}
      <rect x="180" y="150" width="80" height="60" rx="8" fill="#FFFCF4" stroke="#B5520A" strokeWidth="1" />
      <rect x="185" y="175" width="10" height="25" fill="#B5520A" />
      <rect x="200" y="165" width="10" height="35" fill="#FFC107" />
      <rect x="215" y="170" width="10" height="30" fill="#D4660F" />
      <rect x="230" y="160" width="10" height="40" fill="#FFE082" />
      
      <rect x="280" y="150" width="80" height="60" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="1" />
      <circle cx="320" cy="180" r="20" fill="none" stroke="#10B981" strokeWidth="3" />
      <path d="M310 180 L318 188 L330 172" stroke="#10B981" strokeWidth="2" fill="none" />
      
      {/* Data Tables */}
      <rect x="180" y="230" width="193" height="100" rx="8" fill="#FFFCF4" stroke="#B5520A" strokeWidth="1" />
      <rect x="190" y="240" width="173" height="15" fill="#FFF8E1" />
      <rect x="190" y="260" width="173" height="12" fill="white" />
      <rect x="190" y="275" width="173" height="12" fill="#FFFCF4" />
      <rect x="190" y="290" width="173" height="12" fill="white" />
      <rect x="190" y="305" width="173" height="12" fill="#FFFCF4" />
      
      {/* Floating Analytics Cards */}
      <rect x="100" y="100" width="120" height="60" rx="12" fill="white" stroke="#B5520A" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" />
      <rect x="110" y="115" width="30" height="6" rx="3" fill="#B5520A" />
      <rect x="110" y="125" width="60" height="8" rx="4" fill="#FFC107" />
      <rect x="110" y="137" width="40" height="6" rx="3" fill="#D4660F" />
      
      <rect x="280" y="350" width="120" height="60" rx="12" fill="white" stroke="#B5520A" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" />
      <rect x="290" y="365" width="30" height="6" rx="3" fill="#B5520A" />
      <rect x="290" y="375" width="60" height="8" rx="4" fill="#FFC107" />
      <rect x="290" y="387" width="40" height="6" rx="3" fill="#E8711A" />
      
      {/* Admin User Avatar */}
      <circle cx="350" cy="85" r="15" fill="#B5520A" />
      <rect x="345" y="80" width="10" height="6" rx="3" fill="white" />
      <circle cx="350" cy="88" r="4" fill="white" />
    </svg>
   );

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-2 sm:px-2 md:px-4">
      <div className="w-full flex flex-col">
        <div className="logo-section pt-6">
          <Image src={Logo} alt="Chowmate Logo" width={190} />
        </div>

        <div className="w-full flex flex-col p-0 lg:flex-row mt-4">
          {/* Left Column - Updated with Better Illustration */}
          <div className="lg:flex-1 hidden lg:flex flex-col justify-center">
            <div className="sm:ml-16 w-[453px] h-[360px] flex items-center justify-center">
              <AdminDashboardIllustration />
            </div>
            <div className="flex flex-col gap-1 mt-2 px-6 lg:px-0">
              <p className="ml-[80px] text-3xl leading-8 lg:text-4xl font-semibold text-dark-1 text-center lg:text-left">
                Admin Control Center
              </p>
              <div className="flex gap-3 items-center text-center -ml-0 relative bg-primary-4 -skew-y-1 mx-auto max-w-4xl px-6 py-1 lg:px-10">
                <p className="relative leading-8 text-xl lg:text-[28px] font-semibold text-dark-1 text-center">
                  Manage Your Chowmate Platform
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center mt-2 px-6 lg:px-0">
              <p className="text-[16px] leading-6 font-normal text-dark-1 text-center lg:text-left">
                Monitor operations, manage users, vendors, and riders. Oversee platform performance with real-time analytics.
              </p>
             
            </div>
          </div>

          {/* Admin Login Section */}
          <div className="lg:flex-1 w-full flex items-center justify-center rounded-[8px] p-2 sm:p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-primary-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-center text-1">
                    Login
                  </h2>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Authorized personnel only.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  id="admin-email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="admin@chowmate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />

                <InputField
                  id="admin-password"
                  name="password"
                  type="password"
                  label="Password"
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
                        Only authorized personnel with admin privileges can access this system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cleaned up button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-medium text-base rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-5 h-5" />
                      <span>Sign In to Admin Panel</span>
                    </>
                  )}
                </button>

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


// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import Logo from "../../assets/images/chowmate-light.png";
// import Illustration from "../../assets/images/illustration.png";
// import LoginForm from "@/app/components/forms/LoginForm";
// import { Button, message } from "antd";
// import { LinkIcon } from "@heroicons/react/24/outline";
// import { AuthService } from "../../lib/auth/auth-service";
// import { Permission } from "../../data/types/permissions";

// const Login: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectUrl = searchParams.get('redirect');

//   // Check if user is already authenticated
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const user = await AuthService.initializeAuth();
//         if (user) {
//           // User is already authenticated, redirect to main app (not admin)
//           const targetUrl = redirectUrl || '/';
//           router.replace(targetUrl);
//         }
//       } catch (error) {
//         // User not authenticated, stay on login page
//       }
//     };

//     checkAuth();
//   }, [router, redirectUrl]);

//   // Handle form submission
//   const handleSubmit = async (values: {
//     email: string;
//     password: string;
//   }) => {
//     setIsLoading(true);

//     try {
//       // Use actual AuthService.login with real API
//       const user = await AuthService.login(values.email, values.password);
      
//       message.success('Login successful!');
      
//       // Redirect to main app (customer/vendor dashboard)
//       const targetUrl = redirectUrl || '/';
//       router.replace(targetUrl);

//     } catch (err: any) {
//       console.error("Login failed:", err);
//       message.error(err.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen max-w-[1400px] mx-auto px-2 sm:px-2 md:px-4">
//       <div className="h-full w-full flex flex-col">
//         <div className="logo-section py-4">
//           <Image src={Logo} alt="Logo" width={180} />
//         </div>

//         <div className="h-full w-full flex flex-col p-0 lg:flex-row mt-[2rem]">
//           {/* Left Column */}
//           <div className="lg:flex-1 hidden lg:flex flex-col">
//             <div className="sm:ml-16 w-[453px] h-[440px]">
//               <Image src={Illustration} width={500} alt="login" />
//             </div>
//             <div className="flex flex-col gap-1 mt-4 px-6 lg:px-0">
//               <p className="ml-[80px] text-3xl leading-10 lg:text-4xl font-semibold text-dark-1 text-center lg:text-left">
//                 Bringing Flavors Home              </p>
//               <div className="flex gap-3 items-center text-center -ml-0 relative bg-primary-4 -skew-y-1 mx-auto max-w-4xl px-6 py-1 lg:px-10">
//                 <p className="relative leading-10 text-xl lg:text-[32px] font-semibold text-dark-1 text-center">
//                   Through Your Favorite Local Eats
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col gap-3 items-center mt-4 px-6 lg:px-0">
//               <p className="text-[18px] leading-10 font-normal text-dark-1 text-center lg:text-left">
//                 For food lovers and taste adventurers everywhere.              </p>
//               <div className="h-[38px] sm:w-[150px]">
//                 <Button>
//                   Explore now                  <LinkIcon className="w-5 h-5 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Login Section */}
//           <div className="lg:flex-1 w-full flex items-start justify-center rounded-[8px] p-2 sm:p-8">
//             <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
//               <div className="flex justify-center items-center mb-6">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-center text-1">
//                   Log in
//                 </h2>
//               </div>

//               <LoginForm
//                 isLoading={isLoading}
//                 setIsLoading={setIsLoading}
//                 onSubmit={handleSubmit}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
