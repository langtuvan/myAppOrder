import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { UserModule } from '../user/user.module';
import { FacultyModule } from '../faculty/faculty.module';
import { ReceptionModule } from '../reception/reception.module';
import { ReceptionService } from '../reception/reception.service';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => FacultyModule),
    forwardRef(() => ReceptionModule),
    forwardRef(() => CustomerModule),
    //ReceptionModule,
  ],

  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
