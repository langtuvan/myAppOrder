import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Latest iPhone with Pro features',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
  })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'The category ID this product belongs to',
    example: '60d5ecb74b24a92c5c8b1234',
  })
  @IsMongoId()
  category: string;

  @ApiProperty({
    description: 'The stock quantity available',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stock?: number;

  @ApiProperty({
    description: 'Whether the product is available for purchase',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Array of image URLs for the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'The SKU (Stock Keeping Unit) of the product',
    example: 'IPH15PRO-256-SG',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Whether the product is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
