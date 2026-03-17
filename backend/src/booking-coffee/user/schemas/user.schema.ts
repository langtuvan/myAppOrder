import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../../role/schemas/role.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete (ret as any).password;
      delete (ret as any).refreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  //userName ?
  @Prop({ required: false, unique: false, lowercase: true, trim: true })
  userName?: string;

  @Prop({ required: false, unique: false, lowercase: true, trim: true })
  phone?: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age?: number;

  @Prop({ enum: ['male', 'female', 'other'], default: 'other' })
  gender: string;

  @Prop()
  address?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  role: Role;

  // isActive field to indicate if the user is active
  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
