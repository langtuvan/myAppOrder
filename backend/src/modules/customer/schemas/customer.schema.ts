import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { uuidv7 } from 'uuidv7';

export type CustomerDocument = Customer & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      return ret;
    },
  },
})
export class Customer {
  @Prop({
    required: false,
    type: String,
    default: uuidv7,
  })
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false })
  gender?: string;

  @Prop({ required: false, lowercase: true, trim: true })
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  company?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  province?: string;

  @Prop()
  ward?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  country?: string;

  @Prop({ enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: string;

  @Prop()
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      $or: [
        { email: { $exists: true } },
        { email: { $type: 'string' } },
        { email: { $nin: ['', null] } },
      ],
    },
  },
);
// CustomerSchema.index(
//   { email: 1 },
//   {
//     unique: true,
//     partialFilterExpression: { email: { $exists: true, $type: 'string' } },
//   },
// );
