"use client";
import { Avatar } from "@/components/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/dropdown";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/sidebar";
import { StackedLayout } from "@/components/stacked-layout";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { InboxIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks";
import { KeyIcon } from "@heroicons/react/24/outline";
import { DropDownToggleTheme } from "@/components/ThemeToggle";

import { useMemo } from "react";
import { OrderStatus } from "@/types/order";
import LanguageToggle, {
  LanguageToggleNavbarItem,
} from "@/components/LanguageToggle";
import { useLanguageStore } from "@/store/language";

const navItems = [
  {
    label: {
      en: "Dashboard",
      vi: "Bảng Điều Khiển",
    },
    url: "/dashboard",
    action: "orders:update",
  },
  {
    label: {
      en: "Orders",
      vi: "Đơn Hàng",
    },
    url: "/dashboard/orders",
    action: "orders:read",
    children: [
      {
        label: {
          en: "Create Order",
          vi: "Tạo Đơn Hàng",
        },
        url: "/dashboard/orders/add",
        action: "orders:create",
      },
      {
        label: {
          en: "Order List",
          vi: "Danh Sách Đơn Hàng",
        },
        url: "/dashboard/orders",
        action: "orders:update",
      },
    ],
  },
  {
    label: {
      en: "System",
      vi: "Hệ Thống",
    },
    url: "/dashboard/system",
    action: "users:read",
  },
  {
    label: {
      en: "Inventory",
      vi: "Kho Hàng",
    },
    url: "/dashboard/inventory",
    action: "products:read",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const { logout, user } = useAuth();

  const permissions = useMemo(
    () => user?.role.permissions.map((p) => p.action) || [],
    [user],
  );

  const activeLink = pathName.split("/").slice(0, 3).join("/");

  const { locale } = useLanguageStore();

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url, action, children }) => {
              const current = activeLink === url;
              if (children && children.length > 0) {
                // check children if any permission is included
                const hasPermission = children.some(({ action = "" }) =>
                  permissions.includes(action),
                );
                if (!hasPermission) {
                  return null;
                }
                return (
                  <Dropdown key={url}>
                    <DropdownButton current={current} as={NavbarItem}>
                      {label[locale]}
                      <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu>
                      {children.map(
                        ({ label: childLabel, url: childUrl, action = "" }) => (
                          <DropdownItem
                            key={action + "dropdownitem"}
                            href={childUrl}
                            disabled={pathName === childUrl}
                            className={
                              permissions.includes(action) ? "" : "hidden"
                            }
                          >
                            {childLabel[locale]}
                          </DropdownItem>
                        ),
                      )}
                    </DropdownMenu>
                  </Dropdown>
                );
              }

              return (
                <NavbarItem
                  key={action + "navbaritem"}
                  href={url}
                  current={current}
                  className={permissions.includes(action!) ? "" : "hidden"}
                >
                  {label[locale]}
                </NavbarItem>
              );
            })}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <LanguageToggleNavbarItem />

            <NavbarItem aria-label="Toggle theme">
              <DropDownToggleTheme />
            </NavbarItem>
            <NavbarItem href="#" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="#" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <UserIcon />
                {/* <Avatar src="/profile-photo.jpg" square /> */}
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/dashboard/account/profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>

                <DropdownItem href="/dashboard/account/profile#change-password">
                  <KeyIcon />
                  <DropdownLabel>Change Password</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={() => logout()}>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url, children, action }) => {
                if (children && children.length > 0) {
                  return (
                    <div key={url + "sidebarsection"}>
                      {children.map(
                        ({ label: childLabel, url: childUrl, action = "" }) => (
                          <SidebarItem
                            current={pathName === childUrl}
                            key={childUrl + "sidebar"}
                            href={childUrl}
                            className={
                              permissions.includes(action) ? "" : "hidden"
                            }
                          >
                            {childLabel[locale]}
                          </SidebarItem>
                        ),
                      )}
                    </div>
                  );
                }
                if (!permissions.includes(action!)) {
                  return null;
                }
                return (
                  <SidebarItem
                    key={url + "sidebar"}
                    href={url}
                    current={pathName === url}
                  >
                    {label[locale]}
                  </SidebarItem>
                );
              })}
              <SidebarDivider />
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  );
}
