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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { CheckPermission } from '../../casl';
import { Supplier } from './schemas/supplier.schema';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermission('suppliers', 'create')
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({
    status: 201,
    description: 'Supplier created successfully.',
    type: SupplierResponseDto,
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @CheckPermission('suppliers', 'read')
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({
    status: 200,
    description: 'List of suppliers retrieved successfully.',
    type: [SupplierResponseDto],
  })
  async findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @CheckPermission('suppliers', 'read')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the supplier to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier retrieved successfully.',
    type: SupplierResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('suppliers', 'update')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the supplier to update',
  })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({
    status: 200,
    description: 'Supplier updated successfully.',
    type: SupplierResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermission('suppliers', 'delete')
  @ApiOperation({ summary: 'Delete a supplier' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the supplier to delete',
  })
  @ApiResponse({
    status: 204,
    description: 'Supplier deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  async remove(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.remove(id);
  }
}
