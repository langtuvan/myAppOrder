import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Warehouse, WarehouseDocument } from './schemas/warehouse.schema';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(Warehouse.name)
    private warehouseModel: Model<WarehouseDocument>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = new this.warehouseModel(createWarehouseDto);
    return warehouse.save();
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseModel.find().exec();
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findById(id).exec();
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async findByName(name: string): Promise<WarehouseDocument | null> {
    return this.warehouseModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouse = await this.warehouseModel
      .findByIdAndUpdate(id, updateWarehouseDto, { new: true })
      .exec();
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async remove(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findByIdAndDelete(id).exec();
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

//   async getAvailableCapacity(id: string): Promise<number> {
//     const warehouse = await this.findOne(id);
//     return warehouse.capacity - warehouse.usedCapacity;
//   }

//   async updateUsedCapacity(id: string, amount: number): Promise<Warehouse> {
//     const warehouse = await this.findOne(id);
//     const newUsedCapacity = warehouse.usedCapacity + amount;

//     if (newUsedCapacity > warehouse.capacity) {
//       throw new Error('Insufficient warehouse capacity');
//     }

//     return this.update(id, { usedCapacity: newUsedCapacity });
//   }
}
