import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueReceiptItemsController } from './issue-receipt-items.controller';
import { IssueReceiptItemsService } from './issue-receipt-items.service';
import {
  IssueReceiptItem,
  IssueReceiptItemSchema,
} from './schemas/issue-receipt-item.schema';
import { ProductModule } from '../product/product.module';
import { WarehousesModule } from '../warehouses/warehouses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IssueReceiptItem.name, schema: IssueReceiptItemSchema },
    ]),
    forwardRef(() => ProductModule),
    forwardRef(() => WarehousesModule),
  ],
  controllers: [IssueReceiptItemsController],
  providers: [IssueReceiptItemsService],
  exports: [IssueReceiptItemsService],
})
export class IssueReceiptItemsModule {}
