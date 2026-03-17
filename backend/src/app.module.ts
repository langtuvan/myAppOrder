import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './booking-coffee/category/category.module';
import { ProductModule } from './booking-coffee/product/product.module';
import { OrderModule } from './booking-coffee/orderItem/order.module';
import { UserModule } from './booking-coffee/user/user.module';
import { RoleModule } from './booking-coffee/role/role.module';
import { PermissionModule } from './booking-coffee/permission/permission.module';
import { ModuleModule } from './booking-coffee/module/module.module';
import { AuthModule } from './booking-coffee/auth/auth.module';
import { DatabaseModule } from './booking-coffee/database/database.module';
import { CustomerModule } from './booking-coffee/customer/customer.module';
import { FacultyModule } from './booking-hospital/faculty/faculty.module';

import { LoggerModule } from './logger/logger.module';
import { ProductServiceModule } from './booking-coffee/product-service/product-service.module';
import { RoomModule } from './booking-coffee/room/room.module';
import { JwtAuthGuard } from './booking-coffee/auth/jwt-auth.guard';
import { CaslModule, CaslGuard } from './casl';
import { mongooseConfig } from './config/mongoose.config';
import { MongooseErrorInterceptor } from './interceptor/mongooseErrorInterceptor';
import { ItemModule } from './booking-coffee/item/item.module';
import { AmenitiesModule } from './booking-hospital/amenities/amenities.module';

import { HealthModule } from './health/health.module';
import { WarehousesModule } from './booking-coffee/warehouses/warehouses.module';
import { InventoryModule } from './booking-coffee/inventory/inventory.module';
import { InventoryTransactionsModule } from './booking-coffee/inventory_transactions/inventory_transactions.module';
import { GoodsReceiptsModule } from './booking-coffee/goods_receipts/goods-receipts.module';
import { GoodsReceiptItemsModule } from './booking-coffee/goods_receipt_items/goods-receipt-items.module';
import { IssueReceiptsModule } from './booking-coffee/issue_receipts/issue-receipts.module';
import { IssueReceiptItemsModule } from './booking-coffee/issue_receipt_items/issue-receipt-items.module';
import { SupplierModule } from './booking-coffee/supplier/supplier.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Task scheduling
    ScheduleModule.forRoot(),
    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client'),
      exclude: ['/api*'],
      serveRoot: '/',
    }),
    // Serve uploaded files (không yêu cầu authentication)
    // ...existing code...
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'), // Đổi từ 'uploads' thành 'upload'
      serveRoot: '/upload', // Đổi từ '/uploads' thành '/upload'
      exclude: ['/api*'],
      serveStaticOptions: {
        index: false,
        setHeaders: (res) => {
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        },
      },
    }),

    // Database with global soft delete plugin
    mongooseConfig,
    // Database initialization with seeding
    DatabaseModule,
    // Authorization - CASL for role-based access control
    CaslModule,
    // Feature modules (in dependency Booking-Coffee)
    ModuleModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductServiceModule,
    OrderModule,
    CustomerModule,
    ItemModule,
    WarehousesModule,
    InventoryModule,
    InventoryTransactionsModule,
    GoodsReceiptsModule,
    GoodsReceiptItemsModule,
    IssueReceiptsModule,
    IssueReceiptItemsModule,
    SupplierModule,

    // Feature modules (in dependency Booking-Hospital)
    FacultyModule,
    RoomModule,
    AmenitiesModule,
    HealthModule,

    LoggerModule,
    // Database seeding (last)
    RouterModule.register([
      {
        path: 'booking-coffee',
        children: [
          { path: 'auth', module: AuthModule },
          { path: 'users', module: UserModule },
          { path: 'roles', module: RoleModule },
          { path: 'permissions', module: PermissionModule },
          { path: 'modules', module: ModuleModule },
          { path: 'categories', module: CategoryModule },
          { path: 'products', module: ProductModule },
          { path: 'orders', module: OrderModule },
          { path: 'customers', module: CustomerModule },
          { path: 'items', module: ItemModule },
          { path: 'warehouses', module: WarehousesModule },
          { path: 'inventories', module: InventoryModule },
          {
            path: 'inventory-transactions',
            module: InventoryTransactionsModule,
          },
          { path: 'goods-receipts', module: GoodsReceiptsModule },
          { path: 'goods-receipt-items', module: GoodsReceiptItemsModule },
          { path: 'issue-receipts', module: IssueReceiptsModule },
          { path: 'issue-receipt-items', module: IssueReceiptItemsModule },
          { path: 'suppliers', module: SupplierModule },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CaslGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseErrorInterceptor,
    },
  ],
})
export class AppModule {}
