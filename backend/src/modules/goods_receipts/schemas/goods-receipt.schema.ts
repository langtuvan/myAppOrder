import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Warehouse } from '../../warehouses/schemas/warehouse.schema';

export enum GoodsReceiptStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type GoodsReceiptDocument = GoodsReceipt & Document;

@Schema({ timestamps: true })
export class GoodsReceipt {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Supplier',
    required: false,
  })
  supplier?: string;

  @Prop({ required: false })
  invoiceNumber?: string;

  @Prop({ required: false })
  invoiceDate?: Date;

  @Prop({
    type: String,
    enum: GoodsReceiptStatus,
    required: true,
    default: GoodsReceiptStatus.DRAFT,
  })
  status: GoodsReceiptStatus;

  @Prop({ required: false })
  note?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: string;
}

export const GoodsReceiptSchema = SchemaFactory.createForClass(GoodsReceipt);
