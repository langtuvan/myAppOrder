import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Inventory } from '../../inventory/schemas/inventory.schema';
import { Warehouse } from '../../warehouses/schemas/warehouse.schema';

export enum TransactionType {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  // TRANSFER = 'transfer',
  // ADJUSTMENT = 'adjustment',
  // DAMAGE = 'damage',
  // LOSS = 'loss',
  // RETURN = 'return',
}

// Created goods receipt items: [
//   {
// reference    _id: new ObjectId('698a9c65f16d9601e9aa3a2d'),
//     goodsReceipt: new ObjectId('698a9c65f16d9601e9aa3a2b'),
//     product: new ObjectId('693187dcb1d786ad0201e2d7'),
//     warehouse: new ObjectId('6985998184dc862b3ffa7352'),
//  quantity   quantity: 1,
//     price: 0,
//     deleted: false,
//     __v: 0,
//     createdAt: 2026-02-10T02:48:05.999Z,
//     updatedAt: 2026-02-10T02:48:05.999Z
//   },
//   {
//     _id: new ObjectId('698a9c65f16d9601e9aa3a2e'),
//     goodsReceipt: new ObjectId('698a9c65f16d9601e9aa3a2b'),
//     product: new ObjectId('693187dcb1d786ad0201e2d2'),
//     warehouse: new ObjectId('6985998184dc862b3ffa7352'),
//     quantity: 1,
//     price: 0,
//     deleted: false,
//     __v: 0,
//     createdAt: 2026-02-10T02:48:05.999Z,
//     updatedAt: 2026-02-10T02:48:05.999Z
//     updatedAt: 2026-02-10T02:48:05.999Z
//   }
// ]

export type InventoryTransactionDocument = InventoryTransaction & Document;

@Schema({ timestamps: true })
export class InventoryTransaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  })
  inventory: Inventory;

  @Prop({
    type: String,
    enum: TransactionType,
    required: true,
  })
  type: TransactionType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'GoodsReceipt',
    required: false,
  })
  reference: string; //  goodsReceipt, refType ID;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: string;

  @Prop({ required: true })
  quantity: number;


  @Prop()
  before_quantity: number;

  @Prop()
  notes?: string;
}

export const InventoryTransactionSchema =
  SchemaFactory.createForClass(InventoryTransaction);
