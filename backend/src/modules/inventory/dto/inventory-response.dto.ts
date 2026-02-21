import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty({
    description: 'The ID of the inventory item',
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the warehouse',
  })
  warehouse: string;

  @ApiProperty({
    description: 'The ID of the product',
  })
  product: string;

  @ApiProperty({
    description: 'The quantity of the product',
  })
  quantity: number;

  @ApiProperty({
    description: 'Reserved quantity',
  })
  reservedQuantity: number;

  @ApiProperty({
    description: 'Minimum stock level',
  })
  minStockLevel: number;

  @ApiProperty({
    description: 'Maximum stock level',
  })
  maxStockLevel: number;

  @ApiProperty({
    description: 'SKU code',
  })
  sku: string;

  @ApiProperty({
    description: 'Batch number',
  })
  batchNumber: string;

  @ApiProperty({
    description: 'Expiry date of the product',
  })
  expiryDate: string;

  @ApiProperty({
    description: 'Whether the inventory item is active',
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional notes',
  })
  notes: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;
}
