import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  Category,
  CategoryDocument,
  CategoryType,
} from './schemas/category.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  ProductServiceDocument,
  ProductService,
} from '../product-service/schemas/product-service.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductService.name)
    private productServiceModel: Model<ProductServiceDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(filter?: FilterQuery<CategoryDocument>): Promise<Category[]> {
    return this.categoryModel.find(filter).populate('tags').lean().exec();
  }

  async findByName(name: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne({ name }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findById(
    id: string,
    continueOnNotFound: boolean,
  ): Promise<Category | null> {
    const find = await this.categoryModel.findById(id).lean().exec();
    if (!find && !continueOnNotFound) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return find;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    // First check if category exists
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.type === CategoryType.SERVICE) {
      const productsCount = await this.productServiceModel
        .countDocuments({ category: id })
        .exec();
      if (productsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category. There are ${productsCount} product(s) associated with this category. Please delete or reassign the products first.`,
        );
      }
    }

    if (category.type === CategoryType.PRODUCT) {
      // Check if there are any products associated with this category
      const productsCount = await this.productModel
        .countDocuments({ category: id })
        .exec();
      if (productsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category. There are ${productsCount} product(s) associated with this category. Please delete or reassign the products first.`,
        );
      }
    }

    // If no products are associated, proceed with deletion
    await this.categoryModel.findByIdAndDelete(id).exec();
  }

  // updateProductImages
  async updateImages(id: string, imagePaths: string[]): Promise<Category> {
    // PUSH new images to existing images array
    const updated = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { $push: { images: { $each: imagePaths } } },
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updated;
  }

  async deleteImage(id: string, imageUrl: string): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, { $pull: { images: imageUrl } }, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
