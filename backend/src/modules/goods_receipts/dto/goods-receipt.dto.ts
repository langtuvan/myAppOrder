import {
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { GoodsReceiptStatus } from '../schemas/goods-receipt.schema';
import { CreateGoodsReceiptItemDto } from '../../goods_receipt_items';

export class CreateGoodsReceiptDto {
  @ApiProperty({
    description: 'Supplier ID (optional)',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  supplier?: string;

  @ApiProperty({
    description: 'Receipt notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Invoice number (optional)',
    example: 'INV-1001',
    required: false,
  })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({
    description: 'Invoice date (optional)',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  invoiceDate?: Date;

}

export class CreateGoodsReceiptDtoWithItems extends CreateGoodsReceiptDto {
  // items field to hold goods receipt items
  @ApiProperty({
    description: 'List of goods receipt items',
    type: [CreateGoodsReceiptItemDto],
  })
  @IsArray()
  items: CreateGoodsReceiptItemDto[];
}

export class UpdateGoodsReceiptDto extends PartialType(CreateGoodsReceiptDto) {
  @ApiProperty({
    description: 'Receipt status',
    enum: GoodsReceiptStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(GoodsReceiptStatus)
  status?: GoodsReceiptStatus;
}
