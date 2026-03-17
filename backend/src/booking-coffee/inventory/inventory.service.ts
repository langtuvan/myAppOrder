import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = new this.inventoryModel(createInventoryDto);
    return inventory.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel
      .find()
      .populate('warehouse')
      .populate('product')
      .exec();
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel
      .findById(id)
      .populate('warehouse')
      .populate('product')
      .exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return inventory;
  }

  async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
    return this.inventoryModel
      .find({ warehouse: warehouseId })
      .populate('warehouse')
      .populate('product')
      .exec();
  }

  async findByProduct(productId: string): Promise<Inventory[]> {
    return this.inventoryModel
      .find({ product: productId })
      .populate('warehouse')
      .populate('product')
      .exec();
  }

  async findByWarehouseAndProduct(
    warehouseId: string,
    productId: string,
  ): Promise<Inventory> {
    const inventory = await this.inventoryModel
      .findOne({ warehouse: warehouseId, product: productId })
      .populate('warehouse')
      .populate('product')
      .exec();
    if (!inventory) {
      throw new NotFoundException(
        `Inventory not found for warehouse ${warehouseId} and product ${productId}`,
      );
    }
    return inventory;
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.inventoryModel
      .findByIdAndUpdate(id, updateInventoryDto, { new: true })
      .populate('warehouse')
      .populate('product')
      .exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return inventory;
  }

  async remove(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return inventory;
  }

  async addStock(id: string, quantity: number): Promise<Inventory> {
    const inventory = await this.findOne(id);
    const newQuantity = inventory.quantity + quantity;
    return this.update(id, { quantity: newQuantity });
  }

  async removeStock(id: string, quantity: number): Promise<Inventory> {
    const inventory = await this.findOne(id);
    const availableQuantity = inventory.quantity - inventory.reservedQuantity;

    if (availableQuantity < quantity) {
      throw new BadRequestException('Insufficient stock available');
    }

    const newQuantity = inventory.quantity - quantity;
    return this.update(id, { quantity: newQuantity });
  }

  async reserveStock(id: string, quantity: number): Promise<Inventory> {
    const inventory = await this.findOne(id);
    const availableQuantity = inventory.quantity - inventory.reservedQuantity;

    if (availableQuantity < quantity) {
      throw new BadRequestException('Insufficient stock to reserve');
    }

    const newReservedQuantity = inventory.reservedQuantity + quantity;
    return this.update(id, { reservedQuantity: newReservedQuantity });
  }

  async unreserveStock(id: string, quantity: number): Promise<Inventory> {
    const inventory = await this.findOne(id);

    if (inventory.reservedQuantity < quantity) {
      throw new BadRequestException('Cannot unreserve more than reserved');
    }

    const newReservedQuantity = inventory.reservedQuantity - quantity;
    return this.update(id, { reservedQuantity: newReservedQuantity });
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return this.inventoryModel
      .find({
        $expr: {
          $lt: ['$quantity', '$minStockLevel'],
        },
      })
      .populate('warehouse')
      .populate('product')
      .exec();
  }

  async getHighStockItems(): Promise<Inventory[]> {
    return this.inventoryModel
      .find({
        $expr: {
          $gt: ['$quantity', '$maxStockLevel'],
        },
      })
      .populate('warehouse')
      .populate('product')
      .exec();
  }
}
