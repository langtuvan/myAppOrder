import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { UserModule } from '../user/user.module';
import { InventoryModule } from '../inventory/inventory.module';
import { InventoryTransactionsModule } from '../inventory_transactions/inventory_transactions.module';
import {
  Inventory,
  InventorySchema,
} from '../inventory/schemas/inventory.schema';
import { IssueReceiptsModule } from '../issue_receipts';
import { CustomerModule } from '../customer/customer.module';
import { GoodsReceiptsModule } from '../goods_receipts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      // { name: IssueReceipt.name, schema: IssueReceiptSchema },
      // { name: IssueReceiptItem.name, schema: IssueReceiptItemSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
    forwardRef(() => CustomerModule),
    forwardRef(() => UserModule),
    forwardRef(() => IssueReceiptsModule),
    forwardRef(() => GoodsReceiptsModule),

    //InventoryModule,
    //IssueReceiptsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
  exports: [OrderService, OrderGateway],
})
export class OrderModule {}
