import { ReactNode } from "react";
import AdminSidebar from "../components/admin/layout/AdminSidebar";
import AdminHeader from "../components/admin/layout/AdminHeader";
import AdminProtectedRoute from "../components/admin/layout/AdminProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}