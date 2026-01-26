import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Query,
  Req,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReceptionService } from './reception.service';
import { ReceptionCronService } from './reception.cron.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { ReceptionResponseDto } from './dto/reception-response.dto';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { CurrentUser } from '../auth/current-user.decorator';
import { ExamService } from '../exam/exam.service';
import { currentFaculty } from '../../decorators/faculty.decorator';
import { CustomerService } from '../customer/customer.service';
import { uuidv7 } from 'uuidv7';
import { isUuidV7 } from '../../utils/valid';
import { ItemService } from '../item/item.service';
import { CreateCustomerDto } from '../customer/dto/customer.dto';
import { find } from 'rxjs';
import { CreateOrderItemDto } from '../item/dto/item.dto';
import { Customer } from '../customer/schemas/customer.schema';
import { OrderItem } from '../item/schemas/item.schema';
import { stat } from 'fs';

@ApiTags('receptions')
@Controller('receptions')
export class ReceptionController {
  constructor(
    private readonly receptionService: ReceptionService,
    private readonly examService: ExamService,
    private readonly customerService: CustomerService,
    private readonly itemsService: ItemService,
    private readonly receptionCronService: ReceptionCronService,
  ) {}

  @Get()
  @CheckPermission('receptions', 'read')
  @Public()
  @ApiOperation({ summary: 'Get all receptions' })
  @ApiResponse({
    status: 200,
    description: 'Return all receptions.',
    type: [ReceptionResponseDto],
  })
  findAll(
    @currentFaculty() faculty: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.receptionService.findAll({ faculty, from, to });
  }

  @Get('/today/:customerId')
  @CheckPermission('receptions', 'read')
  @ApiOperation({ summary: 'Get receptions by customer ID for today' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Return receptions for the customer created today.',
    type: [ReceptionResponseDto],
  })
  async findByCustomerToday(
    @currentFaculty() faculty: string,
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query('receptionId') receptionId?: string,
  ) {
    // check reception id today
    const items = await this.itemsService.findItemsByCustomer(customerId);

    if (isUuidV7(receptionId || '')) {
      const [reception]: any = await Promise.all([
        await this.receptionService.findOne(receptionId),
      ]);
      if (reception) {
        //return reception today
        return { ...reception, items };
      }
    }

    // find customer and ceheck reception today
    const [customer, reception] = await Promise.all([
      await this.customerService.findOne(customerId),
      await this.receptionService.findByCustomerToday(customerId, faculty),
    ]);

    if (reception) {
      return { ...reception, items };
    }
    return {
      customer,
      items,
    };
  }

