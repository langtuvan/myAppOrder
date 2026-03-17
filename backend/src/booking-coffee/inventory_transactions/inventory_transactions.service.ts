import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InventoryTransaction,
  InventoryTransactionDocument,
} from './schemas/inventory-transaction.schema';
import {
  CreateInventoryTransactionDto,
  UpdateInventoryTransactionDto,
} from './dto/inventory-transaction.dto';

@Injectable()
export class InventoryTransactionsService {
  constructor(
    @InjectModel(InventoryTransaction.name)
    private transactionModel: Model<InventoryTransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateInventoryTransactionDto,
  ): Promise<InventoryTransaction> {
    const transaction = new this.transactionModel(createTransactionDto);
    return transaction.save();
  }

  async findAll(): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find()
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .exec();
  }

  // bulk create
  async createBulk(
    transactions: CreateInventoryTransactionDto[],
  ): Promise<any[]> {
    return this.transactionModel.insertMany(transactions);
  }

  async findOne(id: string): Promise<InventoryTransaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findByInventory(inventoryId: string): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({ inventory: inventoryId })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByType(type: string): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({ type })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByWarehouse(warehouseId: string): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({
        $or: [
          { sourceWarehouse: warehouseId },
          { destinationWarehouse: warehouseId },
        ],
      })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByReference(reference: string): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({ reference })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .exec();
  }

  async update(
    id: string,
    updateTransactionDto: UpdateInventoryTransactionDto,
  ): Promise<InventoryTransaction> {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async remove(id: string): Promise<InventoryTransaction> {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async approve(id: string, approvedBy: string): Promise<InventoryTransaction> {
    const transaction = await this.findOne(id);

    // if (transaction.isApproved) {
    //   throw new BadRequestException('Transaction is already approved');
    // }

    return this.update(id, {
      isApproved: true,
      approvedBy,
      approvalDate: new Date(),
    });
  }

  async getPendingApprovals(): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({ isApproved: false })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: 1 })
      .exec();
  }

  async getTransactionHistory(
    inventoryId: string,
    limit: number = 10,
  ): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({ inventory: inventoryId })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<InventoryTransaction[]> {
    return this.transactionModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('inventory')
      .populate('sourceWarehouse')
      .populate('destinationWarehouse')
      .sort({ createdAt: -1 })
      .exec();
  }
}
