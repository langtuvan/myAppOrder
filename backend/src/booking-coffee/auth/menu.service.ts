import { Injectable } from '@nestjs/common';
import { Permission } from '../permission/schemas/permission.schema';

export interface MenuItem {
  id: string;
  label: { en: string; vi?: string } | string;
  icon: string;
  path?: string;
  module?: string;
  permissions?: string[];
  children?: MenuItem[];
}

@Injectable()
export class MenuService {
  private readonly fullMenu: MenuItem[] = [
    {
      id: 'inventory',
      label: {
        en: 'Inventory',
        vi: 'Quản Lý Hàng Tồn',
      },
      icon: 'CubeIcon',
      module: 'inventory',
      children: [
        {
          id: 'categories',
          label: {
            en: 'Categories',
            vi: 'Danh Mục',
          },
          icon: 'TagIcon',
          path: '/inventory/categories',
          module: 'categories',
          permissions: ['categories:read'],
        },
        {
          id: 'comboboxes',
          label: {
            en: 'Combo',
            vi: 'Combo',
          },
          icon: 'ArchiveBoxIcon',
          path: '/inventory/comboxes',
          module: 'products',
          permissions: ['products:read'],
        },

        {
          id: 'products',
          label: {
            en: 'Products',
            vi: 'Sản Phẩm',
          },
          icon: 'ArchiveBoxIcon',
          path: '/inventory/products',
          module: 'products',
          permissions: ['products:read'],
        },
        // {
        //   id: 'inventory-stock',
        //   label: 'Stock Management',
        //   icon: 'ChartBarIcon',
        //   path: '/inventory/stock',
        //   module: 'inventory',
        //   permissions: ['products:update', 'inventory:manage'],
        // },
      ],
    },
    {
      id: 'user-management',
      label: {
        en: 'User Management',
        vi: 'Quản Lý Người Dùng',
      },
      icon: 'UsersIcon',
      module: 'users',
      permissions: ['users:read', 'roles:read', 'permissions:read'],
      children: [
        {
          id: 'users',
          label: {
            en: 'Users',
            vi: 'Người Dùng',
          },
          icon: 'UserIcon',
          path: '/users',
          module: 'users',
          permissions: ['users:read'],
        },
        // {
        //   id: 'users-create',
        //   label: 'Add User',
        //   icon: 'UserPlusIcon',
        //   path: '/users/create',
        //   module: 'users',
        //   permissions: ['users:create'],
        // },
        // {
        //   id: 'users-bulk',
        //   label: 'Bulk Operations',
        //   icon: 'DocumentDuplicateIcon',
        //   path: '/users/bulk',
        //   module: 'users',
        //   permissions: ['users:create', 'users:update', 'users:delete'],
        // },
      ],
    },
    {
      id: 'role-management',
      label: {
        en: 'Role Management',
        vi: 'Quản Lý Vai Trò',
      },
      icon: 'ShieldCheckIcon',
      module: 'roles',
      permissions: ['roles:read'],
      children: [
        {
          id: 'roles',
          label: {
            en: 'Roles',
            vi: 'Vai Trò',
          },
          icon: 'IdentificationIcon',
          path: '/roles',
          module: 'roles',
          permissions: ['roles:read'],
        },
        {
          id: 'permissions',
          label: {
            en: 'Permissions',
            vi: 'Quyền',
          },
          icon: 'KeyIcon',
          path: '/permissions',
          module: 'permissions',
          permissions: ['permissions:read'],
        },
      ],
    },
    // faculties and room
    {
      id: 'faculties-management',
      label: {
        en: 'faculties Management',
        vi: 'Quản Lý Cơ Sở Vật Chất',
      },
      icon: 'BuildingLibraryIcon',
      module: 'faculties',
      permissions: ['faculties:read'],
      children: [
        {
          id: 'faculties',
          label: {
            en: 'faculties',
            vi: 'Cơ Sở ',
          },
          icon: 'BuildingOfficeIcon',
          path: '/faculties',
          module: 'faculties',
          permissions: ['faculties:read'],
        },
        {
          id: 'amenities',
          label: {
            en: 'amenities',
            vi: 'Tiện Nghi',
          },
          icon: 'BuildingOffice2Icon',
          path: '/amenities',
          module: 'faculties',
          permissions: ['faculties:read'],
        },
      ],
    },
    // bookings
    {
      id: 'bookings-management',
      label: {
        en: 'Bookings Management',
        vi: 'Quản Lý Đặt Chỗ',
      },
      icon: 'CalendarIcon',
      module: 'bookings',
      permissions: ['bookings:read'],
      children: [
        {
          id: 'bookings',
          label: {
            en: 'List',
            vi: 'Đặt Chỗ',
          },
          icon: 'CalendarIcon',
          path: '/bookings/list',
          module: 'bookings',
          permissions: ['bookings:read'],
        },
      ],
    },
    //reports
    {
      id: 'reports',
      label: {
        en: 'Reports',
        vi: 'Báo Cáo',
      },
      icon: 'ChartPieIcon',
      module: 'reports',
      permissions: ['reports:read'],
      children: [
        {
          id: 'sales-report',
          label: {
            en: 'Sales Report',
            vi: 'Báo Cáo Bán Hàng',
          },
          path: '/reports/sales',
          module: 'reports',
          permissions: ['reports:read', 'sales:read'],
          icon: 'CurrencyDollarIcon',
        },
      ],
    },

    // {
    //   id: 'access-control',
    //   label: 'Access Control',
    //   icon: 'ShieldExclamationIcon',
    //   module: 'access',
    //   permissions: ['access:read', 'audit:read'],
    //   children: [
    //     {
    //       id: 'access-logs',
    //       label: 'Access Logs',
    //       icon: 'DocumentTextIcon',
    //       path: '/access/logs',
    //       module: 'access',
    //       permissions: ['access:read', 'audit:read'],
    //     },
    //     {
    //       id: 'login-attempts',
    //       label: 'Login Attempts',
    //       icon: 'ExclamationTriangleIcon',
    //       path: '/access/login-attempts',
    //       module: 'access',
    //       permissions: ['access:read', 'security:monitor'],
    //     },
    //     {
    //       id: 'session-management',
    //       label: 'Active Sessions',
    //       icon: 'ClockIcon',
    //       path: '/access/sessions',
    //       module: 'access',
    //       permissions: ['access:read', 'session:manage'],
    //     },
    //     {
    //       id: 'security-alerts',
    //       label: 'Security Alerts',
    //       icon: 'BellAlertIcon',
    //       path: '/access/alerts',
    //       module: 'access',
    //       permissions: ['security:read', 'alert:manage'],
    //     },
    //   ],
    // },
    // {
    //   id: 'system-administration',
    //   label: 'System Administration',
    //   icon: 'WrenchScrewdriverIcon',
    //   module: 'admin',
    //   permissions: ['admin:read', 'system:manage'],
    //   children: [
    //     {
    //       id: 'system-settings',
    //       label: 'System Settings',
    //       icon: 'CogIcon',
    //       path: '/admin/settings',
    //       module: 'admin',
    //       permissions: ['admin:settings', 'system:configure'],
    //     },
    //     {
    //       id: 'backup-restore',
    //       label: 'Backup & Restore',
    //       icon: 'CloudArrowUpIcon',
    //       path: '/admin/backup',
    //       module: 'admin',
    //       permissions: ['admin:backup', 'system:backup'],
    //     },
    //     {
    //       id: 'system-logs',
    //       label: 'System Logs',
    //       icon: 'DocumentTextIcon',
    //       path: '/admin/logs',
    //       module: 'admin',
    //       permissions: ['admin:logs', 'system:logs'],
    //     },
    //     {
    //       id: 'maintenance',
    //       label: 'Maintenance Mode',
    //       icon: 'WrenchIcon',
    //       path: '/admin/maintenance',
    //       module: 'admin',
    //       permissions: ['admin:maintenance', 'system:maintain'],
    //     },
    //   ],
    // },
    // {
    //   id: 'reports-analytics',
    //   label: {
    //     en: 'Reports & Analytics',
    //     vi: 'Báo Cáo & Phân Tích',
    //   },
    //   icon: 'ChartBarIcon',
    //   module: 'reports',
    //   permissions: ['reports:read'],
    //   children: [
    //     {
    //       id: 'user-reports',
    //       label: {
    //         en: 'User Reports',
    //         vi: 'Báo Cáo Người Dùng',
    //       },
    //       icon: 'UserGroupIcon',
    //       path: '/reports/users',
    //       module: 'reports',
    //       permissions: ['reports:read', 'users:read'],
    //     },

    //     {
    //       id: 'order-reports',
    //       label: {
    //         en: 'Order Reports',
    //         vi: 'Báo Cáo Đơn Hàng',
    //       },
    //       icon: 'CurrencyDollarIcon',
    //       path: '/reports/orders',
    //       module: 'reports',
    //       permissions: ['reports:read', 'orders:read'],
    //     },
    //   ],
    // },
  ];

