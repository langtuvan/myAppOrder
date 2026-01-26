import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from './schemas/booking.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class BookingCronService {
  private readonly logger = new Logger(BookingCronService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  /**
   * Cron job that runs at 1:00 AM every day (Vietnam time zone)
   * Creates 10 sample bookings for testing/demo purposes
   */

  @Cron('0 1 * * *', {
    name: 'create-daily-bookings',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async createDailyBookings() {
    this.logger.log('Starting daily booking creation at 9:00 AM...');

    try {
      // Get all available faculties
      const faculties = await this.connection.db
        .collection('faculties')
        .find({})
        .limit(5)
        .toArray();

      if (faculties.length === 0) {
        this.logger.warn('No faculties found. Skipping booking creation.');
        return;
      }

      const bookingsToCreate = [];
      const currentDate = new Date();

      // Create 20 bookings
      for (let i = 0; i < 40; i++) {
        // Distribute bookings across different hours (9 AM to 21 PM)
        const hour = 9 + Math.floor(i / 2);
        const minute = Math.random() < 0.5 ? 0 : 30; // Random [0, 30] minutes

        // Select faculty randomly
        const faculty = faculties[i % faculties.length];

        // Create booking date (today + random offset 0-6 days)
        const bookingDate = new Date(currentDate);
        bookingDate.setDate(bookingDate.getDate() + Math.floor(i / 2));

        //randon status
        const randomStatus = [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.CANCELLED,
        ][Math.floor(Math.random() * 3)];

        const booking = {
          faculty: faculty._id,
          trackingNumber: `AUTO-${Date.now()}-${i}`,
          items: [],
          customerName: `Khách hàng ${i + 1}`,
          customerEmail: `customer${i + 1}@example.com`,
          customerPhone: `090${String(1000000 + i).padStart(7, '0')}`,
          date: bookingDate.toISOString().split('T')[0],
          hour: hour,
          minute: minute,
          notes: `Đặt chỗ tự động tạo lúc 1:00 sáng ngày ${currentDate.toLocaleDateString('vi-VN')}`,
          status: randomStatus,
        };

        bookingsToCreate.push(booking);
      }

      // Insert all bookings
      const result = await this.bookingModel.insertMany(bookingsToCreate);
    } catch (error) {
      this.logger.error(
        `Failed to create daily bookings: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Cron job that runs at 2:00 AM every day
   * Deletes bookings older than 7 days
   */
  @Cron('0 2 * * *', {
    name: 'delete-old-bookings',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async deleteOldBookings() {
    this.logger.log('Starting deletion of old bookings (older than 7 days)...');

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.bookingModel.deleteMany({
        createdAt: { $lt: sevenDaysAgo },
      });

      this.logger.log(
        `Successfully deleted ${result.deletedCount} old bookings`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete old bookings: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manual trigger for creating bookings (for testing)
   */
  async manualCreateBookings() {
    this.logger.log('Manual booking creation triggered...');
    await this.createDailyBookings();
  }

  /**
   * Manual trigger for deleting old bookings (for testing)
   */
  async manualDeleteOldBookings() {
    this.logger.log('Manual deletion of old bookings triggered...');
    await this.deleteOldBookings();
  }
}
