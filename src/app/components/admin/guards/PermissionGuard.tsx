"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PermissionService } from "../../../lib/auth/permissions";
import { Permission } from "../../../data/types/permissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function PermissionGuard({ 
  children, 
  permission, 
  fallback = null, 
  redirectTo = "/unauthorized" 
}: PermissionGuardProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkPermission = () => {
      const allowed = PermissionService.hasPermission(permission);
      setHasPermission(allowed);

      if (!allowed && redirectTo) {
        router.push(redirectTo);
      }
    };

    checkPermission();
  }, [permission, redirectTo, router]);

  // Loading state while checking permissions
  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Permission denied
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Access Denied
          </h2>
          <p className="text-text-secondary mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Permission granted
  return <>{children}</>;
}