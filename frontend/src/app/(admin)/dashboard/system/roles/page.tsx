"use client";
import { Header } from "@/components/header";
import { useDictionary } from "@/dictionaries/locale";
import { useRoles } from "@/hooks/useRoles";
import { ErrorScreen } from "@/components/error";
import { RoleList } from "@/sections/list/roles-list";

export default function RoleListPage() {
  const formattedMessage = useDictionary();
  const { data, error, refetch, isLoading } = useRoles();
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  const roles = data || [];
  return (
    <>
      <Header title={formattedMessage.admin.system.roles.list} />
      <RoleList
        data={roles}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          description: true,
          isActive: true,
        }}
      />
    </>
  );
}
