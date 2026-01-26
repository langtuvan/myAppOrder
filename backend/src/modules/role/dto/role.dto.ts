import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Administrator role with full access',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['507f1f77bcf86cd799439011'], required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  permissions?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
