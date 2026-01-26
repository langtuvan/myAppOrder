import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../category/dto/category-response.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: '60d5ecb74b24a92c5c8b5678',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'iPhone 15 Pro',
  })
  name: string;

  // imageSrc field added
  imageSrc?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Latest iPhone with Pro features',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'The category this product belongs to',
    type: () => CategoryResponseDto,
  })
  category: CategoryResponseDto;

  @ApiProperty({
    description: 'The stock quantity available',
    example: 50,
  })
  stock: number;

  @ApiProperty({
    description: 'Whether the product is available for purchase',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Array of image URLs for the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  images?: string[];

  @ApiProperty({
    description: 'The SKU (Stock Keeping Unit) of the product',
    example: 'IPH15PRO-256-SG',
    required: false,
  })
  sku?: string;

  @ApiProperty({
    description: 'The date when the product was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the product was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
