import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { uuidv7 } from 'uuidv7';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  All = 'all',
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

export enum StatusColor {
  CANCELLED = 'red',
  PENDING = 'yellow',
  CONFIRMED = 'blue',
  PROCESSING = 'indigo',
  SHIPPED = 'purple',
  DELIVERED = 'teal',
  EXPORTED = 'cyan',
  COMPLETED = 'green',
  OVER_DUE = 'orange',
}

export const paymentMethods = [
  { id: PaymentMethod.CASH, title: 'Cash' },
  { id: PaymentMethod.ETRANSFER, title: 'eTransfer' },
  { id: PaymentMethod.QR_CODE, title: 'QR Code' },
];

export const deliveryMethods = [
  {
    id: DeliveryMethod.NONE,
    title: 'None Delivery',
    turnaround: 'customer will pick up',
    price: 0,
  },
  {
    id: DeliveryMethod.STANDARD,
    title: 'Standard',
    turnaround: '3–5 business days',
    price: 20000,
  },
  {
    id: DeliveryMethod.EXPRESS,
    title: 'Express',
    turnaround: '1-2 business days',
    price: 30000,
  },
];

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

  @Prop({ type: Date, required: false })
  date?: Date;
}

// Nested schema for billing information
@Schema({ _id: false })
export class BillingInfo {
  @Prop({ type: Number, default: 0 })
  subTotal: number;

  @Prop({ type: Number, default: 0 })
  deliveryPrice: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  @Prop({ type: Number, default: 0 })
  customerPay: number;

  @Prop({ type: Number, default: 0 })
  customerPayCod: number;
}

// Nested schema for payment information
@Schema({ _id: false })
export class PaymentInfo {
  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: string;

  @Prop({ type: String, required: false, default: '' })
  paymentCardNumber?: string;

  @Prop({ type: String, default: '' })
  paymentCode?: string;
}

// Nested schema for delivery information
@Schema({ _id: false })
export class DeliveryInfo {
  @Prop({ type: String, enum: DeliveryMethod, default: DeliveryMethod.NONE })
  deliveryMethod?: DeliveryMethod;

  @Prop({ type: String })
  province?: string;

  @Prop({ type: String })
  ward?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: String })
  receiptPhone?: string;

  @Prop({ type: String })
  receiptNote?: string;

  //
  @Prop({ type: String })
  receiptName?: string;

  @Prop({ type: String })
  receiptEmail?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: MongooseSchema.Types.Mixed,
    auto: true,
    default: uuidv7,
  })
  _id: string;

  @Prop({ type: String, required: false })
  trackingNumber?: string;

  @Prop({ type: String, enum: OrderType, default: OrderType.WEBSITE })
  orderType: OrderType;

  @Prop({ type: String, enum: OrderExport, default: OrderExport.NORMAL })
  orderExport: OrderExport;

  // Items
  @Prop([OrderItem])
  items: OrderItem[];

  @Prop({ type: String, default: '' })
  notes?: string;

  // Order status
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  // Customer info
  @Prop({ type: MongooseSchema.Types.Mixed, ref: 'Customer', required: false })
  customer?: string;

  // Billing information (nested)
  @Prop({ type: Object, default: () => ({}) })
  billing: BillingInfo;

  // Payment information (nested)
  @Prop({ type: Object, default: () => ({}) })
  payment: PaymentInfo;

  // Delivery information (nested)
  @Prop({ type: Object, required: false })
  delivery?: DeliveryInfo;

  // User references
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  updatedBy?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  checker?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  cashier?: string;

  @Prop({ type: Boolean, default: false })
  exported: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  exporter?: string;

  @Prop({ type: String, ref: 'User', required: false })
  deliveryBy?: string;

  @Prop({ type: Date, required: false })
  deliveredAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const BillingInfoSchema = SchemaFactory.createForClass(BillingInfo);
export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
export const DeliveryInfoSchema = SchemaFactory.createForClass(DeliveryInfo);
