import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reception, ReceptionDocument } from './schemas/reception.schema';
import {
  CreateReceptionDto,
  CreateReceptionInput,
  UpdateReceptionDto,
} from './dto/reception.dto';
import { ExamService } from '../exam/exam.service';
import { CreateExamDto } from '../exam/dto/create-exam.dto';
import { ItemService } from '../item/item.service';
import { ReceptionGateway } from './reception.gateway';

const populateCustomerFields =
  '_id firstName lastName gender phone status email company address city province ward zipCode country notes';
const populateExamFields = '_id room service qty price status date';

// Build today's date range filter
const today = new Date();
const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0,
  0,
);
const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  23,
  59,
  59,
  999,
);

@Injectable()
export class ReceptionService {
  constructor(
    @InjectModel(Reception.name)
    private receptionModel: Model<ReceptionDocument>,
    private readonly examService: ExamService,
    private readonly itemService: ItemService,
    private readonly receptionGateway: ReceptionGateway,
  ) {}

  async create(
    createReceptionDto: CreateReceptionInput,
    createdBy: string,
  ): Promise<Reception> {
    // Create base reception first
    const { exams: examInputs, ...receptionData } = createReceptionDto;
    const customerId = createReceptionDto.customer;
    const facultyId = createReceptionDto.faculty;

    let savedReception = new this.receptionModel({
      ...receptionData,
      //
      customer: customerId,
      faculty: facultyId,
      createdBy,
    });

    // Create exams if provided and attach to reception
    if (Array.isArray(examInputs) && examInputs.length > 0) {
      const examsToCreate: CreateExamDto[] = examInputs.map((exam: any) => ({
        ...exam,
        reception: savedReception._id,
        //
        customer: customerId,
        faculty: facultyId,
        createdBy,
      }));
      const createdExams = await this.examService.createMany(examsToCreate);
      savedReception.exams = createdExams.map((exam) => exam._id) as any;
    }

    await savedReception.save();

    const createdReception = await this.receptionModel
      .findById(savedReception._id)
      .populate('customer', populateCustomerFields)
      .populate({
        path: 'exams',
        select: populateExamFields,
        populate: [
          { path: 'room', select: '_id name' },
          { path: 'service', select: '_id name price' },
        ],
      })
      .populate('room', '_id code name')
      .lean()
      .exec();

    // Emit reception created event
    this.receptionGateway.emitReceptionCreated(createdReception);

    return createdReception;
  }

  // Build a createdAt range filter for a day or range (inclusive)
  private buildCreatedAtRange(from?: string, to?: string) {
    const start = from ? new Date(from) : new Date();
    const end = to ? new Date(to) : start;

    const startOfRange = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfRange = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23,
      59,
      59,
      999,
    );

    return {
      $gte: startOfRange,
      $lte: endOfRange,
    };
  }

  async findAll(params?: {
    from?: string;
    to?: string;
    faculty?: string;
  }): Promise<Reception[]> {
    let filter: any = {};
    // Filter by faculty if provided
    if (params?.faculty) {
      filter.faculty = params.faculty;
    }
    // Filter by createdAt range if provided
    const createdAtRange = this.buildCreatedAtRange(params?.from, params?.to);

    if (createdAtRange) {
      filter.createdAt = createdAtRange;
    }

    return this.receptionModel
      .find(filter)
      .populate('customer', '_id firstName gender phone address')
      .populate('room', '_id code name')
      .populate({
        path: 'exams',
        select: populateExamFields,
        populate: [
          { path: 'room', select: '_id name' },
          { path: 'service', select: '_id name price' },
        ],
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<Reception> {
    return this.receptionModel
      .findOne({
        _id: id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate('customer', populateCustomerFields)
      .populate({
        path: 'exams',
        select: populateExamFields,
        populate: [
          { path: 'room', select: '_id name' },
          { path: 'service', select: '_id name price' },
        ],
      })
      .populate('room', '_id code name')
      .lean()
      .exec();
  }

  async findById(id: string): Promise<Reception> {
    return this.receptionModel.findById(id).populate('exams').exec();
  }

  async findByCustomerToday(
    customerId: string,
    faculty?: string,
  ): Promise<Reception> {
    const reception = await this.receptionModel
      .findOne({
        customer: customerId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        faculty: faculty,
      })
      .populate('room', '_id code name')
      .populate('customer', populateCustomerFields)
      .populate({
        path: 'exams',
        select: populateExamFields,
        populate: [
          { path: 'room', select: '_id name' },
          { path: 'service', select: '_id name price' },
        ],
      })
      .lean()
      .exec();
    return reception;
  }

  async findByName(name: string): Promise<ReceptionDocument | null> {
    return this.receptionModel.findOne({ name }).populate('faculty').exec();
  }

  async update(
    id: string,
    updateReceptionDto: UpdateReceptionDto,
  ): Promise<Reception> {
    const reception = await this.receptionModel
      .findByIdAndUpdate(id, updateReceptionDto, { new: true })
      .exec();
    if (!reception) {
      throw new NotFoundException(`Reception with ID ${id} not found`);
    }
    const updatedReception = await this.receptionModel
      .findById(reception._id)
      .populate('customer', populateCustomerFields)
      .populate({
        path: 'exams',
        select: populateExamFields,
        populate: [
          { path: 'room', select: '_id name' },
          { path: 'service', select: '_id name price' },
        ],
      })
      .populate('room', '_id code name')
      .lean()
      .exec();

    // Emit reception updated event
    this.receptionGateway.emitReceptionUpdated(updatedReception);

    return updatedReception;
  }

  async remove(id: string): Promise<void> {
    const result = await this.receptionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reception with ID ${id} not found`);
    }

    // Emit reception deleted event
    this.receptionGateway.emitReceptionDeleted(id);
  }

  async toggleActive(id: string, isActive: boolean): Promise<Reception> {
    const reception = await this.receptionModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .populate('faculty')
      .exec();
    if (!reception) {
      throw new NotFoundException(`Reception with ID ${id} not found`);
    }

    // Emit reception status toggled event
    this.receptionGateway.emitReceptionStatusToggled(reception);

    return reception;
  }

  async changeStatus(id: string, status: string): Promise<Reception> {
    const reception = await this.receptionModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('faculty')
      .exec();
    if (!reception) {
      throw new NotFoundException(`Reception with ID ${id} not found`);
    }
    // Emit reception status changed event
    this.receptionGateway.emitReceptionStatusToggled(reception);
    return reception;
  }

  async updateExamList(
    receptionId: string,
    examId: string,
  ): Promise<Reception> {
    // find reception and update exams array
    const findReception = await this.receptionModel.findById(receptionId);
    const examIds = findReception?.exams.filter(
      (id) => id.toString() !== examId,
    );
    const reception = await this.receptionModel
      .findByIdAndUpdate(receptionId, { exams: examIds }, { new: true })
      .exec();
    if (!reception) {
      throw new NotFoundException(`Reception with ID ${receptionId} not found`);
    }
    return reception;
  }

  async deleteOldRecords() {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 7); // Set threshold to 7 days ago
    await this.receptionModel.deleteMany({ createdAt: { $lt: dateThreshold } }); // Delete old records
  }
}
