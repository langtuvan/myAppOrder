import {
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../schemas/inventory-transaction.schema';

// Simple Input DTO
export class SimpleCreateInventoryTransactionDto {
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
    description: 'The quantity of the transaction',
    example: 50,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Reference for the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Transaction notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

// Simple Output DTO
export class SimpleInventoryTransactionResponseDto {
  @ApiProperty({
    description: 'The ID of the transaction',
  })
  _id: string;

  @ApiProperty({
    description: 'The inventory item ID',
  })
  inventory: string;

  @ApiProperty({
    description: 'The type of transaction',
    enum: TransactionType,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'The quantity transacted',
  })
  quantity: number;

  @ApiProperty({
    description: 'Reference for the transaction',
  })
  reference?: string;

  @ApiProperty({
    description: 'Transaction notes',
  })
  notes?: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;
}
