import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Faculty, FacultyDocument } from '../faculty/schemas/faculty.schema';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';
import { Room } from './schemas/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>,
    @InjectModel(Faculty.name)
    private readonly facultyModel: Model<FacultyDocument>,
  ) {}

  // Create a room document referencing a faculty
  async create(facultyId: string, dto: CreateRoomDto): Promise<Room> {
    const faculty = await this.facultyModel.findById(facultyId).exec();
    if (!faculty)
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);

    // Ensure unique code or roomNumber within the faculty if provided
    if ((dto as any).code) {
      const dup = await this.roomModel
        .findOne({ code: (dto as any).code, faculty: faculty._id })
        .lean()
        .exec();
      if (dup) {
        throw new ConflictException(
          `Room with code ${(dto as any).code} already exists in this faculty`,
        );
      }
    } else if (dto.roomNumber) {
      const dup = await this.roomModel
        .findOne({ roomNumber: dto.roomNumber, faculty: faculty._id })
        .lean()
        .exec();
      if (dup) {
        throw new ConflictException(
          `Room with number ${dto.roomNumber} already exists in this faculty`,
        );
      }
    }

    const now = new Date();
    const payload: any = {
      ...dto,
      faculty: new Types.ObjectId(facultyId),
      type: (dto as any).type ?? ('classroom' as any),
      status: (dto as any).status ?? ('active' as any),
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.roomModel.create(payload);

    // Keep faculty.rooms in sync
    await this.facultyModel
      .updateOne({ _id: faculty._id }, { $addToSet: { rooms: created._id } })
      .exec();
    return created.toObject ? (created.toObject() as any) : (created as any);
  }

  async findAllByFaculty(facultyId: string): Promise<Room[]> {
    return this.roomModel
      .find({ faculty: new Types.ObjectId(facultyId) })
      .lean()
      .exec();
  }

  async findOne(roomId: string): Promise<Room> {
    const room = await this.roomModel
      .findOne({
        _id: new Types.ObjectId(roomId),
      })
      .lean()
      .exec();
    if (!room)
      throw new NotFoundException(
        `Room with ID ${roomId} not found in faculty`,
      );
    return room;
  }

  async findById(
    roomId: string,
    continueOnNotFound: boolean = false,
  ): Promise<Room | null> {
    const room = await this.roomModel.findById(roomId).lean().exec();
    if (!room && !continueOnNotFound) {
      throw new NotFoundException(
        `Room with ID ${roomId} not found in faculty`,
      );
    }
    return room;
  }

  // Helper for seeding: find by code within a faculty
  async findByCode(code: string): Promise<Room | null> {
    return this.roomModel.findOne({ code }).lean().exec();
  }

  async update(
    facultyId: string,
    roomId: string,
    dto: UpdateRoomDto,
  ): Promise<Room> {
    const updated = await this.roomModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(roomId),
          faculty: new Types.ObjectId(facultyId),
        },
        { ...dto, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated)
      throw new NotFoundException(
        `Room with ID ${roomId} not found in faculty`,
      );

    return updated;
  }

  async remove(facultyId: string, roomId: string): Promise<void> {
    const res = await this.roomModel
      .deleteOne({
        _id: new Types.ObjectId(roomId),
        faculty: new Types.ObjectId(facultyId),
      })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException(
        `Room with ID ${roomId} not found in faculty`,
      );
    }

    // Keep faculty.rooms in sync
    await this.facultyModel
      .updateOne(
        { _id: new Types.ObjectId(facultyId) },
        { $pull: { rooms: new Types.ObjectId(roomId) } },
      )
      .exec();
  }
}
