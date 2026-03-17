import { ApiProperty } from '@nestjs/swagger';
import { GoodsReceiptStatus } from '../schemas/goods-receipt.schema';
import { GoodsReceiptItemResponseDto } from '../../goods_receipt_items';

export class GoodsReceiptResponseDto {
  @ApiProperty({
    description: 'The ID of the goods receipt',
  })
  _id: string;

  @ApiProperty({
    description: 'Unique receipt code',
  })
  code: string;

  @ApiProperty({
    description: 'The warehouse ID',
  })
  warehouse: string;

  @ApiProperty({
    description: 'Supplier ID (optional)',
  })
  supplier?: string;

  @ApiProperty({
    description: 'Receipt status',
    enum: GoodsReceiptStatus,
  })
  status: GoodsReceiptStatus;

  @ApiProperty({
    description: 'Receipt notes',
  })
  note?: string;

  @ApiProperty({
    description: 'User ID of person creating the receipt',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Invoice number (optional)',
  })
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Invoice date (optional)',
  })
  invoiceDate?: Date;

  @ApiProperty({
    description: 'List of items in the goods receipt',
    type: [GoodsReceiptItemResponseDto],
  })
  items?: GoodsReceiptItemResponseDto[];
}
