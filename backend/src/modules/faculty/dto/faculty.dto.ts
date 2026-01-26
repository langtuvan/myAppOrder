import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  IsEmail,
  ValidateNested,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus, RoomType } from '../../room/schemas/room.schema';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFacultyDto {
  totalRooms?: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: Record<string, string>;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  dean?: string;

  @IsEmail()
  @IsOptional()
  deanEmail?: string;

  @IsString()
  @IsOptional()
  deanPhone?: string;

  @IsOptional()
  description?: Record<string, string>;

  @IsOptional()
  location?: Record<string, string>;

  @IsOptional()
  @IsArray()
  //@IsMongoId({ each: true })
  rooms?: string[];

  @IsString()
  @IsOptional()
  head?: string;

  //isActive?: boolean;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {}
