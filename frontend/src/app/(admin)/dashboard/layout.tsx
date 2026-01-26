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
import { OrderStatus } from "@/hooks/useOrders";
import { useMemo } from "react";

const navItems = [
  { label: "Report", url: "/dashboard", action: "orders:update" },
  {
    label: "Orders",
    url: "/dashboard/orders",
    action: "orders:read",
    children: [
      {
        label: "Order List",
        url: "/dashboard/orders",
        action: "orders:update",
      },
      {
        label: "Order Confirm",
        url: "/dashboard/orders/confirm",
        action: "orders:" + OrderStatus.CONFIRMED,
      },
      {
        label: "Order Export",
        url: "/dashboard/orders/export",
        action: "orders:" + OrderStatus.EXPORTED,
      },
      {
        label: "Order Delivery",
        url: "/dashboard/orders/delivery",
        action: "orders:" + OrderStatus.DELIVERED,
      },
      {
        label: "Order Complete",
        url: "/dashboard/orders/complete",
        action: "orders:" + OrderStatus.COMPLETED,
      },
    ],
  },
  {
    label: "System",
    url: "/dashboard/system",
    children: [
      { label: "Users", url: "/dashboard/system/users", action: "users:read" },
      { label: "Roles", url: "/dashboard/system/roles", action: "roles:read" },
    ],
  },
  {
    label: "Inventory",
    url: "/dashboard/inventory",
    //action: "inventory:view",
    children: [
      {
        label: "Categories",
        url: "/dashboard/inventory/categories",
        action: "categories:read",
      },
      {
        label: "Products",
        url: "/dashboard/inventory/products",
        action: "products:read",
      },
    ],
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

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url, action, children }) => {
              const current = pathName.split("/").slice(0, 3).join("/") === url;
              if (children && children.length > 0) {
                // check children if any permission is included
                const hasPermission = children.some(({ action = "" }) =>
                  permissions.includes(action),
                );
                if (!hasPermission) {
                  return null;
                }
                return (
                  <Dropdown key={label + "dropdown"}>
                    <DropdownButton current={current} as={NavbarItem}>
                      {label}
                      <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu>
                      {children.map(
                        ({ label: childLabel, url: childUrl, action = "" }) => (
                          <DropdownItem
                            key={childLabel + "dropdownitem"}
                            href={childUrl}
                            disabled={pathName === childUrl}
                            className={
                              permissions.includes(action) ? "" : "hidden"
                            }
                          >
                            {childLabel}
                          </DropdownItem>
                        ),
                      )}
                    </DropdownMenu>
                  </Dropdown>
                );
              }

              return (
                <NavbarItem
                  key={label + "navbaritem"}
                  href={url}
                  current={pathName === url}
                  className={permissions.includes(action!) ? "" : "hidden"}
                >
                  {label}
                </NavbarItem>
              );
            })}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
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
                {/* <DropdownItem href="/dashboard/account/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider /> */}

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
                    <div key={label + "sidebarsection"}>
                      {children.map(
                        ({ label: childLabel, url: childUrl, action = "" }) => (
                          <SidebarItem
                            current={pathName === childUrl}
                            key={childLabel + "sidebar"}
                            href={childUrl}
                            className={
                              permissions.includes(action) ? "" : "hidden"
                            }
                          >
                            {childLabel}
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
                    key={label + "sidebar"}
                    href={url}
                    current={pathName === url}
                  >
                    {label}
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
