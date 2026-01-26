"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { paths } from "@/router/path";

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAuth();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!isAuthenticated) {
      // const [, lang, ...splittedPath] = pathname.split("/");
      // const newPathName = splittedPath.join("/");
      const searchParams = new URLSearchParams({
        returnTo: pathname,
      }).toString();

      const loginPath = paths.auth.login;
      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    if (isInitialized) {
      check();
    }
  }, [isInitialized, check]);

  if (!checked) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

// ----------------------------------------------------------------------

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
