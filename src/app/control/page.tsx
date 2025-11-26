"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../lib/auth/auth-service";

export default function AdminEntry() {
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Initialize auth and check if user has admin access
        const user = await AuthService.initializeAuth();

        if (!user) {
          // Not authenticated, redirect to login
          router.replace('/login?redirect=/control/dashboard');
          return;
        }

        if (!AuthService.hasAdminAccess()) {
          // User doesn't have admin access
          router.replace('/unauthorized');
          return;
        }

        // User has admin access, redirect to dashboard
        router.replace('/control/dashboard');
      } catch (error) {
        console.error('Admin access check failed:', error);
        router.replace('/login?redirect=/control/dashboard');
      }
    };

    checkAdminAccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-text-secondary">Checking admin access...</p>
      </div>
    </div>
  );
}