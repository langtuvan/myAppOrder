import { ExecutionContext, Injectable } from '@nestjs/common';
//import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // // Allow static files (non-API routes)
    const request = context.switchToHttp().getRequest();

    // Cho phép truy cập /uploads mà không cần auth
    if (request.url.startsWith('/upload')) {
      return true;
    }

    if (!request.url.startsWith('/api')) {
      return true;
    }

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  //   getRequest(context: ExecutionContext) {
  //     const ctx = GqlExecutionContext.create(context);
  //     return ctx.getContext().req;
  //   } // GraphQL support can be added later]
}
