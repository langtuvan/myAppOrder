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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IssueReceiptItemsService } from './issue-receipt-items.service';
import {
  CreateIssueReceiptItemDto,
  UpdateIssueReceiptItemDto,
} from './dto/issue-receipt-item.dto';
import { IssueReceiptItemResponseDto } from './dto/issue-receipt-item-response.dto';

@ApiTags('issue-receipt-items')
@Controller()
export class IssueReceiptItemsController {
  constructor(
    private readonly issueReceiptItemsService: IssueReceiptItemsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new issue receipt item' })
  @ApiBody({ type: CreateIssueReceiptItemDto })
  @ApiResponse({
    status: 201,
    description: 'Issue receipt item created successfully.',
    type: IssueReceiptItemResponseDto,
  })
  async create(
    @Body() createIssueReceiptItemDto: CreateIssueReceiptItemDto,
  ): Promise<IssueReceiptItemResponseDto> {
    return this.issueReceiptItemsService.create(createIssueReceiptItemDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all issue receipt items' })
  @ApiResponse({
    status: 200,
    description: 'List of issue receipt items.',
    type: [IssueReceiptItemResponseDto],
  })
  async findAll(): Promise<IssueReceiptItemResponseDto[]> {
    return this.issueReceiptItemsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get issue receipt item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt item ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue receipt item data.',
    type: IssueReceiptItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt item not found.',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<IssueReceiptItemResponseDto> {
    return this.issueReceiptItemsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update issue receipt item' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt item ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiBody({ type: UpdateIssueReceiptItemDto })
  @ApiResponse({
    status: 200,
    description: 'Issue receipt item updated successfully.',
    type: IssueReceiptItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt item not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateIssueReceiptItemDto: UpdateIssueReceiptItemDto,
  ): Promise<IssueReceiptItemResponseDto> {
    return this.issueReceiptItemsService.update(id, updateIssueReceiptItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete issue receipt item' })
  @ApiParam({
    name: 'id',
    description: 'Issue receipt item ID',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 204,
    description: 'Issue receipt item deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Issue receipt item not found.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.issueReceiptItemsService.delete(id);
  }
}
