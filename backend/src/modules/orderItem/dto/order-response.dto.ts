import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  DeliveryMethod,
  OrderType,
  OrderExport,
} from '../schemas/order.schema';
import { ProductResponseDto } from '../../product/dto/product-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class OrderItemResponseDto {
  @ApiProperty({ description: 'Item ID', example: '01HZK...' })
  _id: string;

  @ApiProperty({
    description: 'Product details',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;

  @ApiProperty({ description: 'Product name', example: 'Product A' })
  productName: string;

  @ApiProperty({ description: 'Image source URL', example: 'http://...' })
  imageSrc: string;

  @ApiProperty({ description: 'Quantity ordered', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Price per unit', example: 99.99 })
  price: number;

  @ApiProperty({
    description: 'Item status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'Exporter user ID', required: false })
  exporter?: string;

  @ApiProperty({ description: 'Export timestamp', required: false })
  exportedAt?: Date;

  @ApiProperty({ description: 'Item date', required: false })
  date?: Date;
}

export class BillingInfoResponseDto {
  @ApiProperty({ description: 'Subtotal', example: 199.98 })
  subTotal: number;

  @ApiProperty({ description: 'Delivery price', example: 20.0 })
  deliveryPrice: number;

  @ApiProperty({ description: 'Discount amount', example: 10.0 })
  discount: number;

  @ApiProperty({ description: 'Total amount', example: 209.98 })
  totalAmount: number;

  @ApiProperty({ description: 'Amount paid by customer', example: 209.98 })
  customerPay: number;

  @ApiProperty({ description: 'COD amount', example: 0 })
  customerPayCod: number;
}

export class PaymentInfoResponseDto {
  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Card number (partial)',
    example: 'xxxx-xxxx-xxxx-1234',
    required: false,
  })
  paymentCardNumber?: string;

  @ApiProperty({ description: 'Payment reference code', required: false })
  paymentCode?: string;
}

export class DeliveryInfoResponseDto {
  @ApiProperty({
    description: 'Delivery method',
    enum: DeliveryMethod,
    example: DeliveryMethod.STANDARD,
  })
  deliveryMethod?: DeliveryMethod;

  @ApiProperty({
    description: 'Province',
    example: 'Ho Chi Minh City',
    required: false,
  })
  province?: string;

  @ApiProperty({ description: 'Ward', example: 'District 1', required: false })
  ward?: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Main St',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Recipient phone',
    example: '+84901234567',
    required: false,
  })
  receiptPhone?: string;

  @ApiProperty({
    description: 'Delivery note',
    example: 'Leave at front door',
    required: false,
  })
  receiptNote?: string;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID (UUIDv7)',
    example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  })
  _id: string;

  @ApiProperty({
    description: 'Tracking number',
    example: 'TRK123456789',
    required: false,
  })
  trackingNumber?: string;

  @ApiProperty({
    description: 'Order type',
    enum: OrderType,
    example: OrderType.WEBSITE,
  })
  orderType: OrderType;

  @ApiProperty({
    description: 'Order export type',
    enum: OrderExport,
    example: OrderExport.NORMAL,
  })
  orderExport: OrderExport;

  @ApiProperty({ description: 'Order items', type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Order notes',
    example: 'Handle with care',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Customer details',
    type: UserResponseDto,
    required: false,
  })
  customer?: UserResponseDto;

  @ApiProperty({
    description: 'Billing information',
    type: BillingInfoResponseDto,
  })
  billing: BillingInfoResponseDto;

  @ApiProperty({
    description: 'Payment information',
    type: PaymentInfoResponseDto,
  })
  payment: PaymentInfoResponseDto;

  @ApiProperty({
    description: 'Delivery information',
    type: DeliveryInfoResponseDto,
    required: false,
  })
  delivery?: DeliveryInfoResponseDto;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-28T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-10-28T10:30:00.000Z',
  })
  updatedAt: Date;
}
