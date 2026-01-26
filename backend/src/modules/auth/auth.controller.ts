import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MenuService } from './menu.service';
import * as _ from 'lodash';
import { Public } from '../../decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly menuService: MenuService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 900 } }) // 900 seconds = 15 minutes
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - session expired' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @Post('/me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user, @Body() body) {
    if (!user) {
      throw new UnauthorizedException('session expired');
    }
    return this.authService.getUserWithMenu(user.id, body?.faculty);
  }

  @Throttle({ default: { limit: 5, ttl: 900 } }) // 900 seconds = 15 minutes
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiBody({
    type: [String],
    description: 'Array containing [account, password]',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns user and access token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid credentials',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @Public()
  @Post('login')
  async login(@Request() req, @Body() body: string[]) {
    const [account, pass] = body;
    const user = await this.authService.validateUser(account, pass);

    if (!user) {
      throw new BadRequestException({
        message: [
          {
            field: 'password',
            message: 'your account or password maybe wrong !',
          },
        ],
      });
    }

    const Token = await this.authService.createAccessToken(user as any);
    const userWithMenu = await this.authService.getUserWithMenu(
      (user as any)._id,
    );

    return {
      user: userWithMenu.user,
      accessToken: Token.accessToken,
      menu: userWithMenu.menu,
      permissions: userWithMenu.permissions,
    };
  }

  @Throttle({ default: { limit: 10, ttl: 900 } }) // 900 seconds = 15 minutes
  @ApiOperation({ summary: 'Logout user and invalidate session' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - session expired' })
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user) {
    if (!user) {
      throw new UnauthorizedException('Session expired');
    }

    // Invalidate the user's token or session
    await this.authService.logout(user.id);

    return {
      message: 'Logout successful',
    };
  }

  @Throttle({ default: { limit: 20, ttl: 900 } })
  @ApiOperation({ summary: 'Get menu by module for specific feature access' })
  @ApiResponse({
    status: 200,
    description: 'Module-specific menu items retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/menu/:module')
  @UseGuards(JwtAuthGuard)
  async getMenuByModule(@CurrentUser() user, @Request() req) {
    if (!user) {
      throw new UnauthorizedException('session expired');
    }

    const userWithMenu = await this.authService.getUserWithMenu(user.id);
    const module = req.params.module;

    return {
      module,
      menuItems: this.menuService.getMenuByModule(
        module,
        userWithMenu.permissions,
      ),
    };
  }

  @Throttle({ default: { limit: 10, ttl: 900 } })
  @ApiOperation({ summary: 'Get all available menu permissions' })
  @ApiResponse({ status: 200, description: 'All menu permissions retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/menu/permissions')
  @UseGuards(JwtAuthGuard)
  async getAllMenuPermissions(@CurrentUser() user) {
    if (!user) {
      throw new UnauthorizedException('session expired');
    }

    // Only allow admin users to see all permissions
    const userWithMenu = await this.authService.getUserWithMenu(user.id);
    const hasAdminAccess =
      userWithMenu.permissions.includes('admin:read') ||
      userWithMenu.permissions.includes('permissions:read');

    if (!hasAdminAccess) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return {
      permissions: this.menuService.getAllMenuPermissions(),
    };
  }

  @Throttle({ default: { limit: 30, ttl: 900 } })
  @ApiOperation({ summary: 'Get menu breadcrumb for navigation' })
  @ApiResponse({ status: 200, description: 'Menu breadcrumb retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/menu/breadcrumb/:menuId')
  @UseGuards(JwtAuthGuard)
  async getMenuBreadcrumb(@CurrentUser() user, @Request() req) {
    if (!user) {
      throw new UnauthorizedException('session expired');
    }

    const menuId = req.params.menuId;
    const breadcrumb = this.menuService.getMenuBreadcrumb(menuId);

    return {
      menuId,
      breadcrumb,
    };
  }
}
