import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Faculty } from '../../faculty/schemas/faculty.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum RoomType {
  STORE = 'store',
  CLASSROOM = 'classroom',
  LAB = 'lab',
  SEMINAR = 'seminar',
  LECTURE_HALL = 'lecture_hall',
  STUDIO = 'studio',
  WORKSHOP = 'workshop',
}

export enum RoomStatus {
  MAINTENANCE = 'maintenance',
  ON = 'on',
  OFF = 'off',
}

@Schema({ _id: true })
export class Room {
  //_id
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;
  //faculty
  @Prop({ required: true, ref: 'Faculty', type: MongooseSchema.Types.ObjectId })
  faculty: string;

  @Prop({ required: true, unique: true })
  code: string;

  // @Prop({ required: true, unique: true })
  @Prop({ required: true })
  roomNumber: string;

  @Prop({
    type: Object,
    default: {},
  })
  name: Record<string, string>;

  @Prop({
    type: String,
    enum: RoomType,
    default: RoomType.CLASSROOM,
  })
  type: RoomType;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({
    type: String,
    enum: RoomStatus,
    default: RoomStatus.ON,
  })
  status: RoomStatus;

  @Prop()
  floor?: number;

  @Prop()
  building?: string;

  @Prop([String])
  amenities?: string[];

  @Prop()
  description?: string;

  @Prop({ required: false, default: true })
  isActive?: boolean;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
