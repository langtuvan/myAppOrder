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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { Permission } from './schemas/permission.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CheckPermission } from '../../casl';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @CheckPermission('permissions', 'create')
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({
    status: 201,
    description: 'Permission created',
    type: Permission,
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @CheckPermission('permissions', 'read')
  @ApiOperation({ summary: 'List all permissions' })
  @ApiQuery({
    name: 'action',
    required: false,
    description: 'Filter by action',
  })
  @ApiQuery({
    name: 'module',
    required: false,
    description: 'Filter by module ID',
  })
  @ApiQuery({
    name: 'method',
    required: false,
    description: 'Filter by HTTP method',
  })
  @ApiQuery({
    name: 'apiPath',
    required: false,
    description: 'Filter by API path',
  })
  @ApiResponse({
    status: 200,
    description: 'List of permissions',
    type: [Permission],
  })
  async findAll(
    @Query('action') action?: string,
    @Query('module') module?: string,
    @Query('method') method?: string,
    @Query('apiPath') apiPath?: string,
  ) {
    if (action) {
      return this.permissionService.findByAction(action);
    }
    if (module) {
      return this.permissionService.findByModule(module);
    }
    if (method) {
      return this.permissionService.findByMethod(method);
    }
    if (apiPath) {
      return this.permissionService.findByApiPath(apiPath);
    }
    return this.permissionService.findAll();
  }

  @Get(':id')
  @CheckPermission('permissions', 'read')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission details',
    type: Permission,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('permissions', 'update')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission updated',
    type: Permission,
  })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @CheckPermission('permissions', 'delete')
  @ApiOperation({ summary: 'Soft delete permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission soft deleted',
    type: Permission,
  })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Put(':id/restore')
  @CheckPermission('permissions', 'update')
  @ApiOperation({ summary: 'Restore soft deleted permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission restored',
    type: Permission,
  })
  restore(@Param('id') id: string) {
    return this.permissionService.restore(id);
  }
}
