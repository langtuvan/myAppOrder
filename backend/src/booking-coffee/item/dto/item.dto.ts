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
import { OrderStatus } from '../schemas/item.schema';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Faculty ID',
    example: '60d5ecb74b24a92c5c8b1234',
  })
  @IsString()
  @IsNotEmpty()
  faculty: string;

  @ApiProperty({
    description: 'Product ID',
    example: '60d5ecb74b24a92c5c8b1234',
  })
  product: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'uuidv7 string',
  })
  @IsString()
  @IsNotEmpty()
  customer: string;

  // selected boolean
  // @ApiPropertyOptional({
  //   description: 'Whether the item is selected',
  //   example: false,
  // })
  // @IsOptional()
  // @IsBoolean()
  // isSelected?: boolean;

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

  @ApiPropertyOptional({ description: 'Date string (e.g., 2025-11-13)' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Order item status' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Date string (e.g., 2025-11-13)' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class QueryOrderItemDto {
  @ApiPropertyOptional({ description: 'Faculty ID' })
  @IsOptional()
  @IsString()
  faculty?: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiPropertyOptional({ description: 'Product ID' })
  @IsOptional()
  @IsMongoId()
  product?: string;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
