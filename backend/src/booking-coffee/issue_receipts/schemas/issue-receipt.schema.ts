import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum IssueReceiptStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type IssueReceiptDocument = IssueReceipt & Document;

@Schema({ timestamps: true })
export class IssueReceipt {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    ref: 'Customer',
    required: false,
  })
  customer?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
    required: false,
  })
  warehouse?: string;

  @Prop({
    type: String,
    enum: IssueReceiptStatus,
    required: true,
    default: IssueReceiptStatus.DRAFT,
  })
  status: IssueReceiptStatus;

  @Prop({ required: false })
  note?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: string;
}

export const IssueReceiptSchema = SchemaFactory.createForClass(IssueReceipt);
