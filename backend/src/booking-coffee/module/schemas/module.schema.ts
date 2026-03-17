import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  apiPrefix: string; // e.g., '/api/users', '/api/products'

  @Prop()
  icon?: string; // Icon name for UI display

  @Prop({ default: 0 })
  sortOrder: number; // For ordering modules in UI

  @Prop({ default: true })
  isActive: boolean;

  // Virtual field - will be populated from Permission collection
  permissions?: Types.ObjectId[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

// Add virtual populate for permissions
ModuleSchema.virtual('permissions', {
  ref: 'Permission',
  localField: '_id',
  foreignField: 'module',
});

// Ensure virtual fields are serialized
ModuleSchema.set('toJSON', { virtuals: true });
ModuleSchema.set('toObject', { virtuals: true });
