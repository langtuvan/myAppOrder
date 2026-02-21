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
import { GoodsReceiptsService } from './goods-receipts.service';
import {
  CreateGoodsReceiptDto,
  CreateGoodsReceiptDtoWithItems,
  UpdateGoodsReceiptDto,
} from './dto/goods-receipt.dto';
import { GoodsReceiptResponseDto } from './dto/goods-receipt-response.dto';
import { GoodsReceiptItemsService } from '../goods_receipt_items';
import { CurrentUser } from '../auth/current-user.decorator';
import { InventoryTransactionsService } from '../inventory_transactions/inventory_transactions.service';

@ApiTags('goods-receipts')
@Controller('goods-receipts')
export class GoodsReceiptsController {
  constructor(
    private readonly goodsReceiptsService: GoodsReceiptsService,
    private readonly goodsReceiptItemsService: GoodsReceiptItemsService,
    private readonly inventoryTransactionsService: InventoryTransactionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new goods receipt' })
  @ApiBody({ type: CreateGoodsReceiptDtoWithItems })
  @ApiResponse({
    status: 201,
    description: 'Goods receipt created successfully.',
    type: GoodsReceiptResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or duplicate receipt code.',
  })
  async create(
    @Body() createGoodsReceiptDto: CreateGoodsReceiptDtoWithItems,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    return this.goodsReceiptsService.create(
      createGoodsReceiptDto,
      currentUser._id,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all goods receipts' })
  @ApiQuery({
    name: 'warehouse',
    required: false,
    description: 'Filter by warehouse ID',
  })
  @ApiQuery({
    name: 'supplier',
    required: false,
    description: 'Filter by supplier ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: ['draft', 'completed', 'cancelled'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of goods receipts.',
    type: [GoodsReceiptResponseDto],
  })
  async findAll(
    @Query('warehouse') warehouseId?: string,
    @Query('supplier') supplierId?: string,
    @Query('status') status?: string,
  ): Promise<GoodsReceiptResponseDto[]> {
    if (warehouseId) {
      return this.goodsReceiptsService.findByWarehouse(warehouseId);
    }
    if (supplierId) {
      return this.goodsReceiptsService.findBySupplier(supplierId);
    }
    if (status) {
      return this.goodsReceiptsService.findByStatus(status);
    }
    return this.goodsReceiptsService.findAll();
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get goods receipt by code' })
  @ApiParam({
    name: 'code',
    description: 'The receipt code',
    example: 'GR000123',
  })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt found.',
    type: GoodsReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt not found.',
  })
  async findByCode(
    @Param('code') code: string,
  ): Promise<GoodsReceiptResponseDto> {
    return this.goodsReceiptsService.findByCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get goods receipt by ID' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt found.',
    type: GoodsReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt not found.',
  })
  async findById(@Param('id') id: string): Promise<GoodsReceiptResponseDto> {
    console.log('Fetching goods receipt with ID:', id);
    const find = await this.goodsReceiptsService.findById(id);
    const items = await this.goodsReceiptItemsService.findByGoodsReceipt(id);
    return { ...find, items };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a goods receipt' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt ID',
  })
  @ApiBody({ type: UpdateGoodsReceiptDto })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt updated successfully.',
    type: GoodsReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGoodsReceiptDto: UpdateGoodsReceiptDto,
  ): Promise<GoodsReceiptResponseDto> {
    return this.goodsReceiptsService.update(id, updateGoodsReceiptDto);
  }

  @Patch(':id/status/:status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update goods receipt status' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt ID',
  })
  @ApiParam({
    name: 'status',
    description: 'The new status',
    enum: ['draft', 'completed', 'cancelled'],
  })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt status updated successfully.',
    type: GoodsReceiptResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt not found.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: string,
  ): Promise<GoodsReceiptResponseDto> {
    return this.goodsReceiptsService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a goods receipt' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Goods receipt deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt not found.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.goodsReceiptsService.delete(id);
  }
}
