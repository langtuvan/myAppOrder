"use client";
import { AddBtn, Header } from "@/components/header";
import { useUsers } from "@/hooks/useUsers";
import formattedMessage from "@/language/language";
import paths from "@/router/path";
import UserList from "@/sections/list/user-list";

export default function UserPage() {
  const { data, isLoading } = useUsers();
  const users = data?.data || [];
  return (
    <>
      <Header
        title={formattedMessage.system.users.list}
        action={<AddBtn href={paths.dashboard.system.users.create} />}
      />
      <UserList
        data={users}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          email: true,
          isActive: true,
          address: true,
          role: true,
        }}
      />
    </>
  );
}
