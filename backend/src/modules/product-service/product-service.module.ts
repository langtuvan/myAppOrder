import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductServiceController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import {
  ProductService,
  ProductServiceSchema,
} from './schemas/product-service.schema';
import { CategoryModule } from '../category/category.module';
import { AmenitiesModule } from '../amenities/amenities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductService.name, schema: ProductServiceSchema },
    ]),
    forwardRef(() => CategoryModule),
    // forwardRef(() => AmenitiesModule),
  ],
  controllers: [ProductServiceController],
  providers: [ProductServiceService],
  exports: [ProductServiceService],
})
export class ProductServiceModule {}
