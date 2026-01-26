import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    return this.roleModel.create(createRoleDto);
  }

  async findAll(query: any = {}): Promise<RoleDocument[]> {
    return this.roleModel
      .find({ ...query, deleted: false })
      .populate('permissions')
      .exec();
  }

  async findOne(id: string): Promise<RoleDocument> {
    const role = await this.roleModel
      .findOne({ _id: id, deleted: false })
      .populate('permissions')
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    const role = await this.roleModel
      .findOneAndUpdate({ _id: id, deleted: false }, updateRoleDto, {
        new: true,
      })
      .populate('permissions')
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async remove(id: string): Promise<Role> {
    const role = await this.roleModel.findOne({ _id: id, deleted: false });
    if (!role) throw new NotFoundException('Role not found');

    // Use soft delete
    await (role as any).delete();
    return role;
  }

  async restore(id: string): Promise<Role> {
    const role = await this.roleModel.findOne({ _id: id, deleted: true });
    if (!role) throw new NotFoundException('Role not found');

    // Restore from soft delete
    await (role as any).restore();
    return role;
  }

  async addPermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleModel
      .findOneAndUpdate(
        { _id: roleId, deleted: false },
        { $addToSet: { permissions: permissionId } },
        { new: true },
      )
      .populate('permissions')
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async removePermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.roleModel
      .findOneAndUpdate(
        { _id: roleId, deleted: false },
        { $pull: { permissions: permissionId } },
        { new: true },
      )
      .populate('permissions')
      .exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }
}
