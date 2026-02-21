import {
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'The ID of the warehouse',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  warehouse: string;

  @ApiProperty({
    description: 'The ID of the product',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  product: string;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 100,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minStockLevel?: number;

  @ApiProperty({
    description: 'Maximum stock level',
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxStockLevel?: number;

  @ApiProperty({
    description: 'SKU code',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Batch number',
    required: false,
  })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty({
    description: 'Expiry date of the product',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiProperty({
    description: 'Additional notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @ApiProperty({
    description: 'Reserved quantity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  reservedQuantity?: number;

  @ApiProperty({
    description: 'Whether the inventory item is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
