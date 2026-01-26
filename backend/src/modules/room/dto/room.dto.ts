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

export class CreateRoomDto {
  // @IsString()
  // @IsNotEmpty()
  // faculty: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsNotEmpty()
  name: Record<string, string>;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RoomType)
  @IsOptional()
  type?: RoomType;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @IsNumber()
  @IsOptional()
  floor?: number;

  @IsString()
  @IsOptional()
  building?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
}