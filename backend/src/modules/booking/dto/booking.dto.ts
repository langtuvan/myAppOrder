import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsEnum,
  Min,
  IsEmail,
  IsPhoneNumber,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  faculty: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  hour: number;

  @IsNumber()
  @IsNotEmpty()
  minute: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;

  // status
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
