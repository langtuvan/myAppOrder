import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionModel.create(createPermissionDto);
  }

  async findAll(query: any = {}): Promise<PermissionDocument[]> {
    return this.permissionModel
      .find({ ...query, deleted: false })
      .populate('module')
      .exec();
  }

  async findOne(id: string): Promise<PermissionDocument> {
    const permission = await this.permissionModel
      .findOne({ _id: id, deleted: false })
      .populate('module')
      .exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionModel
      .findOneAndUpdate({ _id: id, deleted: false }, updatePermissionDto, {
        new: true,
      })
      .exec();
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async remove(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findOne({
      _id: id,
      deleted: false,
    });
    if (!permission) throw new NotFoundException('Permission not found');

    // Use soft delete
    await (permission as any).delete();
    return permission;
  }

  async restore(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findOne({
      _id: id,
      deleted: true,
    });
    if (!permission) throw new NotFoundException('Permission not found');

    // Restore from soft delete
    await (permission as any).restore();
    return permission;
  }

  async findByAction(action: string): Promise<Permission[]> {
    return this.permissionModel.find({ action, deleted: false }).exec();
  }

  async findByModule(moduleId: string): Promise<Permission[]> {
    return this.permissionModel
      .find({ module: moduleId, deleted: false })
      .populate('module')
      .exec();
  }

  async findByMethod(method: string): Promise<Permission[]> {
    return this.permissionModel.find({ method, deleted: false }).exec();
  }

  async findByApiPath(apiPath: string): Promise<Permission[]> {
    return this.permissionModel.find({ apiPath, deleted: false }).exec();
  }
}
