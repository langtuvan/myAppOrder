"use client";
import { useState } from "react";
import { usePermission } from "@/hooks/usePermission";
import { useRoles } from "@/hooks/useRoles";
// import { RolesTable } from "@/components/table/roles-table";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { ErrorScreen } from "@/components/error";
import paths from "@/router/path";
import Stat from "@/components/stat";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Role } from "@/types/role";
import { RolesTable } from "@/components/table/roles-table";


export default function RoleListView() {
  // const router = useRouter();
  // // permissions
  // const { canEditRoles } = usePermission();

  // data fetching
  const [showDeleted, setShowDeleted] = useState(false);
  const { data, error, refetch } = useRoles();
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  const roles = data || [];
  // handle table actions

  // const onEdit = canEditRoles()
  //   ? (role: Role) => router.push(paths.dashboard.roles.edit(role._id))
  //   : undefined;

  // language

  const formattedLanguage = {
    title: {
      en: "Role",
      vi: "Vai trò",
    },
    description: {
      en: "Manage your academic Roles",
      vi: "Quản lý các vai trò của bạn",
    },
  };

  return (
    <>
      {/* Roles Table */}
      <RolesTable
        data={roles}
        // loading={isLoading}
        //onEdit={onEdit}
     
      />
    </>
  );
}
