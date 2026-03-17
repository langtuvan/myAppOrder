import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'create_user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Create new users', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  action: string;

  @ApiProperty({ example: '/api/users' })
  @IsString()
  apiPath: string;

  @ApiProperty({
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  @IsEnum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  module: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsMongoId()
  updatedBy?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsMongoId()
  deletedBy?: string;
}
