"use client";

import { AuthProvider } from "@/auth";
import { GuestGuard } from "@/auth/guest-guard";
import { AuthLayout } from "@/components/auth-layout";
import { Suspense } from "react";

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayoutGuest({ children }: AuthLayoutProps) {
  return (
    <Suspense>
      <AuthProvider>
        <GuestGuard>
          <AuthLayout>{children}</AuthLayout>
        </GuestGuard>
      </AuthProvider>
    </Suspense>
  );
}
