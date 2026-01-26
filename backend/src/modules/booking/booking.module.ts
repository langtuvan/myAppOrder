import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCronService } from './booking-cron.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { FacultyModule } from '../faculty/faculty.module';
import { ProductServiceModule } from '../product-service/product-service.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => FacultyModule),
    forwardRef(() => ProductServiceModule),
    ProductModule,
    UserModule,
    FacultyModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingCronService],
  exports: [BookingService, BookingCronService],
})
export class BookingModule {}
