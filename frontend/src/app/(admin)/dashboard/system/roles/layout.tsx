"use client";
import { AccessDeniedScreen } from "@/components/error";
import { usePermission } from "@/hooks";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children
  const { canViewRoles } = usePermission();
  return canViewRoles() ? children : <AccessDeniedScreen />;
}
