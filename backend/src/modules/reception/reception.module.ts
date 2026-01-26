import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // Add this import
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';
import { ReceptionGateway } from './reception.gateway';
import { ReceptionCronService } from './reception.cron.service';
import { Reception, ReceptionSchema } from './schemas/reception.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customer.schema';
import { Faculty, FacultySchema } from '../faculty/schemas/faculty.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { CustomerModule } from '../customer/customer.module';
import { FacultyModule } from '../faculty/faculty.module';
import { UserModule } from '../user/user.module';
import { ExamModule } from '../exam/exam.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reception.name, schema: ReceptionSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => FacultyModule),
    forwardRef(() => ExamModule),
    //ExamModule,
    ItemModule,
    CustomerModule,
    ScheduleModule.forRoot(), // Add this line to enable scheduling
  ],
  controllers: [ReceptionController],
  providers: [
    ReceptionService,
    ReceptionGateway,
    ReceptionCronService,
  ],
  exports: [ReceptionService, ReceptionGateway, ReceptionCronService],
})
export class ReceptionModule {}
