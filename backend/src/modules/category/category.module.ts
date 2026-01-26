import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { AmenitiesModule } from '../amenities/amenities.module';
import {
  ProductServiceSchema,
  ProductService,
} from '../product-service/schemas/product-service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductService.name, schema: ProductServiceSchema },
    ]),
    forwardRef(() => AmenitiesModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
