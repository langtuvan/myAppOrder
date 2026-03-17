import {
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TransactionType } from '../schemas/inventory-transaction.schema';

export class CreateInventoryTransactionDto {
  @ApiProperty({
    description: 'The ID of the inventory item',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  inventory: string;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
    example: TransactionType.INBOUND,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'The quantity involved in the transaction',
    example: 100,
  })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'The quantity before the transaction',
    example: 50,
  })
  @IsNumber()
  @Type(() => Number)
  before_quantity: number;

  @ApiProperty({
    description: 'Reference ID related to the transaction',
    example: '609e129e1c4ae12f34567890',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  reference?: string;

  @ApiProperty({
    description: 'Additional notes about the transaction',
    example: 'Received in good condition',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'The product ID involved in the transaction',
    example: '609e129e1c4ae12f34567890',
  })
  @IsMongoId()
  product: string;
}

export class UpdateInventoryTransactionDto extends PartialType(
  CreateInventoryTransactionDto,
) {
  @ApiProperty({
    description: 'Whether the transaction is approved',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({
    description: 'User ID of person approving the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiProperty({
    description: 'Approval date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approvalDate?: Date;
}
