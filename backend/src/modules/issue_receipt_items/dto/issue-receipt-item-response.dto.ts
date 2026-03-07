import { ApiProperty } from '@nestjs/swagger';

export class IssueReceiptItemResponseDto {
  @ApiProperty({
    description: 'Item ID',
  })
  _id: string;

  @ApiProperty({
    description: 'Issue receipt ID',
  })
  issueReceipt: string;

  @ApiProperty({
    description: 'Product ID',
  })
  product: string;

  @ApiProperty({
    description: 'Warehouse ID',
  })
  warehouse: string;

  @ApiProperty({
    description: 'Quantity issued',
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;
}
