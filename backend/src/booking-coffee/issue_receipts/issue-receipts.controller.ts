import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { IssueReceiptsService } from './issue-receipts.service';
import {
  CreateIssueReceiptDto,
  CreateIssueReceiptDtoWithItems,
  UpdateIssueReceiptDto,
} from './dto/issue-receipt.dto';
import { IssueReceiptResponseDto } from './dto/issue-receipt-response.dto';
import { IssueReceiptItemsService } from '../issue_receipt_items';
import { CurrentUser } from '../auth/current-user.decorator';
import { InventoryTransactionsService } from '../inventory_transactions/inventory_transactions.service';

@ApiTags('issue-receipts')
@Controller()
export class IssueReceiptsController {
  constructor(
    private readonly issueReceiptsService: IssueReceiptsService,
    private readonly issueReceiptItemsService: IssueReceiptItemsService,
    private readonly inventoryTransactionsService: InventoryTransactionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new issue receipt' })
  @ApiBody({ type: CreateIssueReceiptDtoWithItems })
  @ApiResponse({
    status: 201,
    description: 'Issue receipt created successfully.',
    type: IssueReceiptResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or duplicate receipt code.',
  })
  async create(
    @Body() createIssueReceiptDto: CreateIssueReceiptDtoWithItems,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    return this.issueReceiptsService.create(
      createIssueReceiptDto,
      currentUser._id,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all issue receipts' })
  @ApiQuery({
    name: 'warehouse',
    required: false,
    description: 'Filter by warehouse ID',
  })
  @ApiQuery({
    name: 'customer',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: ['draft', 'completed', 'cancelled'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of issue receipts.',
    type: [IssueReceiptResponseDto],
  })
  async findAll(
    @Query('warehouse') warehouseId?: string,
    @Query('customer') customerId?: string,
    @Query('status') status?: string,
  ): Promise<IssueReceiptResponseDto[]> {
    if (warehouseId) {
      return this.issueReceiptsService.findByWarehouse(warehouseId);
    }
    if (customerId) {
      return this.issueReceiptsService.findByCustomer(customerId);
    }
    if (status) {
      return this.issueReceiptsService.findByStatus(status);
    }
    return this.issueReceiptsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get issue receipt by ID' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue receipt data.',
    type: IssueReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt not found.',
  })
  async findById(@Param('id') id: string): Promise<IssueReceiptResponseDto> {
    return this.issueReceiptsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update issue receipt' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiBody({ type: UpdateIssueReceiptDto })
  @ApiResponse({
    status: 200,
    description: 'Issue receipt updated successfully.',
    type: IssueReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateIssueReceiptDto: UpdateIssueReceiptDto,
  ): Promise<IssueReceiptResponseDto> {
    return this.issueReceiptsService.update(id, updateIssueReceiptDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete issue receipt' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 204,
    description: 'Issue receipt deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt not found.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.issueReceiptsService.delete(id);
  }
}
