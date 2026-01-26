# @CurrentUser() Decorator Usage Guide

## Overview

The `@CurrentUser()` decorator extracts the authenticated user from the request object. It must be used with `@UseGuards(JwtAuthGuard)` to ensure the user is authenticated.

## Import 1

```typescript
import { CurrentUser } from './modules/auth/current-user.decorator';
import { UserDocument } from './modules/user/schemas/user.schema';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
```

## Basic Usage

### Get the Full User Object

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: UserDocument) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
```

### Get Specific User Property

```typescript
@UseGuards(JwtAuthGuard)
@Get('user-id')
getUserId(@CurrentUser('_id') userId: string) {
  return { userId };
}

@UseGuards(JwtAuthGuard)
@Get('user-email')
getUserEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

## Real-World Examples

### Example 1: Create Order with Current User

```typescript
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @CurrentUser() user: UserDocument,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return await this.orderService.create({
      ...createOrderDto,
      userId: user._id,
      userEmail: user.email,
    });
  }
}
```

### Example 2: Get User's Own Orders

```typescript
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@CurrentUser('_id') userId: string) {
    return await this.orderService.findByUserId(userId);
  }
}
```

### Example 3: Update User Profile

```typescript
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: UserDocument,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return await this.userService.update(user._id.toString(), updateDto);
  }
}
```

### Example 4: Permission Check with Current User

```typescript
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOrder(
    @CurrentUser() user: UserDocument,
    @Param('id') orderId: string,
  ) {
    const order = await this.orderService.findOne(orderId);

    // Check if user owns the order or is admin
    if (order.userId !== user._id.toString() && user.role.name !== 'Admin') {
      throw new ForbiddenException('You can only delete your own orders');
    }

    return await this.orderService.delete(orderId);
  }
}
```

### Example 5: Audit Logging

```typescript
@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private auditService: AuditService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(
    @CurrentUser() user: UserDocument,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.productService.create(createProductDto);

    // Log the action
    await this.auditService.log({
      action: 'CREATE_PRODUCT',
      userId: user._id,
      userName: user.name,
      resourceId: product._id,
      resourceType: 'Product',
    });

    return product;
  }
}
```

## Comparison: @Request() vs @CurrentUser()

### ❌ Old Way (Using @Request())

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  const user = req.user;  // No type safety
  return user;
}
```

### ✅ New Way (Using @CurrentUser())

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: UserDocument) {
  // Full type safety and autocomplete
  return user;
}
```

## Benefits

✅ **Type Safety**: Full TypeScript support with UserDocument type
✅ **Cleaner Code**: No need to extract user from request
✅ **Reusable**: Works across all controllers
✅ **Flexible**: Can extract specific properties
✅ **Documented**: Clear intent that endpoint requires authentication

## Common Patterns

### Pattern 1: Combine with Other Decorators

```typescript
@UseGuards(JwtAuthGuard)
@Post(':id/comment')
async addComment(
  @CurrentUser() user: UserDocument,
  @Param('id') postId: string,
  @Body() commentDto: CreateCommentDto,
) {
  return await this.commentService.create({
    ...commentDto,
    postId,
    authorId: user._id,
    authorName: user.name,
  });
}
```

### Pattern 2: Extract Multiple User Properties

```typescript
@UseGuards(JwtAuthGuard)
@Get('dashboard')
async getDashboard(
  @CurrentUser('_id') userId: string,
  @CurrentUser('role') role: any,
) {
  return await this.dashboardService.getDataForUser(userId, role);
}
```

### Pattern 3: Optional User (Public Endpoints)

For endpoints that work for both authenticated and guest users:

```typescript
@Get('products')
async getProducts(
  @CurrentUser() user?: UserDocument,  // Optional
) {
  if (user) {
    // Return personalized products
    return await this.productService.getPersonalized(user._id);
  } else {
    // Return default products
    return await this.productService.getPublic();
  }
}
```

## Important Notes

⚠️ **Must use with JwtAuthGuard**: The decorator requires `@UseGuards(JwtAuthGuard)` to populate `req.user`

⚠️ **Type is UserDocument**: Always use `UserDocument` type for full MongoDB document support (includes `_id`, `createdAt`, etc.)

⚠️ **Works with cookies or Bearer tokens**: The JWT strategy extracts tokens from both Authorization header and cookies

## Testing

### Unit Tests

```typescript
describe('OrderController', () => {
  it('should create order with current user', async () => {
    const mockUser = {
      _id: new Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com',
    } as UserDocument;

    const result = await controller.createOrder(mockUser, createOrderDto);

    expect(result.userId).toBe(mockUser._id);
  });
});
```

### E2E Tests

```typescript
it('/orders (POST) - authenticated', () => {
  return request(app.getHttpServer())
    .post('/orders')
    .set('Authorization', `Bearer ${accessToken}`) // or cookie
    .send(createOrderDto)
    .expect(201);
});
```

## Summary

The `@CurrentUser()` decorator provides:

- ✅ Clean, type-safe access to authenticated user
- ✅ Works with both cookies and Bearer tokens
- ✅ Flexible property extraction
- ✅ Better code readability
- ✅ Consistent pattern across all controllers

Replace `@Request() req` + `req.user` with `@CurrentUser() user` for better code quality!
