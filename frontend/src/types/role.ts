export interface Role {
  _id: string;
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  deleted: boolean;
  permissions: Permission[] | string[];
  createdAt: string;
  updatedAt: string;
}

export type Module = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  apiPrefix: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  deleted: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
};

export interface Permission {
  _id: string;
  id: string;
  name: string;
  action: string;
  module: string | Module;
  method?: string;
  apiPath?: string;
  description?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
   description: string;
   isActive: boolean;
   permissions: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface CreatePermissionDto {
  name: string;
  action: string;
  module: string;
  method?: string;
  apiPath?: string;
  description?: string;
}

export interface UpdatePermissionDto {
  name?: string;
  action?: string;
  module?: string;
  method?: string;
  apiPath?: string;
  description?: string;
}

export interface CreateModuleDto {
  name: string;
  description?: string;
  apiPrefix: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateModuleDto {
  name?: string;
  description?: string;
  apiPrefix?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ModuleStats {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}
