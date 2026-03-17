import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from 'mongoose';
import { OrderItem } from './schemas/item.schema';
import { CreateOrderItemDto } from './dto/item.dto';

type OrderItemDocument = OrderItem & Document;

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(OrderItem.name)
    private readonly itemModel: Model<OrderItemDocument>,
  ) {}

  async create(dto: CreateOrderItemDto, createdBy: string): Promise<OrderItem> {
    const created = new this.itemModel({ ...dto, createdBy });
    return created.save();
  }

  async createMany(items: CreateOrderItemDto[]): Promise<OrderItem[]> {
    if (!Array.isArray(items) || items.length === 0) return [];
    const docs = await this.itemModel.insertMany(items, { ordered: false });
    return docs;
  }

  // update many bulkWrite
  async updateMany(items: any[]): Promise<any> {
    if (!Array.isArray(items) || items.length === 0) return [];

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id, status: 'pending' },
        update: { $set: { ...item } },
      },
    }));
    const result = await this.itemModel.bulkWrite(bulkOps as any);

    return true;
  }

  async findAll(query?: {
    faculty?: string;
    customer?: string;
    product?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: OrderItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
    const filter: FilterQuery<OrderItemDocument> = {};

    if (query?.faculty) filter.faculty = query.faculty;
    if (query?.product) filter.product = query.product;
    if (query?.status) filter.status = query.status as any;

    const [data, total] = await Promise.all([
      this.itemModel
        .find(filter)
        .populate('faculty')
        .populate('product')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.itemModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<OrderItem> {
    const item = await this.itemModel
      .findById(id)
      .populate('faculty')
      .populate('product')
      .exec();
    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
    return item;
  }

  async update(
    id: string,
    update: Partial<{
      faculty: string;
      product: string;
      quantity: number;
      price: number;
      status: string;
      date: string;
    }>,
    updatedBy: string,
  ): Promise<OrderItem> {
    const updated = await this.itemModel
      .findByIdAndUpdate(id, { ...update, updatedBy }, { new: true })
      .populate('faculty')
      .populate('product')
      .exec();
    if (!updated) throw new NotFoundException(`Item with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Item with ID ${id} not found`);
  }

  async findItemsByCustomer(customerId: string): Promise<OrderItem[]> {
    const items = await this.itemModel
      .find({
        customer: customerId,
        status: { $in: ['pending', 'processing', 'completed'] },
      })
      .populate('product')
      .lean()
      .exec();

    return items;
  }
}
