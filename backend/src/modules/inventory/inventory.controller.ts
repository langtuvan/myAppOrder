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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { InventoryResponseDto } from './dto/inventory-response.dto';
import { CheckPermission } from '../../casl';
import { Inventory } from './schemas/inventory.schema';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  //@CheckPermission('inventory', 'create')
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({
    status: 201,
    description: 'Inventory item created successfully.',
    type: InventoryResponseDto,
  })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<Inventory> {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  //@CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'Return all inventory items.',
    type: [InventoryResponseDto],
  })
  async findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get('warehouse/:warehouseId')
  //@CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get inventory items for a specific warehouse' })
  @ApiParam({ name: 'warehouseId', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Return inventory items for the warehouse.',
    type: [InventoryResponseDto],
  })
  async findByWarehouse(
    @Param('warehouseId') warehouseId: string,
  ): Promise<Inventory[]> {
    return this.inventoryService.findByWarehouse(warehouseId);
  }

  @Get('product/:productId')
  @CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get inventory items for a specific product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Return inventory items for the product.',
    type: [InventoryResponseDto],
  })
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<Inventory[]> {
    return this.inventoryService.findByProduct(productId);
  }

  @Get(':id')
  //@CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get a specific inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the inventory item.',
    type: InventoryResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  //@CheckPermission('inventory', 'update')
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiBody({ type: UpdateInventoryDto })
  @ApiResponse({
    status: 200,
    description: 'Inventory item updated successfully.',
    type: InventoryResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  //@CheckPermission('inventory', 'delete')
  @ApiOperation({ summary: 'Delete an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiResponse({
    status: 204,
    description: 'Inventory item deleted successfully.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.inventoryService.remove(id);
  }

  @Post(':id/add-stock')
  //@CheckPermission('inventory', 'update')
  @ApiOperation({ summary: 'Add stock to an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } } } })
  @ApiResponse({
    status: 200,
    description: 'Stock added successfully.',
    type: InventoryResponseDto,
  })
  async addStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Inventory> {
    return this.inventoryService.addStock(id, body.quantity);
  }

  @Post(':id/remove-stock')
  //@CheckPermission('inventory', 'update')
  @ApiOperation({ summary: 'Remove stock from an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } } } })
  @ApiResponse({
    status: 200,
    description: 'Stock removed successfully.',
    type: InventoryResponseDto,
  })
  async removeStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Inventory> {
    return this.inventoryService.removeStock(id, body.quantity);
  }

  @Post(':id/reserve')
  //@CheckPermission('inventory', 'update')
  @ApiOperation({ summary: 'Reserve stock for an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } } } })
  @ApiResponse({
    status: 200,
    description: 'Stock reserved successfully.',
    type: InventoryResponseDto,
  })
  async reserveStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Inventory> {
    return this.inventoryService.reserveStock(id, body.quantity);
  }

  @Post(':id/unreserve')
  //@CheckPermission('inventory', 'update')
  @ApiOperation({ summary: 'Unreserve stock for an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } } } })
  @ApiResponse({
    status: 200,
    description: 'Stock unreserved successfully.',
    type: InventoryResponseDto,
  })
  async unreserveStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Inventory> {
    return this.inventoryService.unreserveStock(id, body.quantity);
  }

  @Get('status/low-stock')
  //@CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get items with low stock' })
  @ApiResponse({
    status: 200,
    description: 'Return items below minimum stock level.',
    type: [Inventory],
  })
  async getLowStockItems(): Promise<Inventory[]> {
    return this.inventoryService.getLowStockItems();
  }

  @Get('status/high-stock')
  //@CheckPermission('inventory', 'read')
  @ApiOperation({ summary: 'Get items with high stock' })
  @ApiResponse({
    status: 200,
    description: 'Return items above maximum stock level.',
    type: [InventoryResponseDto],
  })
  async getHighStockItems(): Promise<Inventory[]> {
    return this.inventoryService.getHighStockItems();
  }
}
