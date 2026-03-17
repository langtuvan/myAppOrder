import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './schemas/module.schema';
import { CreateModuleDto, UpdateModuleDto } from './dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name)
    private moduleModel: Model<ModuleDocument>,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<ModuleDocument> {
    try {
      return await this.moduleModel.create(createModuleDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Module with this name already exists');
      }
      throw error;
    }
  }

  async findAll(query: any = {}): Promise<ModuleDocument[]> {
    return this.moduleModel
      .find({ ...query, deleted: false })
      .populate('permissions')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<ModuleDocument> {
    const module = await this.moduleModel
      .findOne({ _id: id, deleted: false })
      .populate('permissions')
      .exec();
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async findByName(name: string): Promise<ModuleDocument | null> {
    return this.moduleModel
      .findOne({ name, deleted: false })
      .populate('permissions')
      .exec();
  }

  async findByApiPrefix(apiPrefix: string): Promise<ModuleDocument | null> {
    return this.moduleModel
      .findOne({ apiPrefix, deleted: false })
      .populate('permissions')
      .exec();
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<ModuleDocument> {
    try {
      const module = await this.moduleModel
        .findOneAndUpdate({ _id: id, deleted: false }, updateModuleDto, {
          new: true,
        })
        .populate('permissions')
        .exec();
      if (!module) throw new NotFoundException('Module not found');
      return module;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Module with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<ModuleDocument> {
    const module = await this.moduleModel.findOne({
      _id: id,
      deleted: false,
    });
    if (!module) throw new NotFoundException('Module not found');

    // Use soft delete
    await (module as any).delete();
    return module;
  }

  async restore(id: string): Promise<ModuleDocument> {
    const module = await this.moduleModel.findOne({
      _id: id,
      deleted: true,
    });
    if (!module) throw new NotFoundException('Module not found');

    // Restore from soft delete
    await (module as any).restore();
    return module;
  }

  async getModuleStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deleted: number;
  }> {
    const [total, active, inactive, deleted] = await Promise.all([
      this.moduleModel.countDocuments({ deleted: false }),
      this.moduleModel.countDocuments({ deleted: false, isActive: true }),
      this.moduleModel.countDocuments({ deleted: false, isActive: false }),
      this.moduleModel.countDocuments({ deleted: true }),
    ]);

    return { total, active, inactive, deleted };
  }
}
