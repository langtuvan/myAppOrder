import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GoodsReceipt,
  GoodsReceiptDocument,
} from './schemas/goods-receipt.schema';
import {
  CreateGoodsReceiptDto,
  CreateGoodsReceiptDtoWithItems,
  UpdateGoodsReceiptDto,
} from './dto/goods-receipt.dto';
import { GoodsReceiptResponseDto } from './dto/goods-receipt-response.dto';
import { InventoryTransactionsService } from '../inventory_transactions/inventory_transactions.service';
import {
  GoodsReceiptItem,
  GoodsReceiptItemsService,
} from '../goods_receipt_items';
import { Connection, ClientSession } from 'mongoose';
import {
  InventoryTransaction,
  TransactionType,
} from '../inventory_transactions/schemas/inventory-transaction.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';

@Injectable()
export class GoodsReceiptsService {
  constructor(
    @InjectModel(GoodsReceipt.name)
    private goodsReceiptModel: Model<GoodsReceiptDocument>,
    @InjectModel(GoodsReceiptItem.name)
    private goodsReceiptItemModel: Model<GoodsReceiptItem>,
    @InjectModel(InventoryTransaction.name)
    private inventoryTransactionModel: Model<InventoryTransaction>,
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
    // private readonly goodsReceiptItemsService: GoodsReceiptItemsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    createGoodsReceiptDto: CreateGoodsReceiptDtoWithItems,
    createdBy: string,
  ): Promise<GoodsReceiptResponseDto> {

    const session = await this.connection.startSession();
    const { items, ...receiptData } = createGoodsReceiptDto;
    try {
      session.startTransaction();
      // create goods receipt
      const goodsReceipt = await this.goodsReceiptModel.create({
        ...receiptData,
        code: `PN${Date.now()}`,
        createdBy,
      });
      // const find = await this.goodsReceiptModel
      //   .findById(goodsReceipt._id)
      //   .session(session);

      // create goods receipt items
      const goodsReceiptItems = await this.goodsReceiptItemModel.insertMany(
        items.map((item) => ({
          ...item,
          goodsReceipt: goodsReceipt._id,
        })),
      );

      for (const item of goodsReceiptItems) {
        // update inventory
        const inventory = await this.inventoryModel.findOneAndUpdate(
          { product: item.product, warehouse: item.warehouse },
          { $inc: { quantity: item.quantity } },
          { new: true, upsert: true, session },
        );

        // create inventory transaction
        await this.inventoryTransactionModel.create(
          [
            {
              inventory: inventory._id,
              warehouse: item.warehouse, 
              type: TransactionType.INBOUND,
              reference: goodsReceipt._id,
              product: item.product,
              quantity: item.quantity,
              before_quantity: inventory.quantity - item.quantity,
            },
          ],
          { session },
        );
      }

      await goodsReceipt.save({ session });

      await session.commitTransaction();

      return this.mapToResponseDto(goodsReceipt);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  }

  async findAll(): Promise<GoodsReceiptResponseDto[]> {
    const receipts = await this.goodsReceiptModel.find().exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findById(id: string): Promise<GoodsReceiptResponseDto> {
    const receipt = await this.goodsReceiptModel.findById(id).exec();
    if (!receipt) {
      throw new NotFoundException(`Goods receipt with ID ${id} not found`);
    }
    return this.mapToResponseDto(receipt);
  }

  async findByCode(code: string): Promise<GoodsReceiptResponseDto> {
    const receipt = await this.goodsReceiptModel.findOne({ code }).exec();
    if (!receipt) {
      throw new NotFoundException(`Goods receipt with code ${code} not found`);
    }
    return this.mapToResponseDto(receipt);
  }

  async findByWarehouse(
    warehouseId: string,
  ): Promise<GoodsReceiptResponseDto[]> {
    const receipts = await this.goodsReceiptModel
      .find({ warehouse: warehouseId })
      .exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findBySupplier(supplierId: string): Promise<GoodsReceiptResponseDto[]> {
    const receipts = await this.goodsReceiptModel
      .find({ supplier: supplierId })
      .exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findByStatus(status: string): Promise<GoodsReceiptResponseDto[]> {
    const receipts = await this.goodsReceiptModel.find({ status }).exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async update(
    id: string,
    updateGoodsReceiptDto: UpdateGoodsReceiptDto,
  ): Promise<GoodsReceiptResponseDto> {
    const receipt = await this.goodsReceiptModel
      .findByIdAndUpdate(id, updateGoodsReceiptDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!receipt) {
      throw new NotFoundException(`Goods receipt with ID ${id} not found`);
    }

    return this.mapToResponseDto(receipt);
  }

  async delete(id: string): Promise<void> {
    const result = await this.goodsReceiptModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Goods receipt with ID ${id} not found`);
    }
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<GoodsReceiptResponseDto> {
    const receipt = await this.goodsReceiptModel
      .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
      .exec();

    if (!receipt) {
      throw new NotFoundException(`Goods receipt with ID ${id} not found`);
    }

    return this.mapToResponseDto(receipt);
  }

  private mapToResponseDto(
    receipt: GoodsReceiptDocument,
  ): GoodsReceiptResponseDto {
    const doc = receipt.toObject();
    return {
      _id: doc._id?.toString(),
      code: doc.code,
      warehouse: doc.warehouse?.toString(),
      supplier: doc.supplier?.toString(),
      status: doc.status,
      note: doc.note,
      createdBy: doc.createdBy?.toString(),
      createdAt: doc.createdAt?.toString(),
      updatedAt: doc.updatedAt?.toString(),
      invoiceNumber: doc.invoiceNumber,
      invoiceDate: doc.invoiceDate,
    };
  }
}
