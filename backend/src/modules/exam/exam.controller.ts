import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Public } from '../../decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReceptionService } from '../reception/reception.service';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService,
    private readonly receptionService: ReceptionService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  create(@Body() createExamDto: CreateExamDto, @CurrentUser() user: any) {
    const createdBy = user?.id;
    return this.examService.create(createExamDto, createdBy);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of all exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get('by-status')
  @ApiOperation({ summary: 'Get exams by status' })
  @ApiResponse({ status: 200, description: 'List of exams with given status' })
  findByStatus(@Query('status') status: string) {
    return this.examService.findByStatus(status);
  }

  @Get('by-faculty')
  @ApiOperation({ summary: 'Get exams by faculty' })
  @ApiResponse({
    status: 200,
    description: 'List of exams for given faculty',
  })
  findByFacultyId(@Query('facultyId') facultyId: string) {
    return this.examService.findByFacultyId(facultyId);
  }

  @Get('by-room')
  @ApiOperation({ summary: 'Get exams by room' })
  @ApiResponse({
    status: 200,
    description: 'List of exams in given room',
  })
  findByRoomId(@Query('roomId') roomId: string) {
    return this.examService.findByRoomId(roomId);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get exams by date' })
  @ApiResponse({
    status: 200,
    description: 'List of exams on given date',
  })
  findByDate(@Query('date') date: string) {
    return this.examService.findByDate(date);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  findById(@Param('id') id: string) {
    return this.examService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update exam status' })
  @ApiResponse({ status: 200, description: 'Exam status updated successfully' })
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.examService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam' })
  @ApiResponse({ status: 200, description: 'Exam deleted successfully' })
  async remove(@Param('id') id: string) {
   
    const removeItem = await this.examService.remove(id);
    await this.receptionService.updateExamList(
      removeItem.reception.toString(),
      id,
    );
    return removeItem;

  }
}
