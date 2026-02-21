import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GoodsReceipt } from '../../goods_receipts/schemas/goods-receipt.schema';
import { Product } from '../../product/schemas/product.schema';

export type GoodsReceiptItemDocument = GoodsReceiptItem & Document;

@Schema({ timestamps: true })
export class GoodsReceiptItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'GoodsReceipt',
    required: true,
  })
  goodsReceipt: GoodsReceipt;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  })
  warehouse: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false })
  price?: number;
}

export const GoodsReceiptItemSchema =
  SchemaFactory.createForClass(GoodsReceiptItem);
