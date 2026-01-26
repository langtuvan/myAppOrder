"use client";

import { useAuth } from "@/hooks/useAuth";

// ----------------------------------------------------------------------

type PermissionGuardProps = {
  children: React.ReactNode;
  permissions: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
};

export function PermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback,
}: PermissionGuardProps) {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
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
          You don&apos;t have permission to perform this action.
        </p>
      </div>
    </div>
  );
}
