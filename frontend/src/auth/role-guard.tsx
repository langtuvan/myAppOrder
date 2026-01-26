"use client";

import { useAuth } from "@/hooks/useAuth";

// ----------------------------------------------------------------------

type RoleGuardProps = {
  children: React.ReactNode;
  roles: string[];
  fallback?: React.ReactNode;
};

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role.name)) {
    return fallback || <AccessDenied />;
  }

  return <>{children}</>;
}

// ----------------------------------------------------------------------

function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <p className="text-xl text-gray-600 mb-2">Access Denied</p>
        <p className="text-gray-500">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    </div>
  );
}
