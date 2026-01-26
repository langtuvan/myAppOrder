import { ApiProperty } from '@nestjs/swagger';

export class ReceptionResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  staffAssigned?: object;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  operatingHours?: string;

  @ApiProperty({ required: false, isArray: true })
  services?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
