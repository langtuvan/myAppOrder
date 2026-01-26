import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus, RoomType } from '../../room/schemas/room.schema';


export class RoomResponseDto {
  @ApiProperty()
  roomNumber: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: RoomType })
  type: RoomType;

  @ApiProperty()
  capacity: number;

  @ApiProperty({ enum: RoomStatus })
  status: RoomStatus;

  @ApiProperty()
  floor?: number;

  @ApiProperty()
  building?: string;

  @ApiProperty({ type: [String] })
  amenities?: string[];

  @ApiProperty()
  description?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class FacultyResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department?: string;

  @ApiProperty()
  dean?: string;

  @ApiProperty()
  deanEmail?: string;

  @ApiProperty()
  deanPhone?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [RoomResponseDto] })
  rooms: RoomResponseDto[];

  @ApiProperty()
  head?: string;

  @ApiProperty()
  totalRooms: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
