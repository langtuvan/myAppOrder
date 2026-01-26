import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import {
  FacultyResponseDto,
  RoomResponseDto,
} from '../faculty/dto/faculty-response.dto';
import { CheckPermission } from '../../casl';
import { Public } from '../../decorators/public.decorator';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post(':facultyId')
  @CheckPermission('rooms','create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a room under a faculty' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
    status: 201,
    description: 'Room created and faculty updated',
    type: FacultyResponseDto,
  })
  create(@Param('facultyId') facultyId: string, @Body() dto: CreateRoomDto) {
    return this.roomService.create(facultyId, dto);
  }

  @Get('/by-faculty/:facultyId')
  @CheckPermission('rooms', 'read')
  @Public()
  @ApiOperation({ summary: 'List rooms of a faculty' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiResponse({
    status: 200,
    description: 'Rooms list',
    type: [RoomResponseDto],
  })
  findAll(@Param('facultyId') facultyId: string) {
    return this.roomService.findAllByFaculty(facultyId);
  }

  @Get(':roomId')
  @CheckPermission('rooms', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a room by ID within a faculty' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiParam({ name: 'roomId', description: 'Room Subdocument ID' })
  @ApiResponse({
    status: 200,
    description: 'Room found',
    type: RoomResponseDto,
  })
  findOne(
    // @Param('facultyId') facultyId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.findOne( roomId);
  }

  @Patch(':facultyId/:roomId')
  @CheckPermission('rooms', 'update')
  @ApiOperation({ summary: 'Update a room by ID within a faculty' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiParam({ name: 'roomId', description: 'Room Subdocument ID' })
  @ApiBody({ type: UpdateRoomDto })
  @ApiResponse({
    status: 200,
    description: 'Room updated and faculty saved',
    type: FacultyResponseDto,
  })
  update(
    @Param('facultyId') facultyId: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomService.update(facultyId, roomId, dto);
  }

  @Delete(':facultyId/:roomId')
  @CheckPermission('rooms', 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a room by ID within a faculty' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiParam({ name: 'roomId', description: 'Room Subdocument ID' })
  @ApiResponse({
    status: 200,
    description: 'Room deleted and faculty updated',
    type: FacultyResponseDto,
  })
  remove(
    @Param('facultyId') facultyId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.remove(facultyId, roomId);
  }
}
