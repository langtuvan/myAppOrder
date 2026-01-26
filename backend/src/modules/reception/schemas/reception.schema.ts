import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { Exam } from '../../exam/schemas/exam.schema';
import { OrderItem, OrderStatus } from '../../orderItem/schemas/order.schema';
import { uuidv7 } from 'uuidv7';
import { Faculty } from '../../faculty/schemas/faculty.schema';
import { Room } from '../../room/schemas/room.schema';

export type ReceptionDocument = Reception & Document;

@Schema({ timestamps: true })
export class Reception {
  @Prop({
    required: false,
    type: String,
    default: uuidv7,
  })
  _id?: string;

  @Prop({
    type: String,
    ref: 'Customer',
    required: true,
  })
  customer: Customer;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
    ref: 'Exam',
    required: false,
    default: [],
  })
  exams: Exam[];

  // @Prop({
  //   type: [MongooseSchema.Types.Mixed],
  //   ref: 'OrderItem',
  //   required: false,
  // })
  // items: OrderItem[];

  @Prop({ required: false })
  notes?: string;

  // location
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  })
  faculty: Faculty;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
    required: false,
  })
  room?: Room;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  updatedBy?: User;

  //status
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ type: Boolean, default: false })
  isExample?: boolean;
}

export const ReceptionSchema = SchemaFactory.createForClass(Reception);
