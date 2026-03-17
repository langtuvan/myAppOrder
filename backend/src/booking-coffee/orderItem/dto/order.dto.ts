import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  IsUUID,
  ValidateNested,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  DeliveryMethod,
  OrderExport,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '../schemas/order.schema';
import { OrderItemDto } from './orderItem.dto';

// Nested DTO for Billing Information
export class BillingInfoDto {
  @ApiProperty({
    description: 'Subtotal of the order',
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  subTotal: number;

  @ApiProperty({ description: 'Delivery price for the order', example: 20000 })
  @IsNumber()
  @Min(0)
  deliveryPrice: number;

  @ApiProperty({
    description: 'Discount applied to the order',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 115000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Amount paid by the customer', example: 0 })
  @IsNumber()
  @Min(0)
  customerPay: number;

  @ApiProperty({
    description: 'Amount to be paid by customer on delivery (COD)',
    example: 115000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  customerPayCod: number;
}

// Nested DTO for Payment Information
export class PaymentInfoDto {
  @ApiProperty({
    description: 'Payment method for the order',
    enum: PaymentMethod,
    example: 'cash',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Payment status for the order',
    enum: PaymentStatus,
    example: 'unpaid',
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Payment card number if applicable',
    example: 'xxxx-xxxx-xxxx-1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentCardNumber?: string;

  @ApiProperty({
    description: 'Payment code or reference',
    example: 'PAY123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentCode?: string;
}

// Nested DTO for Delivery Information
export class DeliveryInfoDto {
  @ApiProperty({
    description: 'Delivery method for the order',
    enum: DeliveryMethod,
    example: 'standard',
  })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    description: 'Province for delivery',
    example: 'Ho Chi Minh City',
    required: false,
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({
    description: 'Ward for delivery',
    example: 'District 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({
    description: 'Full address for delivery',
    example: '123 Main St',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Phone number of the recipient',
    example: '+84901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiptPhone?: string;

  @ApiProperty({
    description: 'Note for the delivery person',
    example: 'Leave at front door',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiptNote?: string;


  @ApiProperty({
    description: 'Name of the recipient',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiptName?: string;

  @ApiProperty({
    description: 'Email of the recipient',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiptEmail?: string;
}

export class CreateOrderDto {

  @ApiProperty({
    description: 'Tracking number for the order',
    example: 'TRK123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiProperty({
    description: 'Type of order',
    enum: OrderType,
    example: 'website',
  })
  @IsEnum(OrderType)
  @IsNotEmpty()
  orderType: OrderType;

  @ApiProperty({
    description: 'Order export type',
    enum: OrderExport,
    example: 'normal',
  })
  @IsEnum(OrderExport)
  @IsNotEmpty()
  orderExport: OrderExport;

  @ApiProperty({
    description: 'Array of order items',
    type: [OrderItemDto],
  })
  @IsArray()
  //@ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Please handle with care',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  // Customer Info
  @ApiProperty({
    description: 'Customer ID',
    example: '60d21b4667d0d8992e610c85',
    required: false,
  })
  @IsOptional()
  @IsString()
  customer?: string;

  // Billing, Payment, and Delivery Info
  @ApiProperty({ type: BillingInfoDto })
  @ValidateNested()
  @Type(() => BillingInfoDto)
  billing: BillingInfoDto;

  @ApiProperty({ type: PaymentInfoDto })
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  payment: PaymentInfoDto;

  @ApiProperty({ type: DeliveryInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  delivery?: DeliveryInfoDto;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
