import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { uuidv7 } from 'uuidv7';
import { Faculty } from '../../faculty/schemas/faculty.schema';
import { User } from '../../user/schemas/user.schema';
import { Customer } from '../../customer/schemas/customer.schema';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class OrderItem {
  //uuid
  @Prop({
    type: String,
    default: uuidv7,
    required: false,
  })
  _id?: string;

  //select boolean
  // @Prop({ type: Boolean, required: false, default: false })
  // isSelected: boolean;

  // customer ref

  @Prop({
    type: MongooseSchema.Types.Mixed,
    ref: 'Customer',
    required: true,
  })
  customer: Customer;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  })
  faculty: Faculty;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ required: true })
  date: string;

  // author
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  updatedBy: User;
}

export type OrderItemDocument = OrderItem & Document;

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
