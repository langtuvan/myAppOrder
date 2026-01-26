"use client";

import { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { User } from "@/types/user";
import paths from "@/router/path";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/components/dropdown";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

// const users = [];

export default function UserList({ data }: { data: User[] }) {
  if (!data || data.length === 0) {
    return <div>No users found.</div>;
  }
  return (
    <Table dense grid striped>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader className="hidden md:block">Email</TableHeader>
          <TableHeader>Role</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data &&
          data.length > 0 &&
          data.map((user) => (
            <TableRow
              key={user._id ?? user.email}
              //href={paths.dashboard.system.users.edit(user._id!)}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="hidden md:block">{user.email}</TableCell>
              <TableCell className="text-zinc-500 ">
                {user.role?.name ?? "—"}
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownButton plain aria-label="More options">
                    <EllipsisHorizontalIcon />
                  </DropdownButton>
                  <DropdownMenu>
                    <DropdownItem href={paths.dashboard.system.users.edit(user._id!)}>Edit</DropdownItem>
                    <DropdownItem href={paths.dashboard.system.users.resetPassword(user._id!)}>Reset Password</DropdownItem>
        
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
