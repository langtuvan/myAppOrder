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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingCronService } from './booking-cron.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CheckPermission } from '../../casl';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingCronService: BookingCronService,
  ) {}

  @Get()
  //@CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({
    status: 200,
    description: 'Return all bookings.',
    type: [BookingResponseDto],
  })
  findAll() {
    return this.bookingService.findAll();
  }

  // find by Date
  @Get('createdAt/:createdAt')
  //@CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get bookings by createdAt' })
  @ApiParam({ name: 'createdAt', description: 'Booking createdAt' })
  @ApiResponse({
    status: 200,
    description: 'Return bookings by createdAt.',
    type: [BookingResponseDto],
  })
  findByCreatedAt(@Param('createdAt') createdAt: string) {
    return this.bookingService.findByCreatedAt(createdAt);
  }

  // find by Date and faculty
  @Get('date/:date/faculty/:facultyId')
  //@CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get bookings by date and faculty' })
  @ApiParam({ name: 'date', description: 'Booking date' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiResponse({
    status: 200,
    description: 'Return bookings by date and faculty.',
    type: [BookingResponseDto],
  })
  findByDateAndFaculty(
    @Param('date') date: string,
    @Param('facultyId') facultyId: string,
  ) {
    return this.bookingService.findByDateAndFaculty(date, facultyId);
  }

  // find by Date and faculty
  @Get('week/:date/faculty/:facultyId')
  //@CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get bookings by date and faculty' })
  @ApiParam({ name: 'date', description: 'Booking date' })
  @ApiParam({ name: 'facultyId', description: 'Faculty ID' })
  @ApiResponse({
    status: 200,
    description: 'Return bookings by date and faculty.',
    type: [BookingResponseDto],
  })
  findByWeekAndFaculty(
    @Param('date') date: string,
    @Param('facultyId') facultyId: string,
  ) {
    console.log('BookingController - findByWeekAndFaculty called');
    return this.bookingService.findByWeekAndFaculty(date, facultyId);
  }

  @Get('customer/:customerPhone')
  @CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get bookings by customer phone' })
  @ApiParam({ name: 'customerPhone', description: 'Customer phone' })
  @ApiResponse({
    status: 200,
    description: 'Return user bookings.',
    type: [BookingResponseDto],
  })
  findByPhone(@Param('customerPhone') customerPhone: string) {
    return this.bookingService.findByPhone(customerPhone);
  }

  @Get(':id')
  @CheckPermission('bookings', 'read')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the booking.',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Post()
  // @CheckPermission('bookings', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking has been successfully created.',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Patch(':id')
  @CheckPermission('bookings', 'update')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({
    status: 200,
    description: 'Booking has been successfully updated.',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @CheckPermission('bookings', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 204,
    description: 'Booking has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Post('cron/create-bookings')
  @CheckPermission('bookings', 'create')
  @ApiOperation({
    summary: 'Manually trigger daily booking creation (for testing)',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily bookings created successfully.',
  })
  async manualCreateBookings() {
    await this.bookingCronService.manualCreateBookings();
    return { message: '10 bookings created successfully' };
  }

  @Post('cron/delete-old-bookings')
  @CheckPermission('bookings', 'delete')
  @ApiOperation({
    summary: 'Manually trigger deletion of old bookings (for testing)',
  })
  @ApiResponse({
    status: 200,
    description: 'Old bookings deleted successfully.',
  })
  async manualDeleteOldBookings() {
    await this.bookingCronService.manualDeleteOldBookings();
    return { message: 'Old bookings deleted successfully' };
  }
}
