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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { CheckPermission } from '../../casl';
import { Warehouse } from './schemas/warehouse.schema';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermission('warehouses', 'create')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiBody({ type: CreateWarehouseDto })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully.',
    type: WarehouseResponseDto,
  })
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  @CheckPermission('warehouses', 'read')
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({
    status: 200,
    description: 'Return all warehouses.',
    type: [WarehouseResponseDto],
  })
  async findAll(): Promise<Warehouse[]> {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  @CheckPermission('warehouses', 'read')
  @ApiOperation({ summary: 'Get a specific warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the warehouse.',
    type: WarehouseResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<Warehouse> {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('warehouses', 'update')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiBody({ type: UpdateWarehouseDto })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully.',
    type: WarehouseResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermission('warehouses', 'delete')
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 204,
    description: 'Warehouse deleted successfully.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.warehousesService.remove(id);
  }

//   @Get(':id/capacity')
//   //@CheckPermission('warehouses', 'read')
//   @ApiOperation({ summary: 'Get available capacity of a warehouse' })
//   @ApiParam({ name: 'id', description: 'Warehouse ID' })
//   @ApiResponse({
//     status: 200,
//     description: 'Return available capacity.',
//   })
//   async getAvailableCapacity(
//     @Param('id') id: string,
//   ): Promise<{ available: number }> {
//     const available = await this.warehousesService.getAvailableCapacity(id);
//     return { available };
//   }
}
