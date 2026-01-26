# CASL Authorization Implementation

## Overview

CASL (Component Ability Service Layer) has been integrated into the backend to provide enterprise-grade role-based access control (RBAC).

## Files Created/Modified

### CASL Core Files (in `src/casl/`)

#### 1. `casl-ability.factory.ts`

- **Purpose**: Maps user roles and permissions to CASL abilities
- **Key Features**:
  - Detects super admin users and grants full `manage:all` permissions
  - Builds abilities based on user's role and permissions
  - Parses permission actions in format: `resource:action` (e.g., `users:create`)
  - Grants public read-only access to guests: `read:categories`, `read:products`

#### 2. `check-permission.decorator.ts`

##

- **Purpose**: Route decorator for specifying required permissions
- **Supported Formats**:
  - `@CheckPermission('users', 'create')` - separate resource and action
  - `@CheckPermission('users:create')` - combined format
- **Usage**: Applied to controller methods to define permission requirements

#### 3. `casl.guard.ts`

- **Purpose**: NestJS guard that enforces permission checks
- **Features**:
  - Implements `CanActivate` interface
  - Checks if route is public (skips permission check)
  - Retrieves `@CheckPermission` metadata
  - Validates user ability against required permissions
  - Throws `ForbiddenException` if unauthorized

#### 4. `casl.module.ts`

- **Purpose**: NestJS module that exports CASL services
- **Exports**: `CaslAbilityFactory`, `CaslGuard`

#### 5. `index.ts`

- **Purpose**: Barrel export for all CASL components

### Modified Files

#### `src/app.module.ts`

- Imported `CaslModule` and `CaslGuard`
- Registered `CaslGuard` as global `APP_GUARD` (runs after JWT auth)

#### Controller Updates (all in `src/modules/*/`)

Added `@CheckPermission` decorators to all CRUD operations:

**UserController**:

- `POST /users` → `@CheckPermission('users', 'create')`
- `GET /users` → `@CheckPermission('users', 'read')`
- `GET /users/:id` → `@CheckPermission('users', 'read')`
- `PATCH /users/:id` → `@CheckPermission('users', 'update')`
- `DELETE /users/:id` → `@CheckPermission('users', 'delete')`
- `PUT /users/:id/restore` → `@CheckPermission('users', 'update')`

**RoleController**:

- `POST /roles` → `@CheckPermission('roles', 'create')`
- `GET /roles` → `@CheckPermission('roles', 'read')`
- `GET /roles/:id` → `@CheckPermission('roles', 'read')`
- `PATCH /roles/:id` → `@CheckPermission('roles', 'update')`
- `DELETE /roles/:id` → `@CheckPermission('roles', 'delete')`
- `PUT /roles/:id/restore` → `@CheckPermission('roles', 'update')`
- `PUT /roles/:roleId/permissions/:permissionId` → `@CheckPermission('roles', 'update')`
- `DELETE /roles/:roleId/permissions/:permissionId` → `@CheckPermission('roles', 'update')`

**PermissionController**:

- `POST /permissions` → `@CheckPermission('permissions', 'create')`
- `GET /permissions` → `@CheckPermission('permissions', 'read')`
- `GET /permissions/:id` → `@CheckPermission('permissions', 'read')`
- `PATCH /permissions/:id` → `@CheckPermission('permissions', 'update')`
- `DELETE /permissions/:id` → `@CheckPermission('permissions', 'delete')`
- `PUT /permissions/:id/restore` → `@CheckPermission('permissions', 'update')`

**ModuleController**:

- `POST /modules` → `@CheckPermission('modules', 'create')`
- `GET /modules` → `@CheckPermission('modules', 'read')`
- `GET /modules/stats` → `@CheckPermission('modules', 'read')`
- `GET /modules/:id` → `@CheckPermission('modules', 'read')`
- `PATCH /modules/:id` → `@CheckPermission('modules', 'update')`
- `DELETE /modules/:id` → `@CheckPermission('modules', 'delete')`
- `PUT /modules/:id/restore` → `@CheckPermission('modules', 'update')`

## Permission Format

Permissions are stored in the database with an `action` field following the pattern:

```
resource:action
```

Examples:

- `users:create` - Create users
- `users:read` - Read users
- `users:update` - Update users
- `users:delete` - Delete users
- `roles:create` - Create roles
- `permissions:read` - Read permissions
- `modules:update` - Update modules

## Guard Execution Flow

1. **JWT Guard** (runs first)
   - Validates JWT token
   - Attaches `user` to request

2. **CASL Guard** (runs second)
   - Checks if route is marked with `@Public()` - allows access
   - Checks if route has `@CheckPermission` metadata
   - If no metadata, allows access (public route)
   - If metadata exists:
     - Builds user ability from their role's permissions
     - Checks if user can perform required action on resource
     - Throws `ForbiddenException` if denied

## Super Admin Handling

Users with role name "SuperAdmin" automatically get full permissions:

- Can perform any action (`manage`) on any resource (`all`)

## Public Resources

Unauthenticated guests can only:

- Read categories
- Read products

## Testing

To test authorization:

1. Create a role with specific permissions (e.g., only `users:read`)
2. Create a user with that role
3. Try accessing endpoints:
   - `GET /users` → ✓ Allowed (has `users:read`)
   - `POST /users` → ✗ Forbidden (no `users:create`)
   - `DELETE /users/:id` → ✗ Forbidden (no `users:delete`)

## Configuration

No additional configuration needed. CASL is:

- Globally registered via `APP_GUARD` in `app.module.ts`
- Uses string-based subjects for simplicity
- Permission format validation happens in permission DTOs

## Future Enhancements

- Add conditional permissions (e.g., "can only delete own posts")
- Add policy-based rules for complex scenarios
- Frontend permission checking with CASL client
- Permission seeding for common role templates
