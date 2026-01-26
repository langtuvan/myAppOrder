import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/faculty.dto';
import {
  FacultyResponseDto,
  RoomResponseDto,
} from './dto/faculty-response.dto';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { Locale } from '../../decorators/locale.decorator';
import { RoomService } from '../room/room.service';

@ApiTags('faculties')
@Controller('faculties')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly roomService: RoomService,
  ) {}

  // Faculty CRUD Endpoints
  @Post()
  @CheckPermission('faculties', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new faculty' })
  @ApiBody({ type: CreateFacultyDto })
  @ApiResponse({
    status: 201,
    description: 'Faculty has been successfully created.',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Faculty code already exists.',
  })
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.createFaculty(createFacultyDto);
  }

  @Get()
  @CheckPermission('faculties', 'read')
  @Public()
  @ApiOperation({ summary: 'Get all active faculties' })
  @ApiResponse({
    status: 200,
    description: 'Return all active faculties.',
    type: [FacultyResponseDto],
  })
  findAll() {
    return this.facultyService.findAllFaculties();
  }

  @Get(':id')
  @CheckPermission('faculties', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a faculty by ID' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the faculty.',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  findOne(@Param('id') id: string) {
    return this.facultyService.findFacultyById(id);
  }

  @Get('code/:code')
  @CheckPermission('faculties', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a faculty by code' })
  @ApiParam({ name: 'code', description: 'Faculty code' })
  @ApiResponse({
    status: 200,
    description: 'Return the faculty.',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  findByCode(@Param('code') code: string) {
    return this.facultyService.findFacultyByCode(code);
  }

  @Patch(':id')
  @CheckPermission('faculties', 'update')
  @ApiOperation({ summary: 'Update a faculty' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiBody({ type: UpdateFacultyDto })
  @ApiResponse({
    status: 200,
    description: 'Faculty has been successfully updated.',
    type: FacultyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Faculty code already exists.',
  })
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultyService.updateFaculty(id, updateFacultyDto);
  }

  @Delete(':id')
  @CheckPermission('faculties', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a faculty' })
  @ApiParam({ name: 'id', description: 'Faculty ID' })
  @ApiResponse({
    status: 204,
    description: 'Faculty has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Faculty not found.' })
  async remove(@Param('id') id: string) {
    return this.facultyService.removeFaculty(id);
  }

  // Room Endpoints (Embedded Documents)
  // @Post(':facultyId/rooms')
  // @CheckPermission('faculties:update')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Add a new room to a faculty' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiBody({ type: CreateRoomDto })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Room has been successfully added.',
  //   type: FacultyResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty not found.' })
  // @ApiResponse({
  //   status: 409,
  //   description: 'Conflict - Room number already exists in this faculty.',
  // })
  // addRoom(
  //   @Param('facultyId') facultyId: string,
  //   @Body() createRoomDto: CreateRoomDto,
  // ) {
  //   return this.facultyService.addRoom(facultyId, createRoomDto);
  // }

  // @Get(':facultyId/rooms')
  // @CheckPermission('faculties:read')
  // @Public()
  // @ApiOperation({ summary: 'Get all rooms in a faculty' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return all rooms in the faculty.',
  //   type: [RoomResponseDto],
  // })
  // @ApiResponse({ status: 404, description: 'Faculty not found.' })
  // getRooms(@Param('facultyId') facultyId: string) {
  //   return this.facultyService.getRoomsByFaculty(facultyId);
  // }

  // @Get(':facultyId/rooms/:roomIndex')
  // @CheckPermission('faculties:read')
  // @Public()
  // @ApiOperation({ summary: 'Get a room by index' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomIndex', description: 'Room array index' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return the room.',
  //   type: RoomResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // getRoom(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomIndex') roomIndex: string,
  // ) {
  //   return this.facultyService.getRoomById(facultyId, parseInt(roomIndex));
  // }

  // @Patch(':facultyId/rooms/:roomIndex')
  // @CheckPermission('faculties:update')
  // @ApiOperation({ summary: 'Update a room by index' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomIndex', description: 'Room array index' })
  // @ApiBody({ type: UpdateRoomDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Room has been successfully updated.',
  //   type: FacultyResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // @ApiResponse({
  //   status: 409,
  //   description: 'Conflict - Room number already exists.',
  // })
  // updateRoom(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomIndex') roomIndex: string,
  //   @Body() updateRoomDto: UpdateRoomDto,
  // ) {
  //   return this.facultyService.updateRoom(
  //     facultyId,
  //     parseInt(roomIndex),
  //     updateRoomDto,
  //   );
  // }

  // @Delete(':facultyId/rooms/:roomIndex')
  // @CheckPermission('faculties:update')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Delete a room by index' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomIndex', description: 'Room array index' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Room has been successfully deleted.',
  //   type: FacultyResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // deleteRoom(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomIndex') roomIndex: string,
  // ) {
  //   return this.facultyService.deleteRoom(facultyId, parseInt(roomIndex));
  // }

  // Alternative endpoints using room number
  // @Get(':facultyId/rooms-by-number/:roomNumber')
  // @CheckPermission('faculties:read')
  // @Public()
  // @ApiOperation({ summary: 'Get a room by room number' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomNumber', description: 'Room number' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return the room.',
  //   type: RoomResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // getRoomByNumber(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomNumber') roomNumber: string,
  // ) {
  //   return this.facultyService.getRoomByNumber(facultyId, roomNumber);
  // }

  // @Patch(':facultyId/rooms-by-number/:roomNumber')
  // @CheckPermission('faculties:update')
  // @ApiOperation({ summary: 'Update a room by room number' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomNumber', description: 'Room number' })
  // @ApiBody({ type: UpdateRoomDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Room has been successfully updated.',
  //   type: FacultyResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // @ApiResponse({
  //   status: 409,
  //   description: 'Conflict - Room number already exists.',
  // })
  // updateRoomByNumber(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomNumber') roomNumber: string,
  //   @Body() updateRoomDto: UpdateRoomDto,
  // ) {
  //   return this.facultyService.updateRoomByNumber(
  //     facultyId,
  //     roomNumber,
  //     updateRoomDto,
  //   );
  // }

  // @Delete(':facultyId/rooms-by-number/:roomNumber')
  // @CheckPermission('faculties:update')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Delete a room by room number' })
  // @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  // @ApiParam({ name: 'roomNumber', description: 'Room number' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Room has been successfully deleted.',
  //   type: FacultyResponseDto,
  // })
  // @ApiResponse({ status: 404, description: 'Faculty or room not found.' })
  // deleteRoomByNumber(
  //   @Param('facultyId') facultyId: string,
  //   @Param('roomNumber') roomNumber: string,
  // ) {
  //   return this.facultyService.deleteRoomByNumber(facultyId, roomNumber);
  // }
}
