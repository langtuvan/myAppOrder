import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './dto';
import { Module } from './schemas/module.schema';
import { CheckPermission } from '../../casl';
import { PermissionService } from '../permission/permission.service';

@ApiTags('modules')
@Controller('modules')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
    private readonly permissionService: PermissionService,
  ) {}

  @Post()
  @CheckPermission('modules', 'create')
  @ApiOperation({ summary: 'Create module' })
  @ApiResponse({
    status: 201,
    description: 'Module created',
    type: Module,
  })
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @Get()
  @CheckPermission('modules', 'read')
  @ApiOperation({ summary: 'List all modules' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by module name',
  })
  @ApiQuery({
    name: 'apiPrefix',
    required: false,
    description: 'Filter by API prefix',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'List of modules',
    type: [Module],
  })
  async findAll(
    @Query('name') name?: string,
    @Query('apiPrefix') apiPrefix?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    const query: any = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (apiPrefix) query.apiPrefix = { $regex: apiPrefix, $options: 'i' };
    if (isActive !== undefined) query.isActive = isActive;

    return this.moduleService.findAll(query);
  }

  @Get('stats')
  @CheckPermission('modules', 'read')
  @ApiOperation({ summary: 'Get module statistics' })
  @ApiResponse({
    status: 200,
    description: 'Module statistics',
    schema: {
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        deleted: { type: 'number' },
      },
    },
  })
  getStats() {
    return this.moduleService.getModuleStats();
  }

  @Get(':id')
  @CheckPermission('modules', 'read')
  @ApiOperation({ summary: 'Get module by id' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 200,
    description: 'Module details',
    type: Module,
  })
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('modules', 'update')
  @ApiOperation({ summary: 'Update module' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 200,
    description: 'Module updated',
    type: Module,
  })
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.moduleService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @CheckPermission('modules', 'delete')
  @ApiOperation({ summary: 'Soft delete module' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 200,
    description: 'Module soft deleted',
    type: Module,
  })
  async remove(@Param('id') id: string) {
    //find related permissions
    const findPermissions = await this.permissionService.findAll({
      module: id,
      deleted: false,
    });

    if (findPermissions.length > 0) {
      throw new BadRequestException('Cannot delete module with existing permissions.');
    }

    return this.moduleService.remove(id);
  }

  @Put(':id/restore')
  @CheckPermission('modules', 'update')
  @ApiOperation({ summary: 'Restore soft deleted module' })
  @ApiParam({ name: 'id', description: 'Module ID' })
  @ApiResponse({
    status: 200,
    description: 'Module restored',
    type: Module,
  })
  restore(@Param('id') id: string) {
    return this.moduleService.restore(id);
  }
}
