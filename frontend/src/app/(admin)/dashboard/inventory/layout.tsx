"use client";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import paths from "@/router/path";
import { SideBarLayout, type NavigationItem } from "@/components/sideBarLayout";

const navigation: NavigationItem[] = [
  {
    id: "danhmuc",
    label: "Danh Mục",
    children: [
      {
        name: "Phân loại mặt hàng",
        href: paths.dashboard.inventory.categories.list,
        action: "categories:read",
        icon: UserIcon,
      },
      {
        name: "Mặt hàng",
        href: paths.dashboard.inventory.products.list,
        action: "products:read",
        icon: BuildingOfficeIcon,
      },
      {
        name: "Nhà cung cấp",
        href: paths.dashboard.inventory.suppliers.list,
        action: "suppliers:read",
        icon: UsersIcon,
      },
      {
        name: "Quản lý kho",
        href: paths.dashboard.inventory.warehouses.list,
        action: "warehouses:read",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    id: "nghiepvu",
    label: "Nghiệp Vụ",
    children: [
      {
        name: "Tồn kho hiện tại",
        href: paths.dashboard.inventory.inventory.list,
        icon: UsersIcon,
        action: "inventory:read",
      },
      {
        name: "Nhập kho ",
        href: paths.dashboard.inventory.goodsReceipts.list,
        icon: UserIcon,
        action: "goods-receipts:read",
      },
      // { name: "Chuyển kho", href: "#2", icon: BuildingOfficeIcon, current: false },
      // { name: "Thanh Toán", href: "#4", icon: CreditCardIcon, current: false },
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
