import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Room } from '../../room/schemas/room.schema';

export type FacultyDocument = Faculty & Document;

@Schema({ timestamps: true })
export class Faculty {
  //_id
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    type: Object,
    default: {},
  })
  name: Record<string, string>;

  @Prop({
    type: Object,
    default: {},
  })
  description?: Record<string, string>;

  @Prop()
  department?: string;

  @Prop()
  dean?: string;

  @Prop()
  deanEmail?: string;

  @Prop()
  deanPhone?: string;

  @Prop({
    type: Object,
    default: {},
  })
  location?: Record<string, string>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Room' }],
    default: [],
  })
  rooms: Room[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  head?: string;

  @Prop({ default: 0 })
  totalRooms: number;
}

export const FacultySchema = SchemaFactory.createForClass(Faculty);
