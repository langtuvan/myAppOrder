import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  action: string; // e.g., 'create', 'read', 'update', 'delete'

  @Prop({ required: true })
  apiPath: string; // e.g., '/api/users', '/api/products/:id'

  @Prop({
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
  method: string; // HTTP method

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module: Types.ObjectId; // Reference to Module entity

  @Prop({ default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
