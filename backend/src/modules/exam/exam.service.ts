import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { FacultyService } from '../faculty/faculty.service';
import { ReceptionService } from '../reception/reception.service';

@Injectable()
export class ExamService {
  constructor(@InjectModel(Exam.name) private examModel: Model<ExamDocument>) {}

  // createdBy is required by schema; allow service callers to supply it even if DTO doesn't declare it
  async create(
    createExamDto: CreateExamDto,
    createdBy?: string,
  ): Promise<ExamDocument> {
    const payload: any = { ...createExamDto };
    if (createdBy) payload.createdBy = createdBy;
    const createdExam = new this.examModel(payload);
    return createdExam.save();
  }

  // create many
  async createMany(payloads: CreateExamDto[]): Promise<ExamDocument[]> {
    return this.examModel.insertMany(payloads, { ordered: true });
  }

  // // update many bulkWrite
  async updateMany(exams: any[]): Promise<ExamDocument[]> {
    const bulkOps = exams.map((exam) => ({
      updateOne: {
        filter: { _id: exam._id, status: 'pending' },
        update: { $set: { ...exam } },
      },
    }));
    await this.examModel.bulkWrite(bulkOps as any);
    return this.findAll();
  }

  async findAll(): Promise<ExamDocument[]> {
    return this.examModel
      .find()
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async findById(id: string): Promise<ExamDocument> {
    return this.examModel
      .findById(id)
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async findByFacultyId(facultyId: string): Promise<ExamDocument[]> {
    return this.examModel
      .find({ faculty: facultyId })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async findByRoomId(roomId: string): Promise<ExamDocument[]> {
    return this.examModel
      .find({ room: roomId })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async findByDate(date: string): Promise<ExamDocument[]> {
    return this.examModel
      .find({ date })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async update(
    id: string,
    updateExamDto: UpdateExamDto,
  ): Promise<ExamDocument> {
    return this.examModel
      .findByIdAndUpdate(id, updateExamDto, { new: true })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async remove(id: string): Promise<ExamDocument> {
    const findExam = await this.examModel.findById(id).exec();

    if (!findExam) {
      throw new Error(`Exam with ID ${id} not found`);
    }
    return this.examModel.findByIdAndDelete(id).exec();
  }

  async findByStatus(status: string): Promise<ExamDocument[]> {
    return this.examModel
      .find({ status })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }

  async updateStatus(id: string, status: string): Promise<ExamDocument> {
    return this.examModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('faculty')
      .populate('room')
      .populate('service')
      .exec();
  }
}
