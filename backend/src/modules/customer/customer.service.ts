import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  PaginationDto,
  PaginatedResponse,
} from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel
      .find({ deleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<CustomerDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      includeDeleted = false,
    } = paginationDto;

    // Build query conditions
    const query: any = {};

    if (!includeDeleted) {
      query.deleted = false;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder_value = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const data = await this.customerModel
      .find(query)
      .sort({ [sortBy]: sortOrder_value })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count for pagination info
    const total = await this.customerModel.countDocuments(query);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findByPhone(phone: string): Promise<CustomerDocument[]> {
    const customers = await this.customerModel
      .find({ phone: { $regex: phone, $options: 'i' }, deleted: false })
      .exec();
    return customers;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      updateCustomerDto,
      { new: true },
    );
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async remove(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async restore(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true },
    );
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async getStats() {
    const total = await this.customerModel.countDocuments({ deleted: false });
    const active = await this.customerModel.countDocuments({
      deleted: false,
      isActive: true,
    });
    const suspended = await this.customerModel.countDocuments({
      deleted: false,
      status: 'suspended',
    });

    return {
      total,
      active,
      suspended,
      inactive: total - active,
    };
  }
}
