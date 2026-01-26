import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
  Min,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PartialType } from '@nestjs/mapped-types';
import { AmenityStatus } from '../schemas/amenities.schema';

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: Record<string, string>;

  @IsOptional()
  description?: Record<string, string>;

  @IsOptional()
  @IsEnum(Object.values(AmenityStatus))
  status?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {}

export class AmenityResponseDto {
  _id: string;
  code: string;
  name: Record<string, string>;
  description?: Record<string, string>;
}
