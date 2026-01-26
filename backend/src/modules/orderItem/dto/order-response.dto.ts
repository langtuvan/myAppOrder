import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';
import { ProductResponseDto } from '../../product/dto/product-response.dto';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Product details',
    type: ProductResponseDto,
  })
  product: ProductResponseDto;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit at time of order',
    example: 99.99,
  })
  price: number;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID (UUIDv7)',
    example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  })
  _id: string;

  @ApiProperty({
    description: "Customer's full name",
    example: 'John Doe',
  })
  customerName: string;

  @ApiProperty({
    description: "Customer's email address",
    example: 'john.doe@example.com',
  })
  customerEmail: string;

  @ApiProperty({
    description: "Customer's phone number",
    example: '+1234567890',
    required: false,
  })
  customerPhone?: string;

  @ApiProperty({
    description: 'Shipping address',
    example: '123 Main St, City, State 12345',
  })
  shippingAddress: string;

  @ApiProperty({
    description: 'Order items with product details',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Total order amount',
    example: 199.98,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Current order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Order notes',
    example: 'Please handle with care',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    description: 'Tracking number',
    example: 'TRK123456789',
    required: false,
  })
  trackingNumber?: string;

  @ApiProperty({
    description: 'Order creation date',
    example: '2023-10-28T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Order last update date',
    example: '2023-10-28T10:30:00.000Z',
  })
  updatedAt: Date;
}
