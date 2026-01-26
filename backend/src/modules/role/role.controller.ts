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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { CheckPermission } from '../../casl';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @CheckPermission('roles', 'create')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: 201,
    description: 'Role created',
    type: RoleResponseDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @CheckPermission('roles', 'read')
  @ApiOperation({ summary: 'List all roles' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'deleted', required: false, type: Boolean })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: [RoleResponseDto],
  })
  findAll(
    @Query('isActive') isActive?: string,
    @Query('deleted') deleted?: string,
    @Query('name') name?: string,
  ) {
    const query: any = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (deleted !== undefined) query.deleted = deleted === 'true';
    if (name) query.name = { $regex: name, $options: 'i' };
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @CheckPermission('roles', 'read')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role details',
    type: RoleResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @CheckPermission('roles', 'update')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role updated',
    type: RoleResponseDto,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @CheckPermission('roles', 'delete')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted',
    type: RoleResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Put(':id/restore')
  @CheckPermission('roles', 'update')
  @ApiOperation({ summary: 'Restore soft deleted role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role restored',
    type: RoleResponseDto,
  })
  restore(@Param('id') id: string) {
    return this.roleService.restore(id);
  }

  @Put(':roleId/permissions/:permissionId')
  @CheckPermission('roles', 'update')
  @ApiOperation({ summary: 'Add permission to role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission added to role',
    type: RoleResponseDto,
  })
  addPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.addPermission(roleId, permissionId);
  }

  @Delete(':roleId/permissions/:permissionId')
  @CheckPermission('roles', 'update')
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiParam({ name: 'permissionId', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission removed from role',
    type: RoleResponseDto,
  })
  removePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.removePermission(roleId, permissionId);
  }
}
