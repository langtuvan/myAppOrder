import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { uuidv7 } from 'uuidv7';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  EXPORTED = 'exported',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  OVER_DUE = 'overdue',
}

export enum OrderType {
  WEBSITE = 'website',
  IN_STORE = 'in-store',
  DELIVERY = 'delivery',
}

export enum OrderExport {
  QUICK = 'quick',
  NORMAL = 'normal',
  RECEPT = 'recept',
}

export enum DeliveryMethod {
  NONE = 'none',
  STANDARD = 'standard',
  EXPRESS = 'express',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit-card',
  ETRANSFER = 'etransfer',
  QR_CODE = 'qrCode',
}

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({
    type: String,
    auto: true,
    default: uuidv7,
  })
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product: string;

  @Prop({ type: String })
  productName: string;

  @Prop({ type: String })
  imageSrc: string;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Prop({ type: String, ref: 'User', required: false })
  exporter?: string;

  @Prop({ type: Date, required: false })
  exportedAt?: Date;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: String,
    auto: true,
    default: uuidv7,
  })
  _id: string;

  @Prop({ type: String, enum: OrderType, default: OrderType.WEBSITE })
  orderType: OrderType;

  @Prop({ type: String, enum: OrderExport, default: OrderExport.NORMAL })
  orderExport: OrderExport;

  @Prop({ type: String })
  trackingNumber: string;
  // customer info
  @Prop({ type: String })
  customerName: string;

  @Prop({ type: String })
  customerPhone: string;

  @Prop({ type: String, default: '' })
  customerEmail: string;
  // items
  @Prop([OrderItem])
  items: OrderItem[];
  // status
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Prop({ type: String })
  notes: string;
  //cart
  // payment method
  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: string;

  @Prop({ type: Number, default: 0 })
  customerPay: number;

  @Prop({ type: Number, default: 0 })
  customerPayCod: number;

  @Prop({ type: String, required: false, default: '' })
  paymentCardNumber: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: string;

  @Prop({ type: String, default: '' })
  paymentCode: string;
  // // delivery method
  @Prop({ type: String, enum: DeliveryMethod, default: DeliveryMethod.NONE })
  deliveryMethod: string;

  @Prop({ type: Number, default: 0 })
  deliveryPrice: number;

  @Prop({ type: Number, default: 0 })
  // // shipping Address
  @Prop({ type: String })
  province: string;

  @Prop({ type: String })
  ward: string;

  @Prop({ type: String })
  address: string;

  //subtotal
  @Prop({ type: Number, default: 0 })
  subTotal: number;

  @Prop({ type: Number, default: 0 })
  shippingFee: number;

  @Prop({ type: Number, default: 0 })
  discount: number;
  //taxes
  @Prop({ type: Number, default: 0 })
  taxes: number;

  // total amount
  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  // author
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  updatedBy?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  checker?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  cashier?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  exporter?: string;

  @Prop({ type: String, ref: 'User', required: false })
  deliveryBy?: string;

  @Prop({ type: Date, required: false })
  deliveredAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
