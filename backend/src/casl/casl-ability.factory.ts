import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { UserDocument } from '../modules/user/schemas/user.schema';

export type AppAbility = Ability<[string, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDocument): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    );

    // Check if user is super admin
    const isSuperAdmin = (user.role as any)?.name === 'SuperAdmin';

    if (isSuperAdmin) {
      // Super admin can do everything
      can('manage', 'all');
      return build();
    }

    // Build abilities based on user's role and permissions
    const role = user.role as any;

    if (role && role.permissions && Array.isArray(role.permissions)) {
      role.permissions.forEach((permission: any) => {
        // Permission action format: 'users:create', 'users:read', etc.
        if (permission.action) {
          const [resource, action] = permission.action.split(':');
          if (resource && action) {
            can(action, resource);
          }
        }
      });
    }

    // Guest users can only read public resources
    if (!role || !role.permissions || role.permissions.length === 0) {
      can('create', 'orders');
    }
    can('read', 'categories');
    can('read', 'products');
    can('read', 'productServices');
    return build();
  }
}
