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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';

import { join } from 'path';
import { unlink } from 'fs/promises';
import { multerOptions } from '../../utils/upload';

const imagesUploadPath = '/upload/images/ecommerce-images/product/';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @CheckPermission('products', 'read')
  @Public()
  @ApiOperation({ summary: 'Get all products or filter by category' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all products or filtered by category.',
    type: [ProductResponseDto],
  })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.productService.findByCategory(category);
    }

    return this.productService.findAll();
  }

  @Get(':id')
  @CheckPermission('products', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product.',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @CheckPermission('products', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully created.',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  @CheckPermission('products', 'update')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product has been successfully updated.',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @CheckPermission('products', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post(':id/upload-images')
  @CheckPermission('products', 'update')
  @UseInterceptors(
    FilesInterceptor('files', 5, multerOptions(imagesUploadPath)),
  )
  async handleUploadImages(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1200000 }),
          // new FileTypeValidator({
          //   fileType: new RegExp('image\\/(png|jpg|jpeg|webp)'),
          // }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const images = files.map(
      (file) => file && `${imagesUploadPath}${file.filename}`,
    );

    return this.productService.updateImages(id, images);
  }

  // Delete a specific image from product images
  @Post(':id/delete-image/')
  @CheckPermission('products', 'update')
  @ApiOperation({ summary: 'Delete a specific image from product images' })
  async deleteImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string },
  ) {
    const { imageUrl } = body;
    if (!imageUrl) {
      throw new BadRequestException('Image URL is required');
    }

    const deleteImageUrl = imagesUploadPath + imageUrl;
    // Construct full file path
    const deleteImagePath = join(process.cwd(), 'client', deleteImageUrl);

    try {
      const deleted = await this.productService.deleteImage(
        id,
        deleteImageUrl,
      );
      await unlink(deleteImagePath);
      return deleted;
    } catch (error) {
      throw new BadRequestException('Failed to delete image');
    }
  }
}
