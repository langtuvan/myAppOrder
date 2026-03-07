import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IssueReceipt,
  IssueReceiptDocument,
} from './schemas/issue-receipt.schema';
import {
  CreateIssueReceiptDto,
  CreateIssueReceiptDtoWithItems,
  UpdateIssueReceiptDto,
} from './dto/issue-receipt.dto';
import { IssueReceiptResponseDto } from './dto/issue-receipt-response.dto';
import { InventoryTransactionsService } from '../inventory_transactions/inventory_transactions.service';
import {
  IssueReceiptItem,
  IssueReceiptItemsService,
} from '../issue_receipt_items';
import { Connection, ClientSession } from 'mongoose';
import {
  InventoryTransaction,
  TransactionType,
} from '../inventory_transactions/schemas/inventory-transaction.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';

@Injectable()
export class IssueReceiptsService {
  constructor(
    @InjectModel(IssueReceipt.name)
    private issueReceiptModel: Model<IssueReceiptDocument>,
    @InjectModel(IssueReceiptItem.name)
    private issueReceiptItemModel: Model<IssueReceiptItem>,
    @InjectModel(InventoryTransaction.name)
    private inventoryTransactionModel: Model<InventoryTransaction>,
    @InjectModel(Inventory.name)
    private inventoryModel: Model<Inventory>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(
    createIssueReceiptDto: CreateIssueReceiptDtoWithItems,
    createdBy: string,
  ): Promise<IssueReceiptResponseDto> {
    const session = await this.connection.startSession();
    const { items, ...receiptData } = createIssueReceiptDto;
    try {
      session.startTransaction();
      // create issue receipt
      console.log('IssueReceiptsService', 'create', 'receiptData', receiptData);

      const issueReceipt = await this.issueReceiptModel.create(
        [
          {
            ...receiptData,
            code: `PX${Date.now()}`, // YC for Yêu Cầu (request) or PX for Phiếu Xuất (issue)
            createdBy,
          },
        ],
        { session },
      );

      // create issue receipt items
      const issueReceiptItems = await this.issueReceiptItemModel.insertMany(
        items.map((item) => ({
          ...item,
          warehouse: '6985998184dc862b3ffa7352',
          issueReceipt: issueReceipt[0]._id,
        })),
        { session },
      );

      for (const item of issueReceiptItems) {
        // update inventory (decrease quantity)
        const inventory = await this.inventoryModel.findOneAndUpdate(
          { product: item.product, warehouse: item.warehouse },
          { $inc: { quantity: -item.quantity } },
          { new: true, upsert: true, session },
        );

        // create inventory transaction
        await this.inventoryTransactionModel.create(
          [
            {
              inventory: inventory._id,
              warehouse: item.warehouse,
              type: TransactionType.OUTBOUND,
              reference: issueReceipt[0]._id,
              product: item.product,
              quantity: item.quantity,
              before_quantity: inventory.quantity + item.quantity,
            },
          ],
          { session },
        );
      }

      await session.commitTransaction();

      return this.mapToResponseDto(issueReceipt[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<IssueReceiptResponseDto[]> {
    const receipts = await this.issueReceiptModel.find().exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findById(id: string): Promise<IssueReceiptResponseDto> {
    const receipt = await this.issueReceiptModel.findById(id).exec();
    if (!receipt) {
      throw new NotFoundException(`Issue receipt with ID ${id} not found`);
    }
    return this.mapToResponseDto(receipt);
  }

  async findByCode(code: string): Promise<IssueReceiptResponseDto> {
    const receipt = await this.issueReceiptModel.findOne({ code }).exec();
    if (!receipt) {
      throw new NotFoundException(`Issue receipt with code ${code} not found`);
    }
    return this.mapToResponseDto(receipt);
  }

  async findByWarehouse(
    warehouseId: string,
  ): Promise<IssueReceiptResponseDto[]> {
    const receipts = await this.issueReceiptModel
      .find({ warehouse: warehouseId })
      .exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findByCustomer(customerId: string): Promise<IssueReceiptResponseDto[]> {
    const receipts = await this.issueReceiptModel
      .find({ customer: customerId })
      .exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async findByStatus(status: string): Promise<IssueReceiptResponseDto[]> {
    const receipts = await this.issueReceiptModel.find({ status }).exec();
    return receipts.map((receipt) => this.mapToResponseDto(receipt));
  }

  async update(
    id: string,
    updateIssueReceiptDto: UpdateIssueReceiptDto,
  ): Promise<IssueReceiptResponseDto> {
    const receipt = await this.issueReceiptModel
      .findByIdAndUpdate(id, updateIssueReceiptDto, { new: true })
      .exec();
    if (!receipt) {
      throw new NotFoundException(`Issue receipt with ID ${id} not found`);
    }
    return this.mapToResponseDto(receipt);
  }

  async delete(id: string): Promise<void> {
    const result = await this.issueReceiptModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Issue receipt with ID ${id} not found`);
    }
  }

  private mapToResponseDto(receipt: any): IssueReceiptResponseDto {
    return {
      _id: receipt._id?.toString(),
      code: receipt.code,
      customer: receipt.customer?.toString(),
      warehouse: receipt.warehouse?.toString(),
      status: receipt.status,
      note: receipt.note,
      createdBy: receipt.createdBy?.toString(),
      createdAt: receipt.createdAt?.toISOString(),
      updatedAt: receipt.updatedAt?.toISOString(),
    };
  }
}
