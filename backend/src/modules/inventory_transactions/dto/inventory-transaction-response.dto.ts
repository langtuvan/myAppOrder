import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../schemas/inventory-transaction.schema';

export class InventoryTransactionResponseDto {
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
    description: 'The source warehouse ID',
  })
  sourceWarehouse: string;

  @ApiProperty({
    description: 'The destination warehouse ID',
  })
  destinationWarehouse: string;

  @ApiProperty({
    description: 'Reference for the transaction',
  })
  reference: string;

  @ApiProperty({
    description: 'Transaction notes',
  })
  notes: string;

  @ApiProperty({
    description: 'User ID of person performing the transaction',
  })
  performedBy: string;

  @ApiProperty({
    description: 'Whether the transaction is approved',
  })
  isApproved: boolean;

  @ApiProperty({
    description: 'User ID of person approving the transaction',
  })
  approvedBy: string;

  @ApiProperty({
    description: 'Approval date',
  })
  approvalDate: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: string;
}
