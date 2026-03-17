import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAmenityDto, UpdateAmenityDto } from './dto/amenities.dto';
import { Amenity, AmenityDocument } from './schemas/amenities.schema';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectModel(Amenity.name)
    private readonly amenityModel: Model<AmenityDocument>,
  ) {}

  async create(dto: CreateAmenityDto): Promise<Amenity> {
    // Check if amenity with same code already exists
    const existing = await this.amenityModel
      .findOne({ code: dto.code })
      .lean()
      .exec();
    if (existing) {
      throw new ConflictException(
        `Amenity with code ${dto.code} already exists`,
      );
    }

    const amenity = await this.amenityModel.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return amenity.toObject();
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
    type?: string,
    status?: string,
  ): Promise<{ data: Amenity[]; total: number }> {
    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    const [data, total] = await Promise.all([
      this.amenityModel.find().lean().exec(),
      this.amenityModel.countDocuments(filter).exec(),
    ]);

    // const [data, total] = await Promise.all([
    //   this.amenityModel.find(filter).limit(limit).skip(offset).lean().exec(),
    //   this.amenityModel.countDocuments(filter).exec(),
    // ]);

    return { data, total };
  }

  async findById(id: string): Promise<Amenity> {
    if (!id) {
      throw new BadRequestException('Amenity ID is required');
    }

    const amenity = await this.amenityModel.findById(id).lean().exec();

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async findByCode(code: string): Promise<Amenity> {
    if (!code) {
      throw new BadRequestException('Code is required');
    }

    const amenity = await this.amenityModel.findOne({ code }).lean().exec();

    if (!amenity) {
      throw new NotFoundException(`Amenity with code ${code} not found`);
    }

    return amenity;
  }

  async update(id: string, dto: UpdateAmenityDto): Promise<Amenity> {
    if (!id) {
      throw new BadRequestException('Amenity ID is required');
    }

    // If code is being updated, check for duplicates
    if (dto.code) {
      const existing = await this.amenityModel
        .findOne({ code: dto.code, _id: { $ne: id } })
        .lean()
        .exec();
      if (existing) {
        throw new ConflictException(
          `Amenity with code ${dto.code} already exists`,
        );
      }
    }

    const amenity = await this.amenityModel
      .findByIdAndUpdate(id, { ...dto, updatedAt: new Date() }, { new: true })
      .lean()
      .exec();

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Amenity ID is required');
    }

    const result = await this.amenityModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return { message: `Amenity with ID ${id} deleted successfully` };
  }

  async deleteByCode(code: string): Promise<{ message: string }> {
    if (!code) {
      throw new BadRequestException('Code is required');
    }

    const result = await this.amenityModel.findOneAndDelete({ code }).exec();

    if (!result) {
      throw new NotFoundException(`Amenity with code ${code} not found`);
    }

    return { message: `Amenity with code ${code} deleted successfully` };
  }

  async updateStatus(id: string, status: string): Promise<Amenity> {
    if (!id) {
      throw new BadRequestException('Amenity ID is required');
    }

    const amenity = await this.amenityModel
      .findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })
      .lean()
      .exec();

    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async countDocuments(): Promise<number> {
    return this.amenityModel.countDocuments().exec();
  }

  async insertMany(data: any[]): Promise<void> {
    await this.amenityModel.insertMany(
      data.map((item) => ({
        ...item,
      })),
    );
  }
}
