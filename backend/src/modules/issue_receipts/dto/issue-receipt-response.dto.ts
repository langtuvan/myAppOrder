import { ApiProperty } from '@nestjs/swagger';
import { IssueReceiptStatus } from '../schemas/issue-receipt.schema';
import { IssueReceiptItemResponseDto } from '../../issue_receipt_items';

export class IssueReceiptResponseDto {
  @ApiProperty({
    description: 'The ID of the issue receipt',
  })
  _id: string;

  @ApiProperty({
    description: 'Unique receipt code',
  })
  code: string;

  @ApiProperty({
    description: 'Customer ID (optional)',
  })
  customer?: string;

  @ApiProperty({
    description: 'The warehouse ID',
  })
  warehouse?: string;

  @ApiProperty({
    description: 'Issue receipt status',
    enum: IssueReceiptStatus,
  })
  status: IssueReceiptStatus;

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
    description: 'Issue receipt items',
    type: [IssueReceiptItemResponseDto],
    required: false,
  })
  items?: IssueReceiptItemResponseDto[];
}
