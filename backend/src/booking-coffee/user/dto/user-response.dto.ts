import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty({ required: false })
  readonly age?: number;

  @ApiProperty({ required: false })
  readonly gender?: string;

  @ApiProperty({ required: false })
  readonly address?: string;

  @ApiProperty({ type: Object })
  readonly role: {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
  };

  @ApiProperty({ required: false })
  readonly createdAt?: string;

  @ApiProperty({ required: false })
  readonly updatedAt?: string;
}
