import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryTransactionsController } from './inventory_transactions.controller';
import { InventoryTransactionsService } from './inventory_transactions.service';
import {
  InventoryTransaction,
  InventoryTransactionSchema,
} from './schemas/inventory-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InventoryTransaction.name,
        schema: InventoryTransactionSchema,
      },
    ]),
  ],
  controllers: [InventoryTransactionsController],
  providers: [InventoryTransactionsService],
  exports: [InventoryTransactionsService],
})
export class InventoryTransactionsModule {}
