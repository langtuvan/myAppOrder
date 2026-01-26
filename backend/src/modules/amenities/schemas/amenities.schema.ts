import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum AmenityStatus {
  ON = 'on',
  OFF = 'off',
}

@Schema({ timestamps: true })
export class Amenity {
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

  //status?: string;
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: AmenityStatus.ON, enum: AmenityStatus })
  status: AmenityStatus;

  // //deleted
  // @Prop({ required: false, default: false })
  // deleted: boolean;
}

export type AmenityDocument = Amenity & Document;
export const AmenitySchema = SchemaFactory.createForClass(Amenity);
