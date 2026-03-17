import {
  IsString,
  IsOptional,
  IsMongoId,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IssueReceiptStatus } from '../schemas/issue-receipt.schema';
import { CreateIssueReceiptItemDto } from '../../issue_receipt_items';

export class CreateIssueReceiptDto {
  @ApiProperty({
    description: 'Customer ID (optional)',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  customer?: string;

  @ApiProperty({
    description: 'Warehouse ID (optional)',
    example: '507f1f77bcf86cd799439012',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  warehouse?: string;

  @ApiProperty({
    description: 'Issue notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Delivery note number (optional)',
    example: 'DEN-1001',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryNote?: string;

  @ApiProperty({
    description: 'Delivery date (optional)',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  deliveryDate?: Date;
}

export class CreateIssueReceiptDtoWithItems extends CreateIssueReceiptDto {
  // items field to hold issue receipt items
  @ApiProperty({
    description: 'List of issue receipt items',
    type: [CreateIssueReceiptItemDto],
  })
  @IsArray()
  items: CreateIssueReceiptItemDto[];
}

export class UpdateIssueReceiptDto extends PartialType(CreateIssueReceiptDto) {
  @ApiProperty({
    description: 'Receipt status',
    enum: IssueReceiptStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(IssueReceiptStatus)
  status?: IssueReceiptStatus;
}
