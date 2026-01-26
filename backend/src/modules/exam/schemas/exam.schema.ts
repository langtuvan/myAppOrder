import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Faculty } from '../../faculty/schemas/faculty.schema';
import { ProductService } from '../../product-service/schemas/product-service.schema';
import { User } from '../../user/schemas/user.schema';
import { Room } from '../../room/schemas/room.schema';
import { Reception } from '../../reception/schemas/reception.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { uuidv7 } from 'uuidv7';

export type ExamDocument = Exam & Document;

export enum ExamStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Exam {
  @Prop({
    required: false,
    type: String,
    default: uuidv7,
  })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  })
  faculty: Faculty;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    ref: 'Customer',
    required: true,
  })
  customer: Customer;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    ref: 'Reception',
    required: true,
  })
  reception: Reception;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  room: Room;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductService',
    required: true,
  })
  service: ProductService;

  @Prop({ required: true, min: 1 })
  qty: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    type: String,
    enum: ExamStatus,
    default: ExamStatus.PENDING,
  })
  status?: ExamStatus;

  @Prop({ required: true })
  date: string;

  @Prop()
  notes?: string;

  // author
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  updatedBy?: User;

  // @Prop()
  // invigilators?: string[];

  // @Prop()
  // totalStudents?: number;

  // @Prop()
  // duration?: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
