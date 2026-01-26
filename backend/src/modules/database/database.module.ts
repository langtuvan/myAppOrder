import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { ModuleModule } from '../module/module.module';
import { FacultyModule } from '../faculty/faculty.module';
import { LoggerModule } from '../logger/logger.module';
import { ProductModule } from '../product/product.module';
import { ProductServiceModule } from '../product-service/product-service.module';
import { CategoryModule } from '../category/category.module';
import { RoomModule } from '../room/room.module';
import { AmenitiesModule } from '../amenities/amenities.module';

@Module({
  imports: [
    ModuleModule,
    UserModule,
    RoleModule,
    PermissionModule,
    FacultyModule,
    RoomModule,
    CategoryModule,
    ProductModule,
    ProductServiceModule,
    LoggerModule,
    AmenitiesModule,
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    await this.databaseService.seedDatabase();
  }
}
