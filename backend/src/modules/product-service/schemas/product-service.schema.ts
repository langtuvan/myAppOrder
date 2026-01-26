import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { Category } from '../../category/schemas/category.schema';
import { Amenity } from '../../amenities/schemas/amenities.schema';

export type ProductServiceDocument = ProductService & Document;

@Schema({ timestamps: true })
export class ProductService {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, auto: true })
  _id: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category | string;

  @Prop({
    type: Object,
    default: {},
  })
  name: Record<string, string>;

  @Prop({
    type: Object,
    default: {},
  })
  description: Record<string, string>;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  duration: number;

  // @Prop({
  //   type: [String],
  //   ref: 'Amenity',
  //   default: [],
  // })
  // tags: Amenity[];
}

export const ProductServiceSchema =
  SchemaFactory.createForClass(ProductService);
