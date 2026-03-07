import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IssueReceiptItem,
  IssueReceiptItemDocument,
} from './schemas/issue-receipt-item.schema';
import {
  CreateIssueReceiptItemDto,
  UpdateIssueReceiptItemDto,
} from './dto/issue-receipt-item.dto';
import { IssueReceiptItemResponseDto } from './dto/issue-receipt-item-response.dto';

@Injectable()
export class IssueReceiptItemsService {
  constructor(
    @InjectModel(IssueReceiptItem.name)
    private issueReceiptItemModel: Model<IssueReceiptItemDocument>,
  ) {}

  async create(
    createIssueReceiptItemDto: CreateIssueReceiptItemDto,
  ): Promise<IssueReceiptItemResponseDto> {
    const item = await this.issueReceiptItemModel.create(
      createIssueReceiptItemDto,
    );
    return this.mapToResponseDto(item);
  }

  async findAll(): Promise<IssueReceiptItemResponseDto[]> {
    const items = await this.issueReceiptItemModel.find().exec();
    return items.map((item) => this.mapToResponseDto(item));
  }

  async findById(id: string): Promise<IssueReceiptItemResponseDto> {
    const item = await this.issueReceiptItemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Issue receipt item with ID ${id} not found`);
    }
    return this.mapToResponseDto(item);
  }

  async findByIssueReceipt(
    issueReceiptId: string,
  ): Promise<IssueReceiptItemResponseDto[]> {
    const items = await this.issueReceiptItemModel
      .find({ issueReceipt: issueReceiptId })
      .exec();
    return items.map((item) => this.mapToResponseDto(item));
  }

  async update(
    id: string,
    updateIssueReceiptItemDto: UpdateIssueReceiptItemDto,
  ): Promise<IssueReceiptItemResponseDto> {
    const item = await this.issueReceiptItemModel
      .findByIdAndUpdate(id, updateIssueReceiptItemDto, { new: true })
      .exec();
    if (!item) {
      throw new NotFoundException(`Issue receipt item with ID ${id} not found`);
    }
    return this.mapToResponseDto(item);
  }

  async delete(id: string): Promise<void> {
    const result = await this.issueReceiptItemModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(`Issue receipt item with ID ${id} not found`);
    }
  }

  private mapToResponseDto(item: any): IssueReceiptItemResponseDto {
    return {
      _id: item._id?.toString(),
      issueReceipt: item.issueReceipt?.toString(),
      product: item.product?.toString(),
      warehouse: item.warehouse?.toString(),
      quantity: item.quantity,
      price: item.price,
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    };
  }
}
