import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceptionService } from './reception.service';
import { Reception, ReceptionDocument } from './schemas/reception.schema';
import {
  Customer,
  CustomerDocument,
} from '../customer/schemas/customer.schema';
import { Faculty, FacultyDocument } from '../faculty/schemas/faculty.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateReceptionInput } from './dto/reception.dto';
import { OrderStatus } from '../orderItem/schemas/order.schema';

@Injectable()
export class ReceptionCronService {
  private readonly logger = new Logger(ReceptionCronService.name);

  constructor(
    private readonly receptionService: ReceptionService,
    @InjectModel(Reception.name)
    private readonly receptionModel: Model<ReceptionDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Faculty.name)
    private readonly facultyModel: Model<FacultyDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Cron job that runs at 2:00 AM every day (Vietnam time zone)
   * Creates 10 sample receptions for testing/demo purposes
   */
  @Cron('0 2 * * *', {
    name: 'create-daily-receptions',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async createDailyReceptions(): Promise<void> {
    this.logger.log('Starting daily reception creation at 2:00 AM...');

    try {
      // Get customers
      let customers = await this.customerModel
        //.find({ deleted: false })
        .find()
        .select('_id firstName lastName phone')
        .exec();

      if (!customers.length) {
        this.logger.warn('No customers found. Skipping reception creation.');
        return;
      }

      // Get faculties
      const faculties = await this.facultyModel
        .find({ isActive: true })
        .select('_id code name')
        .exec();

      if (!faculties.length) {
        this.logger.warn(
          'No active faculties found. Skipping reception creation.',
        );
        return;
      }

      // Get or create system user for automatic receptions
      let createdByUser = await this.userModel
        .findOne({ email: 'admin@booking.com' })
        .select('_id name')
        .exec();

      if (!createdByUser) {
        // Fallback to first available user
        createdByUser = await this.userModel
          .findOne()
          .select('_id name')
          .exec();
      }

      if (!createdByUser) {
        this.logger.warn('No users found. Skipping reception creation.');
        return;
      }

      const currentDate = new Date();
      const notesDate = this.formatDateLabel(currentDate);

      // Create 10 receptions
      for (let i = 0; i < 20; i++) {
        // get one customer and remove from list
        const customer = customers[0];
        customers = customers.slice(1).concat(customers[0]);
        const faculty = faculties[0];
        // const faculty = faculties[i % faculties.length];

        const randomStatus = [
          OrderStatus.PENDING,
          OrderStatus.CONFIRMED,
          OrderStatus.CANCELLED,
          OrderStatus.PROCESSING,
        ][i % 4];

        const receptionInput: CreateReceptionInput = {
          customer: customer._id.toString(),
          faculty: faculty._id.toString(),
          notes: `Lễ tân tự động tạo lúc 2:00 sáng ngày ${notesDate} - Khách ${i + 1}`,
          status: randomStatus, // random status can be implemented if needed
        };

        await this.receptionService.create(
          receptionInput,
          createdByUser._id.toString(),
        );
      }

      this.logger.log(`Successfully created 10 receptions`);
    } catch (error) {
      this.logger.error(
        `Failed to create daily receptions: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Cron job that runs at 3:00 AM every day
   * Deletes receptions older than 7 days
   */
  @Cron('0 3 * * *', {
    name: 'delete-old-receptions',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async deleteOldReceptions(): Promise<void> {
    this.logger.log(
      'Starting deletion of old receptions (older than 7 days)...',
    );

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.receptionModel.deleteMany({
        createdAt: { $lt: sevenDaysAgo },
      });

      this.logger.log(
        `Successfully deleted ${result.deletedCount} old receptions`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete old receptions: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Manual trigger for creating receptions (for testing)
   */
  async manualCreateReceptions(): Promise<void> {
    this.logger.log('Manual reception creation triggered...');
    await this.createDailyReceptions();
  }

  /**
   * Manual trigger for deleting old receptions (for testing)
   */
  async manualDeleteOldReceptions(): Promise<void> {
    this.logger.log('Manual deletion of old receptions triggered...');
    await this.deleteOldReceptions();
  }

  private formatDateLabel(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }
}
