import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Amenity } from '../../amenities/schemas/amenities.schema';

export enum CategoryType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  COMBO = 'COMBO',
}

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  //type: string;
  @Prop({ required: true, enum: CategoryType })
  type: CategoryType;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  //images
  @Prop({ type: [String], default: [] , required: false})
  images?: string[];

  @Prop({ required: false, default: true })
  isActive: boolean;

  //order
  @Prop({ required: false, default: 0 })
  order: number;

  //
  @Prop({
    type: [String],
    ref: 'Amenity',
    default: [],
  })
  tags: Amenity[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
