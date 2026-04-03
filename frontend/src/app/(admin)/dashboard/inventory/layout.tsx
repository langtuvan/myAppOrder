"use client";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import paths from "@/router/path";
import { SideBarLayout, type NavigationItem } from "@/components/sideBarLayout";
import { useDictionary } from "@/dictionaries/locale";

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
      id: "danhmuc",
      label: formattedMessage.admin.inventory.name,
      children: [
        {
          name: formattedMessage.admin.inventory.categories.title,
          href: paths.dashboard.inventory.categories.list,
          action: "categories:read",
          icon: UserIcon,
        },
        {
          name: formattedMessage.admin.inventory.products.title,
          href: paths.dashboard.inventory.products.list,
          action: "products:read",
          icon: BuildingOfficeIcon,
        },
        {
          name: formattedMessage.admin.inventory.suppliers.title,
          href: paths.dashboard.inventory.suppliers.list,
          action: "suppliers:read",
          icon: UsersIcon,
        },
        {
          name: formattedMessage.admin.inventory.warehouses.title,
          href: paths.dashboard.inventory.warehouses.list,
          action: "warehouses:read",
          icon: CreditCardIcon,
        },
      ],
    },
    {
      id: "nghiepvu",
      label: formattedMessage.admin.inventory.navigation.operations,
      children: [
        {
          name: formattedMessage.admin.inventory.inventory.title,
          href: paths.dashboard.inventory.inventory.list,
          icon: UsersIcon,
          action: "inventory:read",
        },
        {
          name: formattedMessage.admin.inventory.goodsReceipts.title,
          href: paths.dashboard.inventory.goodsReceipts.list,
          icon: UserIcon,
          action: "goods-receipts:read",
        },
        // {
        //   name: formattedMessage.admin.inventory.issueReceipts.title,
        //   href: paths.dashboard.inventory.issueReceipts.list,
        //   icon: UserIcon,
        //   action: "issue-receipts:read",
        // },
        // { name: "Chuyển kho", href: "#2", icon: BuildingOfficeIcon, current: false },
        // { name: "Thanh Toán", href: "#4", icon: CreditCardIcon, current: false },
      ],
    },
  ];
  return (
    <SideBarLayout navigation={navigation} children={children} modal={modal} />
  );
}
