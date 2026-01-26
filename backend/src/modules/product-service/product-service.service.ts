import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductService as ProductServiceEntity,
  ProductServiceDocument,
} from './schemas/product-service.schema';
import {
  CreateProductServiceDto,
  UpdateProductServiceDto,
} from './dto/product-service.dto';

@Injectable()
export class ProductServiceService {
  constructor(
    @InjectModel(ProductServiceEntity.name)
    private productServiceModel: Model<ProductServiceDocument>,
  ) {}

  async create(
    createProductServiceDto: CreateProductServiceDto,
  ): Promise<ProductServiceEntity> {
    const productService = new this.productServiceModel(
      createProductServiceDto,
    );

    return (await productService.save()).populate('category');
  }

  async findAll(): Promise<ProductServiceEntity[]> {
    return this.productServiceModel
      .find()
      .populate('category')
      .lean()
      .exec();
  }

  async findByProduct(productId: string): Promise<ProductServiceEntity[]> {
    return this.productServiceModel.find({ product: productId }).lean().exec();
  }

  async findOne(id: string): Promise<ProductServiceEntity> {
    const productService = await this.productServiceModel
      .findById(id)
      .populate('category')
      .lean()
      .exec();
    if (!productService) {
      throw new NotFoundException(`Product Service with ID ${id} not found`);
    }
    return productService;
  }

  //find by name
  async findOneByName(name: string): Promise<ProductServiceEntity> {
    return this.productServiceModel.findOne({ name }).exec();
  }

  async findById(
    id: string,
    continueOnNotFound: boolean,
  ): Promise<ProductServiceEntity | null> {
    const find = await this.productServiceModel.findById(id).lean().exec();
    if (!find && !continueOnNotFound) {
      throw new NotFoundException(`Product Service with ID ${id} not found`);
    }
    return find;
  }

  async update(
    id: string,
    updateProductServiceDto: UpdateProductServiceDto,
  ): Promise<ProductServiceEntity> {
    const productService = await this.productServiceModel
      .findByIdAndUpdate(id, updateProductServiceDto, { new: true })
      .populate('category')
      .exec();
    if (!productService) {
      throw new NotFoundException(`Product Service with ID ${id} not found`);
    }
    return productService;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productServiceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product Service with ID ${id} not found`);
    }
  }

  //seeding
  async findByIDSeeding(id: string): Promise<ProductServiceEntity> {
    const productService = await this.productServiceModel.findById(id).exec();
    return productService;
  }
}
