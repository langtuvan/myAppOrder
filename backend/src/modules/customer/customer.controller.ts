import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  PaginationDto,
  PaginatedResponse,
} from './dto/customer.dto';
import { CustomerDocument } from './schemas/customer.schema';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';


function toCustomerResponse(customer: CustomerDocument) {
  return customer.toJSON ? customer.toJSON() : customer;
}

function toPaginatedCustomerResponse(
  paginatedCustomers: PaginatedResponse<CustomerDocument>,
): PaginatedResponse<any> {
  return {
    data: paginatedCustomers.data.map(toCustomerResponse),
    pagination: paginatedCustomers.pagination,
  };
}

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerService.create(createCustomerDto);
    return toCustomerResponse(customer);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all customers with pagination' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by first name, last name, email, or phone',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['firstName', 'lastName', 'email', 'createdAt'],
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status (active, inactive, suspended)',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include deleted customers',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<any>> {
    const paginatedCustomers =
      await this.customerService.findAllPaginated(paginationDto);
    return toPaginatedCustomerResponse(paginatedCustomers);
  }

  @Get('all')
  @Public()
  @ApiOperation({
    summary: 'Get all customers without pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'All customers retrieved successfully',
  })
  async findAllWithoutPagination() {
    const customers = await this.customerService.findAll();
    return customers.map(toCustomerResponse);
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiResponse({
    status: 200,
    description: 'Customer statistics retrieved successfully',
  })
  async getStats() {
    return this.customerService.getStats();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customerService.findOne(id);
    return toCustomerResponse(customer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.update(id, updateCustomerDto);
    return toCustomerResponse(customer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customerService.remove(id);
    return toCustomerResponse(customer);
  }

  @Put(':id/restore')
  @ApiOperation({ summary: 'Restore deleted customer' })
  @ApiResponse({ status: 200, description: 'Customer restored successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customerService.restore(id);
    return toCustomerResponse(customer);
  }


  // get customers by phone number
  @Get('by-phone/:phone')
  @Public()
  @ApiOperation({ summary: 'Get customers by phone number' })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
  })
  async findByPhone(@Param('phone') phone: string) {
    const customers = await this.customerService.findByPhone(phone);
    return customers.map(toCustomerResponse);
  }
}
