import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  contactPerson: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  companyName: string;

  @Prop()
  taxId?: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
