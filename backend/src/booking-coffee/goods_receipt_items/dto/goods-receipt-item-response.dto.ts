import { ApiProperty } from '@nestjs/swagger';

export class GoodsReceiptItemResponseDto {
  @ApiProperty({
    description: 'The ID of the goods receipt item',
  })
  _id: string;

  @ApiProperty({
    description: 'The goods receipt ID',
  })
  goodsReceipt: string;

  @ApiProperty({
    description: 'The product ID',
  })
  product: string;

  @ApiProperty({
    description: 'Quantity',
  })
  quantity: number;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Price (optional)',
  })
  price?: number;
}
