import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsReceiptsController } from './goods-receipts.controller';
import { GoodsReceiptsService } from './goods-receipts.service';
import {
  GoodsReceipt,
  GoodsReceiptSchema,
} from './schemas/goods-receipt.schema';
import {
  GoodsReceiptItem,
  GoodsReceiptItemSchema,
} from '../goods_receipt_items/schemas/goods-receipt-item.schema';
import {
  InventoryTransaction,
  InventoryTransactionSchema,
} from '../inventory_transactions/schemas/inventory-transaction.schema';
import {
  Inventory,
  InventorySchema,
} from '../inventory/schemas/inventory.schema';
import { GoodsReceiptItemsModule } from '../goods_receipt_items';
import { InventoryTransactionsModule } from '../inventory_transactions/inventory_transactions.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoodsReceipt.name, schema: GoodsReceiptSchema },
      { name: GoodsReceiptItem.name, schema: GoodsReceiptItemSchema },
      { name: InventoryTransaction.name, schema: InventoryTransactionSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
    GoodsReceiptItemsModule,
    InventoryModule,
    InventoryTransactionsModule,
  ],
  controllers: [GoodsReceiptsController],
  providers: [GoodsReceiptsService],
  exports: [GoodsReceiptsService],
})
export class GoodsReceiptsModule {}
