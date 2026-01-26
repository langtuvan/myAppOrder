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
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utils/upload';
import { Express } from 'express';
import { join } from 'path';
import { unlink } from 'fs/promises';

const imagesUploadPath = '/upload/images/ecommerce-images/category/';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CheckPermission('categories', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category has been successfully created.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories.',
    type: [CategoryResponseDto],
  })
  findAll() {
    return this.categoryService.findAll({
      type: 'PRODUCT',
    });
  }

  @Get(':id')
  @CheckPermission('categories', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the category.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('categories', 'update')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category has been successfully updated.',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @CheckPermission('categories', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({
    status: 204,
    description: 'Category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  // upload images for category
  @Post(':id/upload-images')
  @CheckPermission('categories', 'update')
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

    return this.categoryService.updateImages(id, images);
  }

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
      const deleted = await this.categoryService.deleteImage(
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
