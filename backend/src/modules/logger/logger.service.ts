import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Logger as LoggerEntity,
  LogLevel,
  LoggerDocument,
} from './schemas/logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(LoggerEntity.name) private loggerModel: Model<LoggerDocument>,
  ) {}

  async log(message: string, meta?: Record<string, any>) {
    return this.create(LogLevel.INFO, message, meta);
  }

  async debug(message: string, meta?: Record<string, any>) {
    return this.create(LogLevel.DEBUG, message, meta);
  }

  async warn(message: string, meta?: Record<string, any>) {
    return this.create(LogLevel.WARN, message, meta);
  }

  async error(
    message: string,
    stackTrace?: string,
    meta?: Record<string, any>,
  ) {
    return this.create(LogLevel.ERROR, message, meta, stackTrace);
  }

  private async create(
    level: LogLevel,
    message: string,
    meta?: Record<string, any>,
    stackTrace?: string,
  ) {
    const logEntry = new this.loggerModel({
      level,
      message,
      meta,
      stackTrace,
      module: meta?.module,
      userId: meta?.userId,
      endpoint: meta?.endpoint,
      timestamp: new Date(),
    });
    return logEntry.save();
  }

  async getLogs(filter?: {
    level?: LogLevel;
    module?: string;
    userId?: string;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};
    if (filter?.level) query.level = filter.level;
    if (filter?.module) query.module = filter.module;
    if (filter?.userId) query.userId = filter.userId;

    return this.loggerModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filter?.skip || 0)
      .limit(filter?.limit || 100)
      .exec();
  }

  async getLogsByModule(module: string, limit: number = 50) {
    return this.loggerModel
      .find({ module })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getErrorLogs(limit: number = 50) {
    return this.loggerModel
      .find({ level: LogLevel.ERROR })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

}
