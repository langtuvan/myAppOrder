import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private supplierModel: Model<SupplierDocument>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = new this.supplierModel(createSupplierDto);
    return supplier.save();
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierModel.find().exec();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierModel.findById(id).exec();
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async findByName(name: string): Promise<SupplierDocument | null> {
    return this.supplierModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.supplierModel
      .findByIdAndUpdate(id, updateSupplierDto, { new: true })
      .exec();
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async remove(id: string): Promise<Supplier> {
    const supplier = await this.supplierModel.findByIdAndDelete(id).exec();
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }
}
