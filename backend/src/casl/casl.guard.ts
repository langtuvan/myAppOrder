import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory';
import {
  CHECK_PERMISSION,
  PermissionMetadata,
} from './check-permission.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get permission metadata from @CheckPermission decorator
    const permissionMetadata =
      this.reflector.getAllAndOverride<PermissionMetadata>(CHECK_PERMISSION, [
        context.getHandler(),
        context.getClass(),
      ]);

    // If no permission metadata, allow access (public route)
    if (!permissionMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, deny access
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Build user ability from their role's permissions
    const ability = this.caslAbilityFactory.createForUser(user);

    // Check if user can perform required action on subject
    const { action, subject } = permissionMetadata;

    if (!ability.can(subject, action)) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${subject}`,
      );
    }

    return true;
  }
}
