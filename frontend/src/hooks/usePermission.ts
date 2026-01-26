"use client";

import { useAuth } from "./useAuth";
import { OrderStatus } from "./useOrders";

// ----------------------------------------------------------------------

export function usePermission() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Convenience methods for common resources
    canViewOrders: () => hasPermission("orders", "orders:read"),
    canCreateOrders: () => hasPermission("orders", "orders:create"),
    canEditOrders: () => hasPermission("orders", "orders:update"),
    canDeleteOrders: () => hasPermission("orders", "orders:delete"),
    canRestoreOrders: () => hasPermission("orders", "orders:restore"),
    // specific order actions
    canConfirmOrders: () =>
      hasPermission("orders", "orders:" + OrderStatus.CONFIRMED),
    canExportOrders: () =>
      hasPermission("orders", "orders:" + OrderStatus.EXPORTED),
    canDeliverOrders: () =>
      hasPermission("orders", "orders:" + OrderStatus.DELIVERED),
    canCompleteOrders: () =>
      hasPermission("orders", "orders:" + OrderStatus.COMPLETED),
    canCancelOrders: () =>
      hasPermission("orders", "orders:" + OrderStatus.CANCELLED),
    // products
    canViewProducts: () => hasPermission("products", "products:read"),
    canCreateProducts: () => hasPermission("products", "products:create"),
    canEditProducts: () => hasPermission("products", "products:update"),
    canDeleteProducts: () => hasPermission("products", "products:delete"),
    canRestoreProducts: () => hasPermission("products", "products:restore"),
    // categories
    canViewCategories: () => hasPermission("categories", "categories:read"),
    canCreateCategories: () => hasPermission("categories", "categories:create"),
    canEditCategories: () => hasPermission("categories", "categories:update"),
    canDeleteCategories: () => hasPermission("categories", "categories:delete"),
    canRestoreCategories: () =>
      hasPermission("categories", "categories:restore"),
    // users
    canViewUsers: () => hasPermission("users", "users:read"),
    canCreateUsers: () => hasPermission("users", "users:create"),
    canEditUsers: () => hasPermission("users", "users:update"),
    canDeleteUsers: () => hasPermission("users", "users:delete"),
    canRestoreUsers: () => hasPermission("users", "users:restore"),
    // roles
    canViewRoles: () => hasPermission("roles", "roles:read"),
    // customers
    canViewCustomers: () => hasPermission("customers", "customers:read"),
    canCreateCustomers: () => hasPermission("customers", "customers:create"),
    canEditCustomers: () => hasPermission("customers", "customers:update"),
    canDeleteCustomers: () => hasPermission("customers", "customers:delete"),
    canRestoreCustomers: () => hasPermission("customers", "customers:restore"),
    // items
    canViewItems: () => hasPermission("items", "items:read"),
    canCreateItems: () => hasPermission("items", "items:create"),
    canEditItems: () => hasPermission("items", "items:update"),
    canDeleteItems: () => hasPermission("items", "items:delete"),
    canRestoreItems: () => hasPermission("items", "items:restore"),
  };
}
