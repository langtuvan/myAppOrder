// ==============================
// ROUTER PATHS - Booking System
// ==============================

import { reset } from "numeral";

export const paths = {
  // Root & Auth
  root: "/",

  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  booking: {
    root: "/booking",
    list: "/booking",
  },

  // Dashboard
  dashboard: {
    root: "/dashboard",
    analytics: "/dashboard/analytics",
    reports: "/dashboard/reports",

    orders: {
      root: "/dashboard/orders",
      list: "/dashboard/orders",
      create: "/dashboard/orders/add",
      edit: (id: string) => `/dashboard/orders/edit/${id}`,
      view: (id: string) => `/dashboard/orders/${id}`,
      // confirm orders
      confirmList: "/dashboard/orders/confirm",
      confirm: (id: string) => `/dashboard/orders/confirm/${id}`,

      // export orders
      exportList: "/dashboard/orders/export",
      export: (id: string) => `/dashboard/orders/export/${id}`,
      // delivery orders
      deliveryList: "/dashboard/orders/delivery",
      delivery: (id: string) => `/dashboard/orders/delivery/${id}`,
      // complete orders
      completeList: "/dashboard/orders/complete",
      complete: (id: string, searchQuery: string) =>
        `/dashboard/orders/complete/${id}?${searchQuery}`,
    },
    system: {
      // User Management
      users: {
        root: "/dashboard/system/users",
        list: "/dashboard/system/users",
        create: "/dashboard/system/users/add",
        view: (id: string) => `/dashboard/system/users/${id}/view`,
        edit: (id: string) => `/dashboard/system/users/${id}/edit`,
        resetPassword: (id: string) =>
          `/dashboard/system/users/${id}/resetPassword`,
        delete: (id: string) => `/dashboard/system/users/${id}/delete`,
        restore: (id: string) => `/dashboard/system/users/${id}/restore`,
        profile: "/dashboard/system/users/profile",
      },
      // Roles
      roles: {
        root: "/dashboard/system/roles",
        list: "/dashboard/system/roles",
        create: "/dashboard/system/roles/create",
        edit: (id: string) => `/dashboard/system/roles/${id}/edit`,
        delete: (id: string) => `/dashboard/system/roles/${id}/delete`,
        view: (id: string) => `/dashboard/system/roles/${id}`,
      },
    },
    inventory: {
      root: "/dashboard/inventory",
      categories: {
        root: "/dashboard/inventory/categories",
        list: "/dashboard/inventory/categories",
        create: "/dashboard/inventory/categories/add",
        edit: (id: string) => `/dashboard/inventory/categories/${id}/edit`,
        view: (id: string) => `/dashboard/inventory/categories/${id}`,
        delete: (id: string) => `/dashboard/inventory/categories/${id}/delete`,
        restore: (id: string) =>
          `/dashboard/inventory/categories/${id}/restore`,
      },

      products: {
        root: "/dashboard/inventory/products",
        list: "/dashboard/inventory/products",
        create: "/dashboard/inventory/products/add",
        edit: (id: string) => `/dashboard/inventory/products/${id}/edit`,
        view: (id: string) => `/dashboard/inventory/products/${id}`,
        delete: (id: string) => `/dashboard/inventory/products/${id}/delete`,
        restore: (id: string) => `/dashboard/inventory/products/${id}/restore`,
      },
    },
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
  },

  // Reports & Analytics
  reports: {
    root: "/reports",
    sales: "/reports/sales",
    orders: "/reports/orders",
    inventory: "/reports/inventory",
    users: "/reports/users",
    custom: "/reports/custom",
  },

  // Settings
  settings: {
    root: "/settings",
    general: "/settings/general",
    profile: "/settings/profile",
    preferences: "/settings/preferences",
    notifications: "/settings/notifications",
    security: "/settings/security",
    billing: "/settings/billing",
  },

  // API Endpoints (for axios calls)
  api: {
    base: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      refresh: "/auth/refresh",
      me: "/auth/me",
    },

    orders: {
      base: "/orders",
      list: "/orders",
      create: "/orders",
      update: (id: string) => `/orders/${id}`,
      delete: (id: string) => `/orders/${id}`,
      status: (id: string) => `/orders/${id}/status`,
      cancel: (id: string) => `/orders/${id}/cancel`,
    },

    categories: {
      base: "/categories",
      list: "/categories",
      create: "/categories",
      update: (id: string) => `/categories/${id}`,
      delete: (id: string) => `/categories/${id}`,
    },

    products: {
      base: "/products",
      list: "/products",
      create: "/products",
      update: (id: string) => `/products/${id}`,
      delete: (id: string) => `/products/${id}`,
    },

    users: {
      base: "/user",
      list: "/user",
      create: "/user",
      update: (id: string) => `/user/${id}`,
      delete: (id: string) => `/user/${id}`,
      restore: (id: string) => `/user/${id}/restore`,
    },

    roles: {
      base: "/roles",
      list: "/roles",
      create: "/roles",
      update: (id: string) => `/roles/${id}`,
      delete: (id: string) => `/roles/${id}`,
      restore: (id: string) => `/roles/${id}/restore`,
      addPermission: (roleId: string, permissionId: string) =>
        `/roles/${roleId}/permissions/${permissionId}`,
      removePermission: (roleId: string, permissionId: string) =>
        `/roles/${roleId}/permissions/${permissionId}`,
    },

    permissions: {
      base: "/permissions",
      list: "/permissions",
      create: "/permissions",
      update: (id: string) => `/permissions/${id}`,
      delete: (id: string) => `/permissions/${id}`,
      restore: (id: string) => `/permissions/${id}/restore`,
    },
  },
};

export default paths;
