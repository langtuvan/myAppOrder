"use client";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { useUsers } from "@/hooks/useUsers";
import paths from "@/router/path";
import UserList from "@/sections/list/user-list";

export default function UserPage() {
  const { data } = useUsers();

  const users = data?.data || [];
  return (
    <>
      <div className="flex w-full  flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>User List</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.system.users.create} plain>
            Add New
          </Button>
        </div>
      </div>
      <UserList data={users} />
    </>
  );
}
