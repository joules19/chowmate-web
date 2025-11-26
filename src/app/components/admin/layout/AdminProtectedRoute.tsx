"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../../../lib/auth/auth-service";

interface Props {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await AuthService.initializeAuth();

        if (!user) {
          router.replace('/login?redirect=/control/dashboard');
          return;
        }

        if (!AuthService.hasAdminAccess()) {
          router.replace('/unauthorized');
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login?redirect=/control/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          {/* <p className="text-text-secondary">Authenticating...</p> */}
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}