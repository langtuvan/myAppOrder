import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsMongoId,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductServiceDto {
  @ApiProperty({
    description: 'The category ID this service is associated with',
    example: '60d5ecb74b24a92c5c8b1234',
  })
  @IsMongoId()
  category: string;

  @IsOptional()
  @IsObject()
  name?: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @ApiProperty({
    description: 'The price of the service',
    example: 99.99,
  })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Whether the service is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'The duration of the service',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  duration: number;

  // @IsOptional()
  // @IsArray()
  // tags?: string[];
}

export class UpdateProductServiceDto extends PartialType(
  CreateProductServiceDto,
) {}
