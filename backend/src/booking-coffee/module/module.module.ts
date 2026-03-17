import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModuleEntity, ModuleSchema } from './schemas/module.schema';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { PermissionModule } from '../permission/permission.module';
import { PermissionService } from '../permission/permission.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
    forwardRef(() => PermissionModule),
    //PermissionModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
