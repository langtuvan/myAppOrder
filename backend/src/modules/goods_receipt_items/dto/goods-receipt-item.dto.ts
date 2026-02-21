import { IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGoodsReceiptItemDto {
  // @ApiProperty({
  //   description: 'The ID of the goods receipt',
  //   example: '507f1f77bcf86cd799439011',
  // })
  // @IsMongoId()
  // goodsReceipt: string;

  @ApiProperty({
    description: 'The warehouse ID where the goods are stored',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  warehouse: string;

  @ApiProperty({
    description: 'The product ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  product: string;

  @ApiProperty({
    description: 'Quantity',
    example: 100,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Price (optional)',
    example: 29.99,
    required: false,
  })
  @IsNumber()
  price?: number;
}

export class UpdateGoodsReceiptItemDto extends PartialType(
  CreateGoodsReceiptItemDto,
) {}
