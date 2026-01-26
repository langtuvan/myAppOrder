import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';
import { PaginationDto, PaginatedResponse } from './dto/pagination.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Hash the password before saving
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ deleted: false }).populate('role').exec();
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<UserDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      roleId,
      includeDeleted = false,
    } = paginationDto;

    // Build query conditions
    const query: any = {};

    if (!includeDeleted) {
      query.deleted = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (roleId) {
      query.role = roleId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    if (sortBy === 'role') {
      // For role sorting, we'll sort by role name after population
      sort['role.name'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute queries
    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .populate('role')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ _id: id, deleted: false })
      .populate({
        path: 'role',
        populate: { path: 'permissions', select: 'action' },
      })
      .exec();
  }

  async findByIdWithRoleAndPermissions(id: string): Promise<UserDocument> {
    return this.userModel
      .findOne({ _id: id, deleted: false })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      })
      .exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: id, deleted: false })
      .populate('role')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase(), deleted: false })
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          select: 'name action apiPath method',
        },
      })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto & { refreshToken?: string }>,
  ): Promise<UserDocument> {
    // Hash password if it's being updated
    let updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    const user = await this.userModel
      .findOneAndUpdate({ _id: id, deleted: false }, updateData, { new: true })
      .populate('role')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id, deleted: false });
    if (!user) throw new NotFoundException('User not found');

    // Use soft delete
    await (user as any).delete();
    return user;
  }

  async restore(id: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: id, deleted: true });
    if (!user) throw new NotFoundException('User not found');

    // Restore from soft delete
    await (user as any).restore();
    return user;
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    deleted: number;
    byRole: { roleName: string; count: number }[];
  }> {
    const [total, active, deleted, roleStats] = await Promise.all([
      this.userModel.countDocuments({}),
      this.userModel.countDocuments({ deleted: false }),
      this.userModel.countDocuments({ deleted: true }),
      this.userModel.aggregate([
        {
          $match: { deleted: false },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'roleInfo',
          },
        },
        {
          $unwind: {
            path: '$roleInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$roleInfo.name',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            roleName: { $ifNull: ['$_id', 'No Role'] },
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
    ]);

    return {
      total,
      active,
      deleted,
      byRole: roleStats,
    };
  }
}
