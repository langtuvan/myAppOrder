import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faculty, FacultyDocument } from './schemas/faculty.schema';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/faculty.dto';
import { Room } from '../room/schemas/room.schema';
import { FacultyResponseDto } from './dto/faculty-response.dto';
import { localizeDeep } from '../../utils/localizeDeep';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name) private facultyModel: Model<FacultyDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  // Faculty CRUD Operations
  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    // Check if faculty code already exists
    const existingFaculty = await this.facultyModel
      .findOne({ code: createFacultyDto.code })
      .exec();
    if (existingFaculty) {
      throw new ConflictException(
        `Faculty with code ${createFacultyDto.code} already exists`,
      );
    }

    const faculty = new this.facultyModel({
      ...createFacultyDto,
      rooms: createFacultyDto.rooms || [],
      totalRooms: createFacultyDto.rooms?.length || 0,
    });

    return faculty.save();
  }

  async findAllFaculties(): Promise<Faculty[]> {
    return this.facultyModel
      .find({ isActive: true })
      .populate({ path: 'rooms', select: '_id code name' })
      .lean()
      .exec();
  }

  async findFacultyById(id: string, continueOnNotFound: boolean = false): Promise<Faculty> {
    const faculty = await this.facultyModel
      .findById(id)
      .populate({ path: 'rooms', select: '_id code name' })
      .exec();
    if (!faculty && !continueOnNotFound) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    return faculty;
  }

  async findFacultyByCode(code: string): Promise<Faculty> {
    const faculty = await this.facultyModel
      .findOne({ code })
      .populate({ path: 'rooms', select: '_id code name' })
      .exec();
    // if (!faculty) {
    //   throw new NotFoundException(`Faculty with code ${code} not found`);
    // }
    return faculty;
  }

  async updateFaculty(
    id: string,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    // Check if code is being updated and if new code already exists
    if (updateFacultyDto.code) {
      const existingFaculty = await this.facultyModel
        .findOne({ code: updateFacultyDto.code })
        .exec();
      if (existingFaculty && existingFaculty._id.toString() !== id) {
        throw new ConflictException(
          `Faculty with code ${updateFacultyDto.code} already exists`,
        );
      }
    }

    const faculty = await this.facultyModel
      .findByIdAndUpdate(
        id,
        {
          ...updateFacultyDto,
          //totalRooms: updateFacultyDto.rooms?.length ?? undefined,
        },
        { new: true },
      )
      .populate({ path: 'rooms', select: '_id code name' })
      .exec();

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    return faculty;
  }

  async removeFaculty(id: string): Promise<void> {
    const faculty = await this.facultyModel.findById(id).exec();
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }
    //count rooms associated with this faculty
    const roomCount = await this.roomModel.countDocuments({ faculty: id }).exec();
    if (roomCount > 0) {
      throw new BadRequestException(
        `Cannot delete faculty with ID ${id} because it has associated rooms`,
      );
    }

    await this.facultyModel.findByIdAndDelete(id).exec();
  }

  // // Room Operations (Embedded Documents)
  // async addRoom(
  //   facultyId: string,
  //   createRoomDto: CreateRoomDto,
  // ): Promise<Faculty> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   // Check if room number already exists in this faculty
  //   const existingRoom = faculty.rooms.find(
  //     (room) => room.roomNumber === createRoomDto.roomNumber,
  //   );
  //   if (existingRoom) {
  //     throw new ConflictException(
  //       `Room with number ${createRoomDto.roomNumber} already exists in this faculty`,
  //     );
  //   }

  //   const newRoom = {
  //     ...createRoomDto,
  //     type: createRoomDto.type || 'classroom',
  //     status: createRoomDto.status || 'active',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   faculty.rooms.push(newRoom as any);
  //   faculty.totalRooms = faculty.rooms.length;

  //   return faculty.save();
  // }

  // async getRoomsByFaculty(facultyId: string): Promise<Room[]> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   return faculty.rooms;
  // }

  // async getRoomById(facultyId: string, roomIndex: number): Promise<Room> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   const room = faculty.rooms[roomIndex];
  //   if (!room) {
  //     throw new NotFoundException(
  //       `Room at index ${roomIndex} not found in faculty`,
  //     );
  //   }

  //   return room;
  // }

  // async updateRoom(
  //   facultyId: string,
  //   roomIndex: number,
  //   updateRoomDto: UpdateRoomDto,
  // ): Promise<Faculty> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   if (!faculty.rooms[roomIndex]) {
  //     throw new NotFoundException(
  //       `Room at index ${roomIndex} not found in faculty`,
  //     );
  //   }

  //   // Check if room number is being updated and if new number already exists
  //   if (
  //     updateRoomDto.roomNumber &&
  //     updateRoomDto.roomNumber !== faculty.rooms[roomIndex].roomNumber
  //   ) {
  //     const existingRoom = faculty.rooms.find(
  //       (room) => room.roomNumber === updateRoomDto.roomNumber,
  //     );
  //     if (existingRoom) {
  //       throw new ConflictException(
  //         `Room with number ${updateRoomDto.roomNumber} already exists in this faculty`,
  //       );
  //     }
  //   }

  //   faculty.rooms[roomIndex] = {
  //     ...faculty.rooms[roomIndex],
  //     ...updateRoomDto,
  //     updatedAt: new Date(),
  //   };

  //   return faculty.save();
  // }

  // async deleteRoom(facultyId: string, roomIndex: number): Promise<Faculty> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   if (!faculty.rooms[roomIndex]) {
  //     throw new NotFoundException(
  //       `Room at index ${roomIndex} not found in faculty`,
  //     );
  //   }

  //   faculty.rooms.splice(roomIndex, 1);
  //   faculty.totalRooms = faculty.rooms.length;

  //   return faculty.save();
  // }

  // async getRoomByNumber(facultyId: string, roomNumber: string): Promise<Room> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   const room = faculty.rooms.find((r) => r.roomNumber === roomNumber);
  //   if (!room) {
  //     throw new NotFoundException(
  //       `Room with number ${roomNumber} not found in faculty`,
  //     );
  //   }

  //   return room;
  // }

  // async updateRoomByNumber(
  //   facultyId: string,
  //   roomNumber: string,
  //   updateRoomDto: UpdateRoomDto,
  // ): Promise<Faculty> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   const roomIndex = faculty.rooms.findIndex(
  //     (r) => r.roomNumber === roomNumber,
  //   );
  //   if (roomIndex === -1) {
  //     throw new NotFoundException(
  //       `Room with number ${roomNumber} not found in faculty`,
  //     );
  //   }

  //   // Check if room number is being updated and if new number already exists
  //   if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== roomNumber) {
  //     const existingRoom = faculty.rooms.find(
  //       (room) => room.roomNumber === updateRoomDto.roomNumber,
  //     );
  //     if (existingRoom) {
  //       throw new ConflictException(
  //         `Room with number ${updateRoomDto.roomNumber} already exists in this faculty`,
  //       );
  //     }
  //   }

  //   faculty.rooms[roomIndex] = {
  //     ...faculty.rooms[roomIndex],
  //     ...updateRoomDto,
  //     updatedAt: new Date(),
  //   };

  //   return faculty.save();
  // }

  // async deleteRoomByNumber(
  //   facultyId: string,
  //   roomNumber: string,
  // ): Promise<Faculty> {
  //   const faculty = await this.facultyModel.findById(facultyId).exec();
  //   if (!faculty) {
  //     throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
  //   }

  //   const roomIndex = faculty.rooms.findIndex(
  //     (r) => r.roomNumber === roomNumber,
  //   );
  //   if (roomIndex === -1) {
  //     throw new NotFoundException(
  //       `Room with number ${roomNumber} not found in faculty`,
  //     );
  //   }

  //   faculty.rooms.splice(roomIndex, 1);
  //   faculty.totalRooms = faculty.rooms.length;

  //   return faculty.save();
  // }
}
