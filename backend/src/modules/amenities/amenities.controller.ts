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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AmenitiesService } from './amenities.service';
import {
  CreateAmenityDto,
  UpdateAmenityDto,
  AmenityResponseDto,
} from './dto/amenities.dto';
import { CheckPermission } from '../../casl';
import { Public } from '../../decorators/public.decorator';

const moduleName = 'faculties';

@ApiTags('amenities')
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  @CheckPermission(moduleName, 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new amenity' })
  @ApiBody({ type: CreateAmenityDto })
  @ApiResponse({
    status: 201,
    description: 'Amenity created successfully',
    type: AmenityResponseDto,
  })
  create(@Body() dto: CreateAmenityDto) {
    return this.amenitiesService.create(dto);
  }

  @Get()
  @CheckPermission(moduleName, 'read')
  @Public()
  @ApiOperation({ summary: 'Get all amenities with pagination and filtering' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of amenities',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/AmenityResponseDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.amenitiesService.findAll(limit, offset, type, status);
  }

  @Get('code/:code')
  @CheckPermission(moduleName, 'read')
  @Public()
  @ApiOperation({ summary: 'Get amenity by code' })
  @ApiParam({ name: 'code', description: 'Amenity code' })
  @ApiResponse({
    status: 200,
    description: 'Amenity found',
    type: AmenityResponseDto,
  })
  findByCode(@Param('code') code: string) {
    return this.amenitiesService.findByCode(code);
  }

  @Get(':id')
  @CheckPermission(moduleName, 'read')
  @Public()
  @ApiOperation({ summary: 'Get amenity by ID' })
  @ApiParam({ name: 'id', description: 'Amenity ID' })
  @ApiResponse({
    status: 200,
    description: 'Amenity found',
    type: AmenityResponseDto,
  })
  findById(@Param('id') id: string) {
    return this.amenitiesService.findById(id);
  }

  @Patch(':id')
  @CheckPermission(moduleName, 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an amenity' })
  @ApiParam({ name: 'id', description: 'Amenity ID' })
  @ApiBody({ type: UpdateAmenityDto })
  @ApiResponse({
    status: 200,
    description: 'Amenity updated successfully',
    type: AmenityResponseDto,
  })
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto) {
    return this.amenitiesService.update(id, dto);
  }

  @Patch(':id/status')
  @CheckPermission(moduleName, 'update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update amenity status' })
  @ApiParam({ name: 'id', description: 'Amenity ID' })
  @ApiBody({ schema: { properties: { status: { type: 'string' } } } })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
    type: AmenityResponseDto,
  })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.amenitiesService.updateStatus(id, status);
  }

  @Delete(':id')
  @CheckPermission(moduleName, 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an amenity' })
  @ApiParam({ name: 'id', description: 'Amenity ID' })
  @ApiResponse({
    status: 200,
    description: 'Amenity deleted successfully',
  })
  delete(@Param('id') id: string) {
    return this.amenitiesService.delete(id);
  }

  @Delete('code/:code')
  @CheckPermission(moduleName, 'delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete amenity by code' })
  @ApiParam({ name: 'code', description: 'Amenity code' })
  @ApiResponse({
    status: 200,
    description: 'Amenity deleted successfully',
  })
  deleteByCode(@Param('code') code: string) {
    return this.amenitiesService.deleteByCode(code);
  }
}
