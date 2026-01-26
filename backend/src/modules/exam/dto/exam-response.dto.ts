import { Exclude, Expose, Type } from 'class-transformer';

export class RoomResponseDto {
  @Expose()
  _id: string;

  @Expose()
  roomNumber: string;

  @Expose()
  name: string;
}

export class FacultyResponseDto {
  @Expose()
  _id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class ProductServiceResponseDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  price: number;
}

export class ExamResponseDto {
  @Expose()
  _id: string;

  @Expose()
  @Type(() => FacultyResponseDto)
  faculty: FacultyResponseDto;

  @Expose()
  @Type(() => RoomResponseDto)
  room: RoomResponseDto;

  @Expose()
  @Type(() => ProductServiceResponseDto)
  service: ProductServiceResponseDto;

  @Expose()
  qty: number;

  @Expose()
  price: number;

  @Expose()
  status: string;

  @Expose()
  date: string;

  @Expose()
  @Type(() => String)
  notes?: string;

  @Expose()
  @Type(() => String)
  invigilators?: string[];

  @Expose()
  totalStudents?: number;

  @Expose()
  duration?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
