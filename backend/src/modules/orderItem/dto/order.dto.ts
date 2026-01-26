import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  IsMongoId,
  IsUUID,
  ValidateNested,
  Min,
  ArrayMinSize,
  IsNotEmpty,
  isEnum,
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
import { CreateOrderItemDto } from '../../item/dto/item.dto';
import { OrderItemDto } from './orderItem.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  @IsString()
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  _id?: string;

  @ApiProperty({
    description: 'Type of order',
    enum: ['website', 'in-store', 'delivery'],
    example: 'website',
  })
  @IsEnum(OrderType)
  @IsNotEmpty()
  orderType: OrderType;

  @ApiProperty({
    description: 'Order export type',
    enum: ['quick', 'normal'],
    example: 'normal',
  })
  @IsEnum(OrderExport)
  @IsNotEmpty()
  orderExport: OrderExport;

  @ApiProperty({
    description: 'Unique tracking number for the order',
    example: 'TRK123456789',
  })
  @IsString()
  @IsOptional()
  trackingNumber: string;

  @ApiProperty({
    description: "Customer's full name",
    example: 'John Doe',
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: "Customer's phone number",
    example: '+1234567890',
    required: false,
  })
  @IsString()
  customerPhone: string;

  @ApiProperty({
    description: "Customer's email address",
    example: 'john.doe@example.com',
  })
  @IsOptional()
  customerEmail: string;

  @ApiProperty({
    description: 'Array of order items',
    type: [OrderItemDto],
  })
  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // status
  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Please handle with care',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // payment method
  @ApiProperty({
    description: 'Payment method for the order',
    enum: PaymentMethod,
    example: 'cash',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Amount paid by the customer',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  customerPay: number;

  @ApiProperty({
    description: 'Amount paid by the customer via COD',
    example: 5000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  customerPayCod: number;

  @ApiProperty({
    description: 'Payment card number if applicable',
    example: 'xxxx-xxxx-xxxx-1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentCardNumber?: string;

  @ApiProperty({
    description: 'Payment status for the order',
    enum: ['paid', 'unpaid'],
    example: 'unpaid',
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Payment code or reference',
    example: 'PAY123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentCode?: string;

  @ApiProperty({
    description: 'Delivery method for the order',
    enum: ['none', 'standard', 'express'],
    example: 'standard',
  })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({
    description: 'Delivery price for the order',
    example: 5000,
  })
  @IsNumber()
  @Min(0)
  deliveryPrice: number;

  //taxes
  @ApiProperty({
    description: 'Taxes applied to the order',
    example: 8,
  })
  @IsNumber()
  @Min(0)
  taxes: number;

  @ApiProperty({
    description: 'Discount applied to the order',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(0)
  discount: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  // shipping Address
  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, State 12345',
  })
  @IsString()
  address: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
