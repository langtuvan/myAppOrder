import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
    // Serve uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
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

    LoggerModule,
    // Database seeding (last)
    DatabaseModule,
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
