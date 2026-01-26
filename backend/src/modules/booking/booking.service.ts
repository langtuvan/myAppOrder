import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { endOfWeek, format, startOfWeek } from 'date-fns';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate user and product exist
    const trackingNumber = `BK-${Date.now()}`;

    const booking = new this.bookingModel({
      ...createBookingDto,
      trackingNumber,
    });
    const saved = await booking.save();
    return (await saved.populate('faculty')).populate('items.productId');
    //
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel
      .find()
      .populate('faculty')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findByCreatedAt(createdAt: string): Promise<Booking[]> {
    createdAt = format(new Date(createdAt), 'yyyy-MM-dd');
    console.log('Finding bookings by createdAt:', createdAt);
    const dateStart = new Date(createdAt + 'T00:00:00.000Z');
    const dateEnd = new Date(createdAt + 'T23:59:59.999Z');
    return this.bookingModel
      .find({ createdAt: { $gte: dateStart, $lte: dateEnd } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findByDateAndFaculty(
    date: string,
    facultyId: string,
  ): Promise<Booking[]> {
    return (
      this.bookingModel
        .find({ date, faculty: facultyId })
        //.populate('faculty')
        .sort({ createdAt: -1 })
        .lean()
        .exec()
    );
  }

  async findByWeekAndFaculty(
    date: string,
    facultyId: string,
  ): Promise<Booking[]> {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 });

    const range = {
      from: format(start, 'yyyy-MM-dd'),
      to: format(end, 'yyyy-MM-dd'),
    };

    return (
      this.bookingModel
        .find({
          date: {
            $gte: range.from,
            $lte: range.to,
          },
          faculty: facultyId,
        })
        //.populate('faculty')
        .sort({ createdAt: -1 })
        .lean()
        .exec()
    );
  }

  async findByPhone(phone: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ customerPhone: phone })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('items.productId');
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('items.productId')
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // // Recalculate total price if product or quantity changed
    // if (updateBookingDto.quantity) {
    //   const product = await this.productService.findOne(booking.product as any);
    //   booking.totalPrice = product.price * updateBookingDto.quantity;
    // }

    Object.assign(booking, updateBookingDto);
    const saved = await booking.save();
    return saved.populate('faculty');
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
}
