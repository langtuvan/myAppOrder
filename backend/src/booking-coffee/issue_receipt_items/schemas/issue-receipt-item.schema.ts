import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IssueReceipt } from '../../issue_receipts/schemas/issue-receipt.schema';
import { Product } from '../../product/schemas/product.schema';

export type IssueReceiptItemDocument = IssueReceiptItem & Document;

@Schema({ timestamps: true })
export class IssueReceiptItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'IssueReceipt',
    required: true,
  })
  issueReceipt: IssueReceipt;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
    required: false,
    default: null,
  })
  warehouse?: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false })
  price?: number;
}

export const IssueReceiptItemSchema =
  SchemaFactory.createForClass(IssueReceiptItem);
