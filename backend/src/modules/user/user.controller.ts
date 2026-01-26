import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto, PaginatedResponse } from './dto/pagination.dto';
import { UserDocument } from './schemas/user.schema';
import { Public } from '../../decorators/public.decorator';
import { CheckPermission } from '../../casl';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

function toUserResponse(user: UserDocument): UserResponseDto {
  const obj = user.toJSON ? user.toJSON() : user;
  // Remove sensitive fields
  const { password, refreshToken, ...rest } = obj;
  return rest as UserResponseDto;
}

function toPaginatedUserResponse(
  paginatedUsers: PaginatedResponse<UserDocument>,
): PaginatedResponse<UserResponseDto> {
  return {
    data: paginatedUsers.data.map(toUserResponse),
    pagination: paginatedUsers.pagination,
  };
}

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CheckPermission('users', 'create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return toUserResponse(user);
  }

  @Get()
  @CheckPermission('users', 'read')
  //@Public()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or email',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'email', 'createdAt', 'role'],
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'roleId',
    required: false,
    type: String,
    description: 'Filter by role ID',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Include deleted users',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const paginatedUsers =
      await this.userService.findAllPaginated(paginationDto);
    return toPaginatedUserResponse(paginatedUsers);
  }

  @Get('all')
  // @CheckPermission('users', 'read')
  @ApiOperation({
    summary: 'Get all users without pagination (legacy endpoint)',
  })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  async findAllWithoutPagination(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map(toUserResponse);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStats() {
    return this.userService.getUserStats();
  }

  @Get(':id')
  @CheckPermission('users', 'read')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return toUserResponse(user);
  }

  @Patch(':id')
  @CheckPermission('users', 'update')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, updateUserDto);
    return toUserResponse(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.remove(id);
    return toUserResponse(user);
  }

  @Put(':id/restore')
  @ApiOperation({ summary: 'Restore deleted user' })
  @ApiResponse({ status: 200, description: 'User restored successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async restore(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.restore(id);
    return toUserResponse(user);
  }
}
