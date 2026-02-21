import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/orderItem/order.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { ModuleModule } from './modules/module/module.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { CustomerModule } from './modules/customer/customer.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { ExamModule } from './modules/exam/exam.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ProductServiceModule } from './modules/product-service/product-service.module';
import { ReceptionModule } from './modules/reception/reception.module';
import { RoomModule } from './modules/room/room.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { CaslModule, CaslGuard } from './casl';
import { mongooseConfig } from './config/mongoose.config';
import { MongooseErrorInterceptor } from './interceptor/mongooseErrorInterceptor';
import { ItemModule } from './modules/item/item.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { BookingModule } from './modules/booking/booking.module';
import { HealthModule } from './modules/health/health.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InventoryTransactionsModule } from './modules/inventory_transactions/inventory_transactions.module';
import { GoodsReceiptsModule } from './modules/goods_receipts/goods-receipts.module';
import { GoodsReceiptItemsModule } from './modules/goods_receipt_items/goods-receipt-items.module';
import { SupplierModule } from './modules/supplier/supplier.module';

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
      rootPath: join(__dirname, 'client'),
      exclude: ['/api*'],
      serveRoot: '/',
    }),
    // Serve uploaded files (không yêu cầu authentication)
    // ...existing code...
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'), // Đổi từ 'uploads' thành 'upload'
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
    // Feature modules (in dependency order)
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
    FacultyModule,
    ExamModule,
    ReceptionModule,
    RoomModule,
    AmenitiesModule,
    BookingModule,
    HealthModule,
    WarehousesModule,
    InventoryModule,
    InventoryTransactionsModule,
    GoodsReceiptsModule,
    GoodsReceiptItemsModule,
    SupplierModule,

    LoggerModule,
    // Database seeding (last)
  ],
  controllers: [],
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
