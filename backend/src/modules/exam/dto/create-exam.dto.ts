import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ExamStatus } from '../schemas/exam.schema';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  faculty: string;

  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsString()
  @IsNotEmpty()
  reception: string;

  @IsString()
  @IsNotEmpty()
  room: string;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  qty: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  //@IsEnum(ExamStatus)
  @IsString()
  @IsOptional()
  status?: string;
  //status?: ExamStatus;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // @IsArray()
  // @IsString({ each: true })
  // @IsOptional()
  // invigilators?: string[];

  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // totalStudents?: number;

  // @IsString()
  // @IsOptional()
  // duration?: string;
}
