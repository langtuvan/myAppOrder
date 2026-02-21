import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WarehouseDocument = Warehouse & Document;

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  description: string;

//   @Prop({ required: true })
//   capacity: number;

//   @Prop({ default: 0 })
//   usedCapacity: number;

  @Prop({ default: true })
  isActive: boolean;

//   @Prop()
//   contactPerson: string;

//   @Prop()
//   contactPhone: string;

//   @Prop()
//   email: string;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