  @Get(':id')
  @CheckPermission('receptions', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a reception by ID' })
  @ApiParam({ name: 'id', description: 'Reception ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the reception.',
    type: ReceptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reception not found.' })
  findOne(@Param('id') id: string) {
    return this.receptionService.findOne(id);
  }

  @Post()
  @CheckPermission('receptions', 'create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new reception' })
  @ApiBody({ type: CreateReceptionDto })
  @ApiResponse({
    status: 201,
    description: 'Reception has been successfully created.',
    type: ReceptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createReceptionDto: CreateReceptionDto,
    @CurrentUser() user,
  ) {
    const author = user.id;
    // define customerId
    const facultyId = createReceptionDto.faculty;
    //process customer
    const customerId = await this.processCustomer(
      createReceptionDto.customer as any,
    );
    const createdReception = await this.receptionService.create(
      {
        ...createReceptionDto,
        customer: customerId as string,
        faculty: facultyId,
      },
      author,
    );
    // process Items
    const items = await this.processItems(
      createReceptionDto.items || [],
      createdReception._id,
      facultyId,
      customerId,
      author,
    );

    return {
      ...createdReception,
      items,
    };
  }

  @Patch(':id')
  @CheckPermission('receptions', 'update')
  @ApiOperation({ summary: 'Update a reception' })
  //@ApiParam({ name: 'id', description: 'Reception ID' })
  // @ApiBody({ type: UpdateReceptionDto })
  @ApiResponse({
    status: 200,
    description: 'Reception has been successfully updated.',
    type: ReceptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reception not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') receptionId: string,
    @Body() updateReceptionDto: UpdateReceptionDto,
    @CurrentUser() user,
    @Req() req,
  ) {
    // find reception
    const findReception = await this.receptionService.findById(receptionId);
    if (!findReception) {
      throw new Error('Reception not found');
    }

    //process customer
    const author = user.id;
    const facultyId = req.faculty;
    const customerId = findReception.customer as any;

    if (updateReceptionDto.customer) {
      await this.processCustomer(updateReceptionDto.customer as any);
    }

    // process exams
    const newExamIds = await this.processExams(
      updateReceptionDto.exams || [],
      receptionId,
      facultyId,
      customerId,
      author,
    );

    // process Items
    const items = await this.processItems(
      updateReceptionDto.items || [],
      receptionId,
      facultyId,
      customerId,
      author,
    );

    // update reception
    const updateReception = {
      ...updateReceptionDto,
      exams: [...findReception.exams, ...newExamIds],
    };

    const reception = await this.receptionService.update(
      receptionId,
      updateReception as any,
    );
    return {
      ...reception,
      items,
    };
  }

  // patch when on Room
  @Patch('/process/:id')
  @CheckPermission('receptions', 'update')
  @ApiOperation({ summary: 'Update a reception from Room' })
  @ApiParam({ name: 'id', description: 'Reception ID' })
  @ApiResponse({})
  @ApiResponse({ status: 404, description: 'Reception not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateFromRoom(
    @Param('id') receptionId: string,
    @Body() updateReceptionDto: UpdateReceptionDto,
    @CurrentUser() user,
    @Req() req,
  ) {
    // find reception
    const findReception = await this.receptionService.findById(receptionId);
    if (!findReception) {
      throw new Error('Reception not found');
    }

    const findExamByRomm = findReception.exams.find(
      (exam: any) => exam.room.toString() === findReception.room.toString(),
    );

    //update exam status to completed
    if (findExamByRomm) {
      await this.examService.update(findExamByRomm._id, {
        status: updateReceptionDto.status,
      });
    }

    const author = user.id;
    const facultyId = req.faculty;
    const customerId = findReception.customer as any;
    // process Items
    const items = await this.processItems(
      updateReceptionDto.items || [],
      receptionId,
      facultyId,
      customerId,
      author,
    );

    // check dto status and update exam
    if (updateReceptionDto.status === 'completed') {
    } else if (updateReceptionDto.status === 'processing') {
    }

    // find reception exams

    // update reception
    const updateReception = {
      status: updateReceptionDto.status,
    };

    return this.receptionService.update(receptionId, updateReception as any);
  }

  @Delete(':id')
  @CheckPermission('receptions', 'delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reception' })
  @ApiParam({ name: 'id', description: 'Reception ID' })
  @ApiResponse({
    status: 204,
    description: 'Reception has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Reception not found.' })
  remove(@Param('id') id: string) {
    return this.receptionService.remove(id);
  }

  @Patch(':id/toggle')
  @CheckPermission('receptions:update')
  @ApiOperation({ summary: 'Toggle reception active status' })
  @ApiParam({ name: 'id', description: 'Reception ID' })
  @ApiBody({ schema: { properties: { isActive: { type: 'boolean' } } } })
  @ApiResponse({
    status: 200,
    description: 'Reception status has been toggled.',
    type: ReceptionResponseDto,
  })
  toggleActive(
    @Param('id') id: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.receptionService.toggleActive(id, isActive);
  }

  async processCustomer(data: Customer): Promise<string> {
    // check customer id is exits
    let customerId = data._id;
    if (isUuidV7(customerId || '')) {
      // update customer
      await this.customerService.update(customerId as string, {
        ...data,
      });
    } else {
      // create customer
      const { _id, ...createData } = data;
      const newCustomer = await this.customerService.create(
        createData as CreateCustomerDto,
      );
      customerId = newCustomer._id;
    }
    return customerId;
  }

  async processExams(
    exams: any[],
    reception: string,
    faculty: string,
    customer: string,
    author: string,
  ): Promise<string[]> {
    // create exams
    const createExams =
      exams
        ?.filter((exam: any) => !exam._id)
        .map((exam) => ({ ...exam, faculty })) || [];

    let newExamIds: any[] = [];

    if (createExams.length > 0) {
      const newExams = await this.examService.createMany(
        createExams.map((exam) => ({
          ...exam,
          reception,
          //
          faculty,
          customer,
          createdBy: author,
        })),
      );

      newExamIds = newExams.map((exam) => exam._id);
    }

    // update exams
    const updateExams = exams?.filter((exam: any) => exam._id);
    if (updateExams && updateExams.length > 0) {
      this.examService.updateMany(
        updateExams.map((exam) => ({
          ...exam,
          reception,
          //
          faculty,
          customer,
          updatedBy: author,
        })),
      );
    }
    return newExamIds;
  }

  async processItems(
    items: any[],
    reception: string,
    faculty: string,
    customer: string,
    author: string,
  ): Promise<OrderItem[]> {
    const createItems =
      items
        ?.filter((item: any) => !item._id)
        .map((item) => ({
          ...item,
          customer,
          faculty,
          createdBy: author,
        })) || [];

    if (createItems.length > 0) {
      await this.itemsService.createMany(createItems);
    }
    // update items
    const updateItems =
      items
        ?.filter((item: any) => item._id)
        .map((item) => ({
          ...item,
          customer,
          faculty,
          updatedBy: author,
        })) || [];

    if (updateItems && updateItems.length > 0) {
      await this.itemsService.updateMany(updateItems);
    }

    return this.itemsService.findItemsByCustomer(customer);
  }

  // room
  @Get('/process/:id')
  @CheckPermission('receptions', 'read')
  @Public()
  @ApiOperation({ summary: 'Get a reception by ID' })
  @ApiParam({ name: 'id', description: 'Reception ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the reception room.',
    type: ReceptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reception not found.' })
  async findOneInRoom(@Param('id') id: string) {
    const reception = await this.receptionService.findOne(id);
    if (reception.status === 'pending') {
      await this.receptionService.changeStatus(id, 'processing');
    }

    return {
      ...reception,
      items: await this.itemsService.findItemsByCustomer(
        reception.customer._id as string,
      ),
    };
  }

  @Post('cron/create-receptions')
  @CheckPermission('receptions', 'create')
  @ApiOperation({
    summary: 'Manually trigger daily reception creation (for testing)',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily receptions created successfully.',
  })
  async manualCreateReceptions() {
    await this.receptionCronService.manualCreateReceptions();
    return { message: '10 receptions created successfully' };
  }

  // @Post('cron/delete-old-receptions')
  // @CheckPermission('receptions', 'delete')
  // @ApiOperation({
  //   summary: 'Manually trigger deletion of old receptions (for testing)',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Old receptions deleted successfully.',
  // })
  // async manualDeleteOldReceptions() {
  //   await this.receptionCronService.manualDeleteOldReceptions();
  //   return { message: 'Old receptions deleted successfully' };
  // }
}
