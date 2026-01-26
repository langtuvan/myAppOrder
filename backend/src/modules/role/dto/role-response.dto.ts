import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from '../../permission/dto/permission-response.dto'; 
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class RoleResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Expose()
  _id: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Administrator role with full access',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({ type: [PermissionResponseDto], required: false })
  @Expose()
  @Type(() => PermissionResponseDto)
  permissions?: PermissionResponseDto[];

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: false })
  @Expose()
  isDeleted: boolean;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Expose()
  @Type(() => UserResponseDto)
  createdBy?: UserResponseDto;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Expose()
  @Type(() => UserResponseDto)
  updatedBy?: UserResponseDto;

  @ApiProperty({ type: UserResponseDto, required: false })
  @Expose()
  @Type(() => UserResponseDto)
  deletedBy?: UserResponseDto;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
