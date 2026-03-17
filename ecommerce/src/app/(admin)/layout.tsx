"use client";
import { AuthGuard, AuthProvider } from "@/auth";
import { QueryProvider } from "@/providers/query-client-provider";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastDialogProvider } from "@/contexts/toast-dialog-context";
import ToastDialogContainer from "@/components/toast-dialog-container";
import ToastContainer from "@/components/toast-container";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <ToastDialogProvider>
        <ToastProvider>
          <ToastContainer />
          <ToastDialogContainer />
          <AuthProvider>
            <AuthGuard>{children} </AuthGuard>
          </AuthProvider>
        </ToastProvider>
      </ToastDialogProvider>
    </QueryProvider>
  );
}
