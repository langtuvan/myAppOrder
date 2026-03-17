import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IssueReceiptsController } from './issue-receipts.controller';
import { IssueReceiptsService } from './issue-receipts.service';
import {
  IssueReceipt,
  IssueReceiptSchema,
} from './schemas/issue-receipt.schema';
import {
  IssueReceiptItem,
  IssueReceiptItemSchema,
} from '../issue_receipt_items/schemas/issue-receipt-item.schema';
import {
  InventoryTransaction,
  InventoryTransactionSchema,
} from '../inventory_transactions/schemas/inventory-transaction.schema';
import {
  Inventory,
  InventorySchema,
} from '../inventory/schemas/inventory.schema';
import { IssueReceiptItemsModule } from '../issue_receipt_items';
import { InventoryTransactionsModule } from '../inventory_transactions/inventory_transactions.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IssueReceipt.name, schema: IssueReceiptSchema },
      { name: IssueReceiptItem.name, schema: IssueReceiptItemSchema },
      { name: InventoryTransaction.name, schema: InventoryTransactionSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
    IssueReceiptItemsModule,
    InventoryModule,
    InventoryTransactionsModule,
  ],
  controllers: [IssueReceiptsController],
  providers: [IssueReceiptsService],
  exports: [IssueReceiptsService],
})
export class IssueReceiptsModule {}
