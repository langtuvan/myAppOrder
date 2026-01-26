import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { CreateExamDto } from '../../exam/dto/create-exam.dto';
import { CreateOrderItemDto } from '../../item/dto/item.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../../customer/dto/customer.dto';

export class CreateReceptionDto {
  @ApiProperty({ description: 'Customer', required: true })
  @IsNotEmpty()
  customer: UpdateCustomerDto;

  @ApiProperty({
    description: 'Examinations IDs',
    type: [CreateExamDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  exams?: CreateExamDto[];

  @ApiProperty({
    description: 'Order Items IDs',
    type: [CreateOrderItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  items?: CreateOrderItemDto[];

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Faculty ID', required: true })
  @IsString()
  @IsNotEmpty()
  faculty?: string;

  @ApiProperty({ description: 'Room ID', required: false })
  @IsString()
  @IsOptional()
  room?: string;

  //status
  @ApiProperty({ description: 'Reception Status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'System-created example flag',
    required: false,
    readOnly: true,
  })
  @IsBoolean()
  @IsOptional()
  isExample?: boolean;
}

export class UpdateReceptionDto extends PartialType(CreateReceptionDto) {}

// export class CustomerReceptionDto extends PartialType(CreateCustomerDto) {
//   @IsString()
//   @IsOptional()
//   _id: string;
// }

export class UpdateCustomerReceptionDto extends PartialType(UpdateCustomerDto) {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class CreateReceptionInput extends OmitType(CreateReceptionDto, [
  'customer',
] as const) {
  @ApiProperty({ description: 'Customer', required: true })
  @IsNotEmpty()
  @IsString()
  customer: string;
}
