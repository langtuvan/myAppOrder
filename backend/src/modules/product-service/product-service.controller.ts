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
import { ProductServiceService } from './product-service.service';
import {
  CreateProductServiceDto,
  UpdateProductServiceDto,
} from './dto/product-service.dto';
import { ProductServiceResponseDto } from './dto/product-service-response.dto';
import { CheckPermission } from '../../casl';
import { Public } from '../../decorators/public.decorator';

@ApiTags('product-services')
@Controller('product-services')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  // Get all product services or filter by product ID

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all product services for reception' })
  @ApiResponse({
    status: 200,
    description: 'Return all product services for reception.',
    type: [ProductServiceResponseDto],
  })
  async findAllForReception() {
    const finds = await this.productServiceService.findAll();
    //reduce to array of object with category has children are product services
    const result = finds.reduce((acc, curr) => {
      {
        const category = curr.category as any;
        if (!acc[category._id]) {
          acc[category._id] = {
            _id: category._id,
            name: category.name,
            services: [],
          };
        }
        acc[category._id].services.push(curr);
        return acc;
      }
    }, {} as any);

    return Object.values(result);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product services' })
  @ApiQuery({
    name: 'product',
    required: false,
    description: 'Filter product services by product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all product services or filtered by product.',
    type: [ProductServiceResponseDto],
  })
  findAll(@Query('product') product?: string) {
    if (product) {
      return this.productServiceService.findByProduct(product);
    }
    return this.productServiceService.findAll();
  }

  @Get(':id')
  @Public()
  @CheckPermission('products', 'read')
  @ApiOperation({ summary: 'Get a product service by ID' })
  @ApiParam({ name: 'id', description: 'Product Service ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product service.',
    type: ProductServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product service not found.' })
  findOne(@Param('id') id: string) {
    return this.productServiceService.findOne(id);
  }

  @Post()
  @CheckPermission('products', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product service' })
  @ApiBody({ type: CreateProductServiceDto })
  @ApiResponse({
    status: 201,
    description: 'Product service has been successfully created.',
    type: ProductServiceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductServiceDto: CreateProductServiceDto) {
    return this.productServiceService.create(createProductServiceDto);
  }

  @Patch(':id')
  @CheckPermission('products', 'update')
  @ApiOperation({ summary: 'Update a product service' })
  @ApiParam({ name: 'id', description: 'Product Service ID' })
  @ApiBody({ type: UpdateProductServiceDto })
  @ApiResponse({
    status: 200,
    description: 'Product service has been successfully updated.',
    type: ProductServiceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product service not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(
    @Param('id') id: string,
    @Body() updateProductServiceDto: UpdateProductServiceDto,
  ) {
    return this.productServiceService.update(id, updateProductServiceDto);
  }

  @Delete(':id')
  @CheckPermission('products', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product service' })
  @ApiParam({ name: 'id', description: 'Product Service ID' })
  @ApiResponse({
    status: 204,
    description: 'Product service has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product service not found.' })
  remove(@Param('id') id: string) {
    return this.productServiceService.remove(id);
  }
}
