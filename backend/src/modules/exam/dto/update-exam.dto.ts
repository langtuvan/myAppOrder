import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
} from 'class-validator';
import { ExamStatus } from '../schemas/exam.schema';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto extends PartialType(CreateExamDto) {
 
}
