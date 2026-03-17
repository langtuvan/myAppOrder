import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
  Min,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';

export class OrderItemDto {
  @ApiProperty({
    description: 'Order Item ID uuidv7 string',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  _id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '60d5ecb74b24a92c5c8b1234',
  })
  product: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'Image source URL',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  imageSrc: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Price per unit at the time of order',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ enum: OrderStatus, description: 'Order item status' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class UpdateOrderItemDto extends PartialType(OrderItemDto) {}
