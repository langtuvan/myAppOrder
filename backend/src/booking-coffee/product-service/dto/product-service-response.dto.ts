import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '../../product/dto/product-response.dto';

export class ProductServiceResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the product service',
    example: '60d5ecb74b24a92c5c8b5678',
  })
  _id: string;




  @ApiProperty({
    description: 'The description of the service',
    example: 'Professional installation with warranty',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The price of the service',
    example: 99.99,
  })
  price: number;

  @ApiProperty({
    description: 'Whether the service is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The duration of the service',
    example: '2 hours',
    required: false,
  })
  duration?: string;

  @ApiProperty({
    description: 'Array of tags for the service',
    example: ['installation', 'warranty', 'support'],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'The date when the service was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the service was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
