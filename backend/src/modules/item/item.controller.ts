import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import {
  CreateOrderItemDto,
  UpdateOrderItemDto,
  QueryOrderItemDto,
} from './dto/item.dto';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @Public()
  @CheckPermission('items:read')
  @ApiOperation({ summary: 'List order items with optional filters' })
  @ApiQuery({ name: 'customer', required: false })
  @ApiQuery({ name: 'faculty', required: false })
  @ApiQuery({ name: 'product', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(@Query() query: QueryOrderItemDto) {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  @Public()
  @CheckPermission('items:read')
  @ApiOperation({ summary: 'Get an order item by id' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  @CheckPermission('items:create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiBody({ type: CreateOrderItemDto })
  create(@Body() dto: CreateOrderItemDto, @CurrentUser() user: any) {
    return this.itemService.create(dto, user._id);
  }

  @Patch(':id')
  @CheckPermission('items:update')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  @ApiBody({ type: UpdateOrderItemDto })
  update(@Param('id') id: string, @Body() dto: UpdateOrderItemDto, @CurrentUser() user: any) {
    return this.itemService.update(id, dto, user._id);
  }

  @Delete(':id')
  //@CheckPermission('items:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', description: 'Order item ID' })
  async remove(@Param('id') id: string) {
    await this.itemService.remove(id);
  }
}
