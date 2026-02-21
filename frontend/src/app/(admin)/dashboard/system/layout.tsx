"use client";
import { type NavigationItem, SideBarLayout } from "@/components/sideBarLayout";
import paths from "@/router/path";
import { CreditCardIcon } from "@heroicons/react/20/solid";

const navigation: NavigationItem[] = [
  {
    id: "usersAndRoles",
    label: "Vai trò quyền hạn",
    children: [
      {
        name: "Nhân viên",
        href: paths.dashboard.system.users.list,
        action: "users:read",
        icon: CreditCardIcon,
      },
      {
        name: "Vai trò quyền hạn",
        href: paths.dashboard.system.roles.list,
        action: "roles:read",
        icon: CreditCardIcon,
      },
    ],
  },
];

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <SideBarLayout navigation={navigation} children={children} modal={modal} />
  );
}