  generateMenu(permissions: string[]): MenuItem[] {
    const userPermissions = new Set(permissions);

    const filterMenu = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          // Check if user has any of the required permissions for this item
          if (item.permissions && item.permissions.length > 0) {
            const hasPermission = item.permissions.some((perm) =>
              userPermissions.has(perm),
            );
            if (!hasPermission) return null;
          }

          // Process children recursively
          if (item.children && item.children.length > 0) {
            const filteredChildren = filterMenu(item.children);

            // If parent has no permissions but children do, show parent only if children are visible
            if (filteredChildren.length === 0) {
              // If parent item has no permissions and no visible children, hide it
              if (!item.permissions || item.permissions.length === 0) {
                return null;
              }
            }

            return { ...item, children: filteredChildren };
          }

          return item;
        })
        .filter(Boolean) as MenuItem[];
    };

    return this.fullMenu;
    return filterMenu(this.fullMenu);
  }

  // Get menu items by module for specific feature access
  getMenuByModule(module: string, permissions: string[]): MenuItem[] {
    const fullMenu = this.generateMenu(permissions);

    const findByModule = (items: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = [];

      for (const item of items) {
        if (item.module === module) {
          result.push(item);
        }

        if (item.children) {
          result.push(...findByModule(item.children));
        }
      }

      return result;
    };

    return findByModule(fullMenu);
  }

  // Get all available permissions from menu structure
  getAllMenuPermissions(): string[] {
    const permissions = new Set<string>();

    const extractPermissions = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.permissions) {
          item.permissions.forEach((perm) => permissions.add(perm));
        }

        if (item.children) {
          extractPermissions(item.children);
        }
      }
    };

    extractPermissions(this.fullMenu);
    return Array.from(permissions);
  }

  // Get menu breadcrumb path for a specific menu item
  getMenuBreadcrumb(menuId: string): MenuItem[] {
    const breadcrumb: MenuItem[] = [];

    const findPath = (items: MenuItem[], path: MenuItem[]): boolean => {
      for (const item of items) {
        const currentPath = [...path, item];

        if (item.id === menuId) {
          breadcrumb.push(...currentPath);
          return true;
        }

        if (item.children && findPath(item.children, currentPath)) {
          return true;
        }
      }

      return false;
    };

    findPath(this.fullMenu, []);
    return breadcrumb;
  }
}
