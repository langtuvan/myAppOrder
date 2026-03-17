"use client";

import { useEffect, useCallback } from "react";

import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/router/path";
import { useRouter } from "next/navigation"; 
import { useSearchParams } from "next/navigation";

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitialized } = useAuth();

  const returnTo = searchParams.get("returnTo") || paths.dashboard.root;

  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isAuthenticated, returnTo, router]);

  useEffect(() => {
    if (isInitialized) {
      check();
    }
  }, [isInitialized, check]);

  return <>{children}</>;
}
