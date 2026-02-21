import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GoodsReceiptItem,
  GoodsReceiptItemDocument,
} from './schemas/goods-receipt-item.schema';
import {
  CreateGoodsReceiptItemDto,
  UpdateGoodsReceiptItemDto,
} from './dto/goods-receipt-item.dto';
import { GoodsReceiptItemResponseDto } from './dto/goods-receipt-item-response.dto';

@Injectable()
export class GoodsReceiptItemsService {
  constructor(
    @InjectModel(GoodsReceiptItem.name)
    private goodsReceiptItemModel: Model<GoodsReceiptItemDocument>,
  ) {}

  async create(
    createGoodsReceiptItemDto: CreateGoodsReceiptItemDto,
  ): Promise<GoodsReceiptItemResponseDto> {
    const goodsReceiptItem = await this.goodsReceiptItemModel.create(
      createGoodsReceiptItemDto,
    );
    return this.mapToResponseDto(goodsReceiptItem);
  }

  async createBulk(
    createGoodsReceiptItemDtos: CreateGoodsReceiptItemDto[],
  ): Promise<any[]> {
    return this.goodsReceiptItemModel.insertMany(createGoodsReceiptItemDtos);

    //return items.map((item) => this.mapToResponseDto(item));
  }

  async findAll(): Promise<GoodsReceiptItemResponseDto[]> {
    const items = await this.goodsReceiptItemModel.find().exec();
    return items.map((item) => this.mapToResponseDto(item));
  }

  async findById(id: string): Promise<GoodsReceiptItemResponseDto> {
    const item = await this.goodsReceiptItemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Goods receipt item with ID ${id} not found`);
    }
    return this.mapToResponseDto(item);
  }

  async findByGoodsReceipt(goodsReceipt: string): Promise<any[]> {
    return this.goodsReceiptItemModel
      .find({ goodsReceipt })
      .populate('product', '_id name')
      .populate('warehouse', '_id name')
      .lean()
      .exec();
    // return items.map((item) => this.mapToResponseDto(item));
  }

  async findByProduct(
    productId: string,
  ): Promise<GoodsReceiptItemResponseDto[]> {
    const items = await this.goodsReceiptItemModel.find({ productId }).exec();
    return items.map((item) => this.mapToResponseDto(item));
  }

  async update(
    id: string,
    updateGoodsReceiptItemDto: UpdateGoodsReceiptItemDto,
  ): Promise<GoodsReceiptItemResponseDto> {
    const item = await this.goodsReceiptItemModel
      .findByIdAndUpdate(id, updateGoodsReceiptItemDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!item) {
      throw new NotFoundException(`Goods receipt item with ID ${id} not found`);
    }

    return this.mapToResponseDto(item);
  }

  async delete(id: string): Promise<void> {
    const result = await this.goodsReceiptItemModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(`Goods receipt item with ID ${id} not found`);
    }
  }

  async deleteByGoodsReceipt(goodsReceiptId: string): Promise<void> {
    await this.goodsReceiptItemModel.deleteMany({ goodsReceiptId }).exec();
  }

  private mapToResponseDto(
    item: GoodsReceiptItemDocument,
  ): GoodsReceiptItemResponseDto {
    const doc = item.toObject();
    return {
      _id: doc._id?.toString(),
      goodsReceipt: doc.goodsReceipt?.toString(),
      product: doc.product?.toString(),
      quantity: doc.quantity,
      createdAt: doc.createdAt?.toString(),
      updatedAt: doc.updatedAt?.toString(),
      price: doc.price,
    };
  }
}
