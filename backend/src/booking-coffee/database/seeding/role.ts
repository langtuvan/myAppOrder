export const rolesSeeding = [
  {
    name: 'administrator',
    description: 'Full system administrator with all permissions',
    isActive: true,
  },
  {
    name: 'admin',
    description: 'System admin with elevated permissions',
    isActive: true,
  },
  {
    name: 'manager',
    description: 'Manager with order and inventory management permissions',
    isActive: true,
  },
  {
    name: 'customer',
    description: 'Regular customer with order placement permissions',
    isActive: true,
  },
  {
    name: 'recipient',
    description: 'recipient with front desk management permissions',
    isActive: true,
  },
  {
    name: 'examiner',
    description: 'Examiner with examination management permissions',
    isActive: true,
  },
  {
    name: 'warehouse staff',
    description: 'Warehouse staff with inventory management permissions',
    isActive: true,
  },
];

export const Actions = {
  admin: [],
  customer: [],
  manager: ['receptions:manager', 'exams:manager', 'items:manager'],
  recipient: [
    'receptions:read',
    'exams:read',
    'items:read',
    'items:create',
    'items:update',
    'items:delete',
  ],
  examiner: ['exams:read', 'exams:create', 'exams:update'],
  warehouseStaff: [
    'receptions:read',
    'exams:read',
    'items:read',
    'items:update',
  ],
};
