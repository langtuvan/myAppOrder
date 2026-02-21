import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Warehouse } from '../../warehouses/schemas/warehouse.schema';
import { Product } from '../../product/schemas/product.schema';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  })
  warehouse: Warehouse;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true, default: 0 })
  reservedQuantity: number;

  @Prop({ required: true, default: 0 })
  minStockLevel: number;

  @Prop({ required: true, default: 0 })
  maxStockLevel: number;

  @Prop()
  sku: string;

  @Prop()
  batchNumber: string;

  @Prop()
  expiryDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
InventorySchema.index({ warehouse: 1, product: 1 }, { unique: true });
