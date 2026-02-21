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
import { GoodsReceiptItemsService } from './goods-receipt-items.service';
import {
  CreateGoodsReceiptItemDto,
  UpdateGoodsReceiptItemDto,
} from './dto/goods-receipt-item.dto';
import { GoodsReceiptItemResponseDto } from './dto/goods-receipt-item-response.dto';

@ApiTags('goods-receipt-items')
@Controller('goods-receipt-items')
export class GoodsReceiptItemsController {
  constructor(
    private readonly goodsReceiptItemsService: GoodsReceiptItemsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new goods receipt item' })
  @ApiBody({ type: CreateGoodsReceiptItemDto })
  @ApiResponse({
    status: 201,
    description: 'Goods receipt item created successfully.',
    type: GoodsReceiptItemResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
  })
  async create(
    @Body() createGoodsReceiptItemDto: CreateGoodsReceiptItemDto,
  ): Promise<GoodsReceiptItemResponseDto> {
    return this.goodsReceiptItemsService.create(createGoodsReceiptItemDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multiple goods receipt items' })
  @ApiBody({
    type: [CreateGoodsReceiptItemDto],
    description: 'Array of goods receipt items to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Goods receipt items created successfully.',
    type: [GoodsReceiptItemResponseDto],
  })
  async createBulk(
    @Body() createGoodsReceiptItemDtos: CreateGoodsReceiptItemDto[],
  ): Promise<GoodsReceiptItemResponseDto[]> {
    return this.goodsReceiptItemsService.createBulk(createGoodsReceiptItemDtos);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all goods receipt items' })
  @ApiQuery({
    name: 'receipt',
    required: false,
    description: 'Filter by goods receipt ID',
  })
  @ApiQuery({
    name: 'product',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of goods receipt items.',
    type: [GoodsReceiptItemResponseDto],
  })
  async findAll(
    @Query('receipt') receiptId?: string,
    @Query('product') productId?: string,
  ): Promise<GoodsReceiptItemResponseDto[]> {
    if (receiptId) {
      return this.goodsReceiptItemsService.findByGoodsReceipt(receiptId);
    }
    if (productId) {
      return this.goodsReceiptItemsService.findByProduct(productId);
    }
    return this.goodsReceiptItemsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get goods receipt item by ID' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt item ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt item found.',
    type: GoodsReceiptItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt item not found.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<GoodsReceiptItemResponseDto> {
    return this.goodsReceiptItemsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a goods receipt item' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt item ID',
  })
  @ApiBody({ type: UpdateGoodsReceiptItemDto })
  @ApiResponse({
    status: 200,
    description: 'Goods receipt item updated successfully.',
    type: GoodsReceiptItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt item not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGoodsReceiptItemDto: UpdateGoodsReceiptItemDto,
  ): Promise<GoodsReceiptItemResponseDto> {
    return this.goodsReceiptItemsService.update(id, updateGoodsReceiptItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a goods receipt item' })
  @ApiParam({
    name: 'id',
    description: 'The goods receipt item ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Goods receipt item deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Goods receipt item not found.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.goodsReceiptItemsService.delete(id);
  }
}
