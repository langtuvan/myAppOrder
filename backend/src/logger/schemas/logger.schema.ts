import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoggerDocument = Logger & Document;

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Schema({ timestamps: true })
export class Logger {
  @Prop({ required: true, enum: LogLevel })
  level: LogLevel;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object, default: null })
  meta?: Record<string, any>;

  @Prop({ default: null })
  stackTrace?: string;

  @Prop({ default: null })
  userId?: string;

  @Prop({ default: null })
  module?: string;

  @Prop({ default: null })
  endpoint?: string;

  @Prop({ default: new Date() })
  timestamp: Date;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
LoggerSchema.index({ level: 1, createdAt: -1 });
LoggerSchema.index({ module: 1 });
LoggerSchema.index({ userId: 1 });
