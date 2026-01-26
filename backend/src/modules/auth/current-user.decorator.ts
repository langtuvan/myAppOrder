import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../user/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as User;
  },
);

// export const CurrentUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req?.user as User; // this gets the user from the request object
//   },
// );

