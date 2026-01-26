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
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus, PaymentStatus } from './schemas/order.schema';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { CurrentUser } from '../auth/current-user.decorator';
import { stat } from 'fs';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('public')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully created.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  createPublic(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  //createdAt
  @Get('/createdAt')
  @CheckPermission('orders', 'read')
  findByCreatedAt(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('status') status: string,
  ) {
    return this.orderService.findAll(start, end, status);
  }

  @Post()
  @CheckPermission('orders', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order has been successfully created.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.orderService.create(createOrderDto, user._id.toString());
  }

  @Get()
  @CheckPermission('orders', 'read')
  @ApiOperation({ summary: 'Get all orders or filter by status/customer' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter orders by status',
  })
  @ApiQuery({
    name: 'customer',
    required: false,
    description: 'Filter orders by customer email',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all orders or filtered orders.',
    type: [OrderResponseDto],
  })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('customer') customer?: string,
  ) {
    if (status) {
      return this.orderService.findByStatus(status);
    }
    if (customer) {
      return this.orderService.findByCustomer(customer);
    }
    return this.orderService.findAll();
  }

  @Get(':id')
  @Public()
  @CheckPermission('orders', 'read')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID (UUIDv7)',
    example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the order.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('orders', 'update')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({
    name: 'id',
    description: 'Order ID (UUIDv7)',
    example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order has been successfully updated.',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @CheckPermission('orders', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({
    name: 'id',
    description: 'Order ID (UUIDv7)',
    example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  })
  @ApiResponse({
    status: 204,
    description: 'Order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete order in current status.',
  })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  // confirm order
  // @Patch(':id/:status/submit')
  // @CheckPermission('orders', 'update')
  // @ApiOperation({ summary: 'Confirm an order' })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Order ID (UUIDv7)',
  //   example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Order has been successfully confirmed.',
  //   type: OrderResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Order not found.' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Cannot confirm order in current status.',
  // })
  // submitStatus(
  //   @Param('id') id: string,
  //   @Param('status') status: OrderStatus,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.orderService.updateStatus(id, status, user.id);
  // }

  // cancel order confirm
  // @Patch('/cancel/:id/:status')
  // @CheckPermission('orders', 'update')
  // @ApiOperation({ summary: 'Cancel an order confirmation' })
  // @ApiParam({
  //   name: 'id',
  //   description: 'Order ID (UUIDv7)',
  //   example: '01HZKY7X5Q8B9J2M6N4P7R1S3T',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Order confirmation has been successfully cancelled.',
  //   type: OrderResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Order not found.' })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Cannot cancel confirmation for order in current status.',
  // })
  // cancelStatus(
  //   @Param('id') id: string,
  //   @Param('status') status: OrderStatus,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.orderService.cancelStatus(id, status, user.id);
  // }

  // @Patch(`:id/:` + OrderStatus.CONFIRMED)
  // @CheckPermission('orders', OrderStatus.CONFIRMED)
  // updateStatusConfirm(
  //   @Param('id') id: string,
  //   @Param('status') status: OrderStatus,
  //   @CurrentUser() user: any,
  // ) {
  //   console.log('Confirming order with status:', status);
  //   return this.orderService.updateStatus(id, status, user.id);
  // }

  @Patch(`:id/` + OrderStatus.CONFIRMED)
  @CheckPermission('orders', OrderStatus.CONFIRMED)
  async updateStatusConfirmed(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // find order
    let order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    // check product availability
    // if status is Confirm Validate that all products exist and are available
    // if status is confirm Update product stock
    await this.orderService.CheckProductAvailability(order);

    return this.orderService.updateStatus(id, OrderStatus.CONFIRMED, user.id);
  }

  @Patch(`:id/` + OrderStatus.EXPORTED)
  @CheckPermission('orders', OrderStatus.EXPORTED)
  updateStatusExported(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.updateStatus(id, OrderStatus.EXPORTED, user.id);
  }

  @Patch(`:id/` + OrderStatus.DELIVERED)
  @CheckPermission('orders', OrderStatus.DELIVERED)
  async updateStatusDelivered(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    //  paymentStatus need to be 'paid' before setting to delivered
    // find order
    let order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.orderService.updateStatus(id, OrderStatus.DELIVERED, user.id, {
      paymentStatus: PaymentStatus.PAID,
      deliveryBy: user.id,
      deliveredAt: new Date(),
    });
  }

  @Patch(`:id/` + OrderStatus.COMPLETED)
  @CheckPermission('orders', OrderStatus.COMPLETED)
  updateStatusCompleted(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orderService.updateStatus(id, OrderStatus.COMPLETED, user.id);
  }

  // @Patch(':id/:status')
  // @CheckPermission('orders', 'status')
  // updateStatus(
  //   @Param('id') id: string,
  //   @Param('status') status: OrderStatus,
  //   @CurrentUser() user: any,
  // ) {
  //   return this.orderService.updateStatus(id, status, user.id);
  // }

  @Patch('/cancel/:id/:status')
  @CheckPermission('orders', 'cancel')
  cancelOrder(
    @Param('id') id: string,
    @Param('status') status: OrderStatus,
    @CurrentUser() user: any,
  ) {
    return this.orderService.cancelStatus(id, status, user.id);
  }
}
