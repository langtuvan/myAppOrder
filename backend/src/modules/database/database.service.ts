import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { ModuleService } from '../module/module.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { CreateRoleDto } from '../role/dto/role.dto';
import { CreatePermissionDto } from '../permission/dto/permission.dto';
import { CreateModuleDto } from '../module/dto';
import { FacultyService } from '../faculty/faculty.service';
import faculties from './seeding/faculties';
import rooms from './seeding/rooms';
import { LoggerService } from '../logger/logger.service';
import { ProductServiceService } from '../product-service/product-service.service';
import productServicesSeed from './seeding/product-services';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { CategorySeedData } from './seeding/category';
import { productSeedData } from './seeding/product';
import { CreateCategoryDto } from '../category/dto/category.dto';
import { CreateProductDto } from '../product/dto/product.dto';
import { RoomService } from '../room/room.service';
import { Actions, rolesSeeding } from './seeding/role';
import { usersFn } from './seeding/user';
import { AmenitiesService } from '../amenities/amenities.service';
import { AmenitiesData } from './seeding/amenties';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    // @Inject(forwardRef(() => LoggerService))
    // private readonly loggerService: LoggerService,
    @Inject(forwardRef(() => ModuleService))
    private readonly moduleService: ModuleService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
    // Location related services
    @Inject(forwardRef(() => FacultyService))
    private readonly facultyService: FacultyService,
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
    // Ecommerce related services
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ProductService))
    private readonly productCatalogService: ProductService,
    @Inject(forwardRef(() => ProductServiceService))
    private readonly productServiceService: ProductServiceService,
    @Inject(forwardRef(() => AmenitiesService))
    private readonly amenitiesService: AmenitiesService,
  ) {}

  // async seedDatabase(): Promise<void> {
  //   const startTime = Date.now();
  //   this.logger.log('Starting database seeding...');

  //   try {
  //     // 1. Create default modules
  //     await this.createDefaultModules();

  //     // 2. Create default permissions
  //     await this.createDefaultPermissions();

  //     // 3. Create default roles
  //     await this.createDefaultRoles();

  //     // 4. Create default admin user
  //     await this.createDefaultUsers();

  //     // 5. Create default faculties
  //     await this.createDefaultFaculties();

  //     // 6. Create default rooms
  //     await this.createDefaultRooms();

  //     // 7. Create default categories
  //     await this.createDefaultCategories();

  //     // 8. Create default products
  //     await this.createDefaultProducts();

  //     // 9. Create default product services
  //     await this.createDefaultProductServices();

  //     // 10. Create default amenities
  //     await this.createDefaultAmenities();

  //     const duration = Date.now() - startTime;
  //   } catch (error) {
  //     this.logger.error(
  //       `Database seeding failed: ${error.message}`,
  //       error.stack,
  //     );

  //     throw error;
  //   }
  // }

  private async createDefaultModules(): Promise<void> {
    this.logger.log('Creating default modules...');
    let createdCount = 0;
    let skippedCount = 0;

    const modules = [
      {
        name: 'Users',
        description: 'User management and authentication',
        apiPrefix: '/api/user',
        icon: 'users',
        sortOrder: 1,
      },
      {
        name: 'Roles',
        description: 'Role and access control management',
        apiPrefix: '/api/roles',
        icon: 'shield',
        sortOrder: 2,
      },
      {
        name: 'Permissions',
        description: 'Permission and authorization management',
        apiPrefix: '/api/permissions',
        icon: 'key',
        sortOrder: 3,
      },
      {
        name: 'Modules',
        description: 'System module management',
        apiPrefix: '/api/modules',
        icon: 'puzzle',
        sortOrder: 4,
      },
      {
        name: 'Categories',
        description: 'Product category management',
        apiPrefix: '/api/categories',
        icon: 'category',
        sortOrder: 5,
      },
      {
        name: 'Products',
        description: 'Product catalog and inventory',
        apiPrefix: '/api/products',
        icon: 'package',
        sortOrder: 6,
      },
      {
        name: 'Orders',
        description: 'Order processing and management',
        apiPrefix: '/api/orders',
        icon: 'shopping-cart',
        sortOrder: 7,
      },
      {
        name: 'Faculties',
        description: 'Faculty management and profiles',
        apiPrefix: '/api/faculties',
        icon: 'users-check',
        sortOrder: 8,
      },
      // room
      {
        name: 'Rooms',
        description: 'Room management and bookings',
        apiPrefix: '/api/rooms',
        icon: 'home',
        sortOrder: 9,
      },
      // reception
      {
        name: 'Receptions',
        description: 'Reception desk and front office management',
        apiPrefix: '/api/receptions',
        icon: 'phone',
        sortOrder: 10,
      },
      // exam
      {
        name: 'Exams',
        description: 'Examination scheduling and results',
        apiPrefix: '/api/exams',
        icon: 'clipboard-list',
        sortOrder: 11,
      },
      // item
      {
        name: 'Items',
        description: 'Item inventory and tracking',
        apiPrefix: '/api/items',
        icon: 'archive',
        sortOrder: 13,
      },
      {
        name: 'Product Services',
        description: 'Product service management',
        apiPrefix: '/api/product-services',
        icon: 'cogs',
        sortOrder: 12,
      },
      {
        name: 'Bookings',
        description: 'Booking management and scheduling',
        apiPrefix: '/api/bookings',
        icon: 'calendar',
        sortOrder: 14,
      }
    ];

    for (const moduleData of modules) {
      try {
        const existingModule = await this.moduleService.findByName(
          moduleData.name,
        );
        if (!existingModule) {
          await this.moduleService.create(moduleData as CreateModuleDto);

          createdCount++;
        } else {
          this.logger.debug(`Module already exists: ${moduleData.name}`);
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create module ${moduleData.name}: ${error.message}`,
          error.stack,
        );

      }
    }

    this.logger.log(
      `Modules seeding completed: ${createdCount} created, ${skippedCount} skipped`,
    );
  }

  private async createDefaultPermissions(): Promise<void> {
    this.logger.log('Creating default permissions...');
    let createdCount = 0;
    let skippedCount = 0;
    // Get all modules first to reference them
    const usersModule = await this.moduleService.findByName('Users');
    const rolesModule = await this.moduleService.findByName('Roles');
    const permissionsModule =
      await this.moduleService.findByName('Permissions');
    const modulesModule = await this.moduleService.findByName('Modules');
    const categoriesModule = await this.moduleService.findByName('Categories');
    const productsModule = await this.moduleService.findByName('Products');
    const ordersModule = await this.moduleService.findByName('Orders');
    const facultyModule = await this.moduleService.findByName('Faculties');
    const roomsModule = await this.moduleService.findByName('Rooms');
    const receptionModule = await this.moduleService.findByName('Receptions');
    const examsModule = await this.moduleService.findByName('Exams');
    const itemsModule = await this.moduleService.findByName('Items');
    const bookingModule = await this.moduleService.findByName('Bookings');

    const permissions = [
      // User permissions
      {
        name: 'Create Users',
        action: 'users:create',
        module: usersModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/user',
      },
      {
        name: 'Read Users',
        action: 'users:read',
        module: usersModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/user',
      },
      {
        name: 'Update Users',
        action: 'users:update',
        module: usersModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/user/:id',
      },
      {
        name: 'Delete Users',
        action: 'users:delete',
        module: usersModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/user/:id',
      },
      {
        name: 'Restore Users',
        action: 'users:restore',
        module: usersModule?._id.toString(),
        method: 'PUT',
        apiPath: '/api/user/:id/restore',
      },

      // Role permissions
      {
        name: 'Create Roles',
        action: 'roles:create',
        module: rolesModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/roles',
      },
      {
        name: 'Read Roles',
        action: 'roles:read',
        module: rolesModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/roles',
      },
      {
        name: 'Update Roles',
        action: 'roles:update',
        module: rolesModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/roles/:id',
      },
      {
        name: 'Delete Roles',
        action: 'roles:delete',
        module: rolesModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/roles/:id',
      },
      {
        name: 'Restore Roles',
        action: 'roles:restore',
        module: rolesModule?._id.toString(),
        method: 'PUT',
        apiPath: '/api/roles/:id/restore',
      },

      // Permission permissions
      {
        name: 'Create Permissions',
        action: 'permissions:create',
        module: permissionsModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/permissions',
      },
      {
        name: 'Read Permissions',
        action: 'permissions:read',
        module: permissionsModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/permissions',
      },
      {
        name: 'Update Permissions',
        action: 'permissions:update',
        module: permissionsModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/permissions/:id',
      },
      {
        name: 'Delete Permissions',
        action: 'permissions:delete',
        module: permissionsModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/permissions/:id',
      },
      {
        name: 'Restore Permissions',
        action: 'permissions:restore',
        module: permissionsModule?._id.toString(),
        method: 'PUT',
        apiPath: '/api/permissions/:id/restore',
      },

      // Module permissions
      {
        name: 'Create Modules',
        action: 'modules:create',
        module: modulesModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/modules',
      },
      {
        name: 'Read Modules',
        action: 'modules:read',
        module: modulesModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/modules',
      },
      {
        name: 'Update Modules',
        action: 'modules:update',
        module: modulesModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/modules/:id',
      },
      {
        name: 'Delete Modules',
        action: 'modules:delete',
        module: modulesModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/modules/:id',
      },
      {
        name: 'Restore Modules',
        action: 'modules:restore',
        module: modulesModule?._id.toString(),
        method: 'PUT',
        apiPath: '/api/modules/:id/restore',
      },

      // Category permissions
      {
        name: 'Create Categories',
        action: 'categories:create',
        module: categoriesModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/categories',
      },
      {
        name: 'Read Categories',
        action: 'categories:read',
        module: categoriesModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/categories',
      },
      {
        name: 'Update Categories',
        action: 'categories:update',
        module: categoriesModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/categories/:id',
      },
      {
        name: 'Delete Categories',
        action: 'categories:delete',
        module: categoriesModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/categories/:id',
      },

      // Product permissions
      {
        name: 'Create Products',
        action: 'products:create',
        module: productsModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/products',
      },
      {
        name: 'Read Products',
        action: 'products:read',
        module: productsModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/products',
      },
      {
        name: 'Update Products',
        action: 'products:update',
        module: productsModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/products/:id',
      },
      {
        name: 'Delete Products',
        action: 'products:delete',
        module: productsModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/products/:id',
      },

      // Order permissions
      {
        name: 'Create Orders',
        action: 'orders:create',
        module: ordersModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/orders',
      },
      {
        name: 'Read Orders',
        action: 'orders:read',
        module: ordersModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/orders',
      },
      {
        name: 'Update Orders',
        action: 'orders:update',
        module: ordersModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/orders/:id',
      },
      {
        name: 'Delete Orders',
        action: 'orders:delete',
        module: ordersModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/orders/:id',
      },
      {
        name: 'Update Order Status',
        action: 'orders:status',
        module: ordersModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/orders/:id/status',
      },
      {
        name: 'Cancel Orders',
        action: 'orders:cancel',
        module: ordersModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/orders/:id/cancel',
      },

      // Faculty permissions
      {
        name: 'Create Faculty',
        action: 'faculties:create',
        module: facultyModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/faculties',
      },
      {
        name: 'Read Faculty',
        action: 'faculties:read',
        module: facultyModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/faculties',
      },
      {
        name: 'Update Faculty',
        action: 'faculties:update',
        module: facultyModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/faculties/:id',
      },
      {
        name: 'Delete Faculty',
        action: 'faculties:delete',
        module: facultyModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/faculties/:id',
      },
      // Room permissions
      {
        name: 'Read Rooms',
        action: 'rooms:read',
        module: roomsModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/rooms',
      },
      {
        name: 'Create Rooms',
        action: 'rooms:create',
        module: roomsModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/rooms',
      },
      {
        name: 'Update Rooms',
        action: 'rooms:update',
        module: roomsModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/rooms/:id',
      },
      {
        name: 'Delete Rooms',
        action: 'rooms:delete',
        module: roomsModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/rooms/:id',
      },
      // Exam permissions
      {
        name: 'Read Exams',
        action: 'exams:read',
        module: examsModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/exams',
      },
      {
        name: 'Create Exams',
        action: 'exams:create',
        module: examsModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/exams',
      },
      {
        name: 'Update Exams',
        action: 'exams:update',
        module: examsModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/exams/:id',
      },
      {
        name: 'Delete Exams',
        action: 'exams:delete',
        module: examsModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/exams/:id',
      },
      // item permissions
      {
        name: 'Read Items',
        action: 'items:read',
        module: itemsModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/items',
      },
      {
        name: 'Create Items',
        action: 'items:create',
        module: itemsModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/items',
      },
      {
        name: 'Update Items',
        action: 'items:update',
        module: itemsModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/items/:id',
      },
      {
        name: 'Delete Items',
        action: 'items:delete',
        module: itemsModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/items/:id',
      },
      // reception permissions
      {
        name: 'Read Receptions',
        action: 'receptions:read',
        module: receptionModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/receptions',
      },
      {
        name: 'Create Receptions',
        action: 'receptions:create',
        module: receptionModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/receptions',
      },
      {
        name: 'Update Receptions',
        action: 'receptions:update',
        module: receptionModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/receptions/:id',
      },
      {
        name: 'Delete Receptions',
        action: 'receptions:delete',
        module: receptionModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/receptions/:id',
      },
      // booking permissions
      {
        name: 'Read Booking',
        action: 'bookings:read',
        module: bookingModule?._id.toString(),
        method: 'GET',
        apiPath: '/api/bookings',
      },
      {
        name: 'Create Booking',
        action: 'bookings:create',
        module: bookingModule?._id.toString(),
        method: 'POST',
        apiPath: '/api/bookings',
      },
      {
        name: 'Update Booking',
        action: 'bookings:update',
        module: bookingModule?._id.toString(),
        method: 'PATCH',
        apiPath: '/api/bookings/:id',
      },
      {
        name: 'Delete Booking',
        action: 'bookings:delete',
        module: bookingModule?._id.toString(),
        method: 'DELETE',
        apiPath: '/api/bookings/:id',
      },
    ];

    for (const permissionData of permissions) {
      try {
        if (!permissionData.module) {
          skippedCount++;
          continue;
        }

        const existingPermissions = await this.permissionService.findByAction(
          permissionData.action,
        );
        if (existingPermissions.length === 0) {
          await this.permissionService.create(
            permissionData as CreatePermissionDto,
          );

          createdCount++;
        } else {
          this.logger.debug(
            `Permission already exists: ${permissionData.action}`,
          );
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create permission ${permissionData.action}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultRoles(): Promise<void> {
    this.logger.log('Creating default roles...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const roleData of rolesSeeding) {
      try {
        const existingRoles = await this.roleService.findAll({
          name: roleData.name,
        });
        if (existingRoles.length === 0) {
          const role = await this.roleService.create(roleData as CreateRoleDto);

          createdCount++;

          await this.assignPermissionsToRole(String(role._id), roleData.name);
        } else {
          this.logger.debug(`Role already exists: ${roleData.name}`);
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create role ${roleData.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async assignPermissionsToRole(
    roleId: string,
    roleName: string,
  ): Promise<void> {
    try {
      const allPermissions = await this.permissionService.findAll();
      let assignedCount = 0;

      if (roleName === 'administrator') {
        // Admin gets all permissions
        for (const permission of allPermissions) {
          try {
            await this.roleService.addPermission(
              roleId,
              permission._id.toString(),
            );
            assignedCount++;
          } catch (error) {
            this.logger.debug(
              `Permission already assigned or error: ${permission.action}`,
            );
          }
        }
      } else if (roleName === 'admin') {
        // Admin gets all permissions
        for (const permission of allPermissions) {
          try {
            await this.roleService.addPermission(
              roleId,
              permission._id.toString(),
            );
            assignedCount++;
          } catch (error) {
            this.logger.debug(
              `Permission already assigned or error: ${permission.action}`,
            );
          }
        }
      } else if (roleName === 'manager') {
        // Manager gets inventory and order management permissions
        // const managerActions = [
        //   'receptions:manager',
        //   'exams:manager',
        //   'items:manager',
        // ];
        for (const permission of allPermissions) {
          if (Actions.manager.includes(permission.action)) {
            try {
              await this.roleService.addPermission(
                roleId,
                permission._id.toString(),
              );
              assignedCount++;
            } catch (error) {
              this.logger.debug(
                `Permission already assigned or error: ${permission.action}`,
              );
            }
          }
        }
      } else if (roleName === 'recipient') {
        // const receptionActions = [
        //   'receptions:read',
        //   'exams:read',
        //   'items:read',
        //   'items:create',
        //   'items:update',
        //   'items:delete',
        // ];
        for (const permission of allPermissions) {
          if (Actions.recipient.includes(permission.action)) {
            try {
              await this.roleService.addPermission(
                roleId,
                permission._id.toString(),
              );
            } catch (error) {
              this.logger.debug(
                `Permission already assigned or error: ${permission.action}`,
              );
            }
          }
        }
      } else if (roleName === 'examiner') {
        // const examinerActions = ['exams:read', 'exams:create', 'exams:update'];
        for (const permission of allPermissions) {
          if (Actions.examiner.includes(permission.action)) {
            try {
              await this.roleService.addPermission(
                roleId,
                permission._id.toString(),
              );
              assignedCount++;
            } catch (error) {
              this.logger.debug(
                `Permission already assigned or error: ${permission.action}`,
              );
            }
          }
        }
      } else if (roleName === 'warehouse staff') {
        // const warehouseStaffActions = [
        //   'receptions:read',
        //   'exams:read',
        //   'items:read',
        //   'items:update',
        // ];
        for (const permission of allPermissions) {
          if (Actions.warehouseStaff.includes(permission.action)) {
            try {
              await this.roleService.addPermission(
                roleId,
                permission._id.toString(),
              );
              assignedCount++;
            } catch (error) {
              this.logger.debug(
                `Permission already assigned or error: ${permission.action}`,
              );
            }
          }
        }
      } else if (roleName === 'customer') {
        // Customer gets read and order creation permissions
        const customerActions = [];
        for (const permission of allPermissions) {
          if (customerActions.includes(permission.action)) {
            try {
              await this.roleService.addPermission(
                roleId,
                permission._id.toString(),
              );
              assignedCount++;
            } catch (error) {
              this.logger.debug(
                `Permission already assigned or error: ${permission.action}`,
              );
            }
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `✗ Failed to assign permissions to role ${roleName}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async createDefaultUsers(): Promise<void> {
    this.logger.log('Creating default users...');
    let createdCount = 0;
    let skippedCount = 0;

    // Get admin role
    const administratorRoles = await this.roleService.findAll({
      name: 'administrator',
    });
    const adminRoles = await this.roleService.findAll({ name: 'admin' });
    const managerRoles = await this.roleService.findAll({ name: 'manager' });
    const customerRoles = await this.roleService.findAll({ name: 'customer' });
    const recipientRoles = await this.roleService.findAll({
      name: 'recipient',
    });
    const examinerRoles = await this.roleService.findAll({ name: 'examiner' });
    const warehouseStaffRoles = await this.roleService.findAll({
      name: 'warehouse staff',
    });

    const users = usersFn(
      adminRoles,
      administratorRoles,
      managerRoles,
      recipientRoles,
      examinerRoles,
      warehouseStaffRoles,
      customerRoles,
    );

    for (const userData of users) {
      try {
        const existingUser = await this.userService.findByEmail(userData.email);
        if (!existingUser) {
          await this.userService.create(userData as CreateUserDto);

          createdCount++;
        } else {
          this.logger.debug(`User already exists: ${userData.email}`);
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create user ${userData.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultFaculties(): Promise<void> {
    let createdCount = 0;
    let skippedCount = 0;

    for (const facultyData of faculties) {
      try {
        const existingFaculty = await this.facultyService.findFacultyById(
          facultyData._id,
          true,
        );
        if (!existingFaculty) {
          await this.facultyService.createFaculty(facultyData as any);

          createdCount++;
        } else {
          //this.logger.debug(`Faculty already exists: ${facultyData.code}`);
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create faculty ${facultyData.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultRooms(): Promise<void> {
    this.logger.log('Creating default rooms...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const roomData of rooms as any[]) {
      try {
        // Resolve faculty by code
        const findFaculty = await this.facultyService.findFacultyById(
          roomData.faculty,
          true,
        );
        if (!findFaculty) {
          skippedCount++;
          continue;
        }

        // Check if room already exists (by code + faculty)
        const existingRoom = await this.roomService.findById?.(
          roomData._id,
          true,
        );
        if (existingRoom) {
          this.logger.debug(
            `Room already exists: ${roomData.code} (${findFaculty.code})`,
          );
          skippedCount++;
          continue;
        }

        // Build payload for room creation (exclude facultyCode)
        const { faculty, ...rest } = roomData;

        await this.roomService.create(findFaculty._id.toString(), rest);

        createdCount++;
      } catch (error: any) {
        this.logger.error(
          `✗ Failed to create room ${roomData?.code || roomData?.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultCategories(): Promise<void> {
    this.logger.log('Creating default categories...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const categoryData of CategorySeedData) {
      try {
        const existingCategory = await this.categoryService.findById(
          categoryData._id,
          true,
        );

        if (!existingCategory) {
          const payload: CreateCategoryDto = categoryData;

          await this.categoryService.create(payload);

          createdCount++;
        } else {
          this.logger.debug(`Category already exists: ${categoryData.name}`);
          skippedCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create category ${categoryData.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultProducts(): Promise<void> {
    this.logger.log('Creating default products...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const productData of productSeedData) {
      try {
        const existingProduct = await this.productCatalogService.findById(
          productData._id,
          true,
        );

        if (existingProduct) {
          this.logger.debug(`Product already exists: ${productData.name}`);
          skippedCount++;
          continue;
        }

        const category = await this.categoryService.findById(
          productData.category,
          true,
        );

        if (!category) {
          this.logger.warn(
            `Skipping product ${productData.name} - category ${productData.category} not found`,
          );

          skippedCount++;
          continue;
        }

        await this.productCatalogService.create(productData);

        createdCount++;
      } catch (error) {
        this.logger.error(
          `✗ Failed to create product ${productData.name}: ${error.message}`,
          error.stack,
        );

      }
    }
  }

  private async createDefaultProductServices(): Promise<void> {
    this.logger.log('Creating default product services...');
    let createdCount = 0;
    let skippedCount = 0;
    // Implementation would go here
    for (const productServiceData of productServicesSeed) {
      try {
        // Check if product service already exists
        const existingService = await this.productServiceService.findById(
          productServiceData._id,
          true,
        );
        if (!existingService) {
          await this.productServiceService.create(productServiceData as any);

          createdCount++;
        }
      } catch (error) {
        this.logger.error(
          `✗ Failed to create product service ${productServiceData.name}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  private async createDefaultAmenities(): Promise<void> {
    const count = await this.amenitiesService.countDocuments();
    if (count === 0) {
      await this.amenitiesService.insertMany(AmenitiesData);
    }
  }
}
