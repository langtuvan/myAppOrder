import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class PermissionResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @Expose()
  _id: string;

  @ApiProperty({ example: 'create_user' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Create new users', required: false })
  @Expose()
  description?: string;

  @ApiProperty({ example: 'create' })
  @Expose()
  action: string;

  @ApiProperty({ example: '/api/users' })
  @Expose()
  apiPath: string;

  @ApiProperty({
    example: 'POST',
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  @Expose()
  method: string;

  @ApiProperty({ example: 'user' })
  @Expose()
  module: string;

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
