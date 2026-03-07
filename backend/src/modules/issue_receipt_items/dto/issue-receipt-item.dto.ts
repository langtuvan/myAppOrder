import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateIssueReceiptItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  product: string;

  @ApiProperty({
    description: 'Warehouse ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  warehouse: string;

  @ApiProperty({
    description: 'Quantity issued',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price (optional)',
    example: 25.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class UpdateIssueReceiptItemDto extends PartialType(
  CreateIssueReceiptItemDto,
) {}
