import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsReceiptItemsController } from './goods-receipt-items.controller';
import { GoodsReceiptItemsService } from './goods-receipt-items.service';
import {
  GoodsReceiptItem,
  GoodsReceiptItemSchema,
} from './schemas/goods-receipt-item.schema';
import { ProductModule } from '../product/product.module';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoodsReceiptItem.name, schema: GoodsReceiptItemSchema },
    ]),
    forwardRef(() => ProductModule),
    forwardRef(() => WarehousesModule),
  ],
  controllers: [GoodsReceiptItemsController],
  providers: [GoodsReceiptItemsService],
  exports: [GoodsReceiptItemsService],
})
export class GoodsReceiptItemsModule {}
