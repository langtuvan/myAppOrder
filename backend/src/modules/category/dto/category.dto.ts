import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CategoryType } from '../schemas/category.schema';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsString()
  name: string;
  
  @ApiProperty({
    description: 'The type of the category',
    enum: CategoryType,
    example: CategoryType.PRODUCT,
  })
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiProperty({
    description: 'The description of the category',
    example: 'Electronic devices and accessories',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  // images
  @ApiProperty({
    description: 'Array of image URLs for the category',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
