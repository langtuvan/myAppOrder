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
import { InventoryTransactionsService } from './inventory_transactions.service';
import {
  CreateInventoryTransactionDto,
  UpdateInventoryTransactionDto,
} from './dto/inventory-transaction.dto';
import { InventoryTransactionResponseDto } from './dto/inventory-transaction-response.dto';
import { CheckPermission } from '../../casl';
import { InventoryTransaction } from './schemas/inventory-transaction.schema';

@ApiTags('inventory-transactions')
@Controller('inventory-transactions')
export class InventoryTransactionsController {
  constructor(
    private readonly transactionsService: InventoryTransactionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  //@CheckPermission('inventory-transactions', 'create')
  @ApiOperation({ summary: 'Create a new inventory transaction' })
  @ApiBody({ type: CreateInventoryTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully.',
    type: InventoryTransactionResponseDto,
  })
  async create(
    @Body() createTransactionDto: CreateInventoryTransactionDto,
  ): Promise<InventoryTransaction> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get all inventory transactions' })
  @ApiResponse({
    status: 200,
    description: 'Return all inventory transactions.',
    type: [InventoryTransactionResponseDto],
  })
  async findAll(): Promise<InventoryTransaction[]> {
    return this.transactionsService.findAll();
  }

  @Get('by-inventory/:inventoryId')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions for a specific inventory item' })
  @ApiParam({ name: 'inventoryId', description: 'Inventory item ID' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions for the inventory item.',
    type: [InventoryTransactionResponseDto],
  })
  async findByInventory(
    @Param('inventoryId') inventoryId: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.findByInventory(inventoryId);
  }

  @Get('by-type/:type')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions by type' })
  @ApiParam({ name: 'type', description: 'Transaction type' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions of the specified type.',
    type: [InventoryTransactionResponseDto],
  })
  async findByType(
    @Param('type') type: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.findByType(type);
  }

  @Get('by-warehouse/:warehouseId')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions for a specific warehouse' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions for the warehouse.',
    type: [InventoryTransactionResponseDto],
  })
  async findByWarehouse(
    @Param('warehouseId') warehouseId: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.findByWarehouse(warehouseId);
  }

  @Get('by-reference/:reference')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions by reference' })
  @ApiParam({ name: 'reference', description: 'Transaction reference' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions with the specified reference.',
    type: [InventoryTransactionResponseDto],
  })
  async findByReference(
    @Param('reference') reference: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.findByReference(reference);
  }

  @Get(':id')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get a specific transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction.',
    type: InventoryTransactionResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<InventoryTransaction> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  //@CheckPermission('inventory-transactions', 'update')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiBody({ type: UpdateInventoryTransactionDto })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully.',
    type: InventoryTransactionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateInventoryTransactionDto,
  ): Promise<InventoryTransaction> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  //@CheckPermission('inventory-transactions', 'delete')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 204,
    description: 'Transaction deleted successfully.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }

  @Post(':id/approve')
  //@CheckPermission('inventory-transactions', 'update')
  @ApiOperation({ summary: 'Approve a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiBody({
    schema: { properties: { approvedBy: { type: 'string' } } },
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction approved successfully.',
    type: InventoryTransactionResponseDto,
  })
  async approve(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ): Promise<InventoryTransaction> {
    return this.transactionsService.approve(id, body.approvedBy);
  }

  @Get('status/pending-approvals')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions pending approval' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions pending approval.',
    type: [InventoryTransaction],
  })
  async getPendingApprovals(): Promise<InventoryTransaction[]> {
    return this.transactionsService.getPendingApprovals();
  }

  @Get('history/:inventoryId')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transaction history for an inventory item' })
  @ApiParam({ name: 'inventoryId', description: 'Inventory item ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum records' })
  @ApiResponse({
    status: 200,
    description: 'Return transaction history.',
    type: [InventoryTransactionResponseDto],
  })
  async getTransactionHistory(
    @Param('inventoryId') inventoryId: string,
    @Query('limit') limit: string = '10',
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.getTransactionHistory(
      inventoryId,
      parseInt(limit, 10),
    );
  }

  @Get('range/date-range')
  //@CheckPermission('inventory-transactions', 'read')
  @ApiOperation({ summary: 'Get transactions within a date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (ISO format)' })
  @ApiQuery({ name: 'endDate', description: 'End date (ISO format)' })
  @ApiResponse({
    status: 200,
    description: 'Return transactions within the date range.',
    type: [InventoryTransactionResponseDto],
  })
  async getTransactionsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionsService.getTransactionsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }
}
