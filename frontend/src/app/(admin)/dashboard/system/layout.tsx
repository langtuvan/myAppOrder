"use client";
import { type NavigationItem, SideBarLayout } from "@/components/sideBarLayout";
import { useDictionary } from "@/dictionaries/locale";
import paths from "@/router/path";
import { CreditCardIcon } from "@heroicons/react/20/solid";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const formattedMessage = useDictionary();
  const navigation: NavigationItem[] = [
    {
      id: "usersAndRoles",
      label: formattedMessage.admin.system.name,
      children: [
        {
          name: formattedMessage.admin.system.navigation.users,
          href: paths.dashboard.system.users.list,
          action: "users:read",
          icon: CreditCardIcon,
        },
        {
          name: formattedMessage.admin.system.navigation.roles,
          href: paths.dashboard.system.roles.list,
          action: "roles:read",
          icon: CreditCardIcon,
        },
      ],
    },
  ];

  return (
    <SideBarLayout navigation={navigation} children={children} modal={modal} />
  );
}
