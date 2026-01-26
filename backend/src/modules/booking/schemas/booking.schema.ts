import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Product } from '../../product/schemas/product.schema';
import { Faculty } from '../../faculty/schemas/faculty.schema';
import { uuidv7 } from 'uuidv7';
import { ProductService } from '../../product-service/schemas/product-service.schema';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  OVER_DUE = 'overdue',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
class BookingItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductService',
    required: true,
  })
  productId: ProductService;
  @Prop({ required: true })
  quantity: number;
  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Booking {
  // @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  // _id: string;
  //uuid
  @Prop({
    type: String,
    default: uuidv7,
    required: false,
  })
  _id?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Faculty' })
  faculty: Faculty;

  @Prop({ required: true })
  trackingNumber: string;

  @Prop({
    required: false,
    type: [BookingItem],
    default: [],
  })
  items: BookingItem[];

  @Prop({ required: false })
  customerId?: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hour: number;

  @Prop({ required: true })
  minute: number;

  @Prop({ required: false })
  notes: string;

  @Prop({
    type: String,
    required: false,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  })
  status?: BookingStatus;

  // createdBy
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy?: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  updatedBy?: User;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
