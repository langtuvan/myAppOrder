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
    // warehouses
    canViewWarehouses: () => hasPermission("warehouses", "warehouses:read"),
    canCreateWarehouses: () => hasPermission("warehouses", "warehouses:create"),
    canEditWarehouses: () => hasPermission("warehouses", "warehouses:update"),
    canDeleteWarehouses: () => hasPermission("warehouses", "warehouses:delete"),
    canRestoreWarehouses: () =>
      hasPermission("warehouses", "warehouses:restore"),
    // suppliers
    canViewSuppliers: () => hasPermission("suppliers", "suppliers:read"),
    canCreateSuppliers: () => hasPermission("suppliers", "suppliers:create"),
    canEditSuppliers: () => hasPermission("suppliers", "suppliers:update"),
    canDeleteSuppliers: () => hasPermission("suppliers", "suppliers:delete"),
    canRestoreSuppliers: () => hasPermission("suppliers", "suppliers:restore"),
    // goods receipts
    canViewGoodsReceipts: () =>
      hasPermission("goodsReceipts", "goodsReceipts:read"),
    canCreateGoodsReceipts: () =>
      hasPermission("goodsReceipts", "goodsReceipts:create"),
    canEditGoodsReceipts: () =>
      hasPermission("goodsReceipts", "goodsReceipts:update"),
    canDeleteGoodsReceipts: () =>
      hasPermission("goodsReceipts", "goodsReceipts:delete"),
  };
}
