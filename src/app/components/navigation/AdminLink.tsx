"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthService } from "../../lib/auth/auth-service";
import { CogIcon } from "@heroicons/react/24/outline";

export default function AdminLink() {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await AuthService.initializeAuth();
        if (user && AuthService.hasAdminAccess()) {
          setHasAdminAccess(true);
        }
      } catch {
        // User not authenticated or no admin access
        setHasAdminAccess(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (!hasAdminAccess) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 z-50"
      title="Admin Panel"
    >
      <CogIcon className="h-6 w-6" />
    </Link>
  );
}