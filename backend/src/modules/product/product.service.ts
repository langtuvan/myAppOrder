import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return (
      this.productModel
        //.find({ isAvailable: true })
        .find()
        .populate('category')
        .lean()
        .exec()
    );
  }

  async findByName(name: string): Promise<ProductDocument | null> {
    return this.productModel.findOne({ name }).populate('category').exec();
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productModel
      .find({ category: categoryId, isAvailable: true })
      .populate('category')
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findById(
    id: string,
    continueOnNotFound: boolean = false,
  ): Promise<Product | null> {
    const find = await this.productModel
      .findById(id)
      .populate('category')
      .lean()
      .exec();
    if (!find && !continueOnNotFound) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return find;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateProductImage(id: string, imagePath: string): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { imageSrc: imagePath }, { new: true })
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // updateProductImages
  async updateImages(id: string, imagePaths: string[]): Promise<Product> {
    // PUSH new images to existing images array
    const product = await this.productModel
      //.findByIdAndUpdate(id, { images: imagePaths }, { new: true })
      .findByIdAndUpdate(
        id,
        { $push: { images: { $each: imagePaths } } },
        { new: true },
      )
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // deleteProductImage
  async deleteImage(id: string, imageUrl: string): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $pull: { images: imageUrl } }, { new: true })
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
