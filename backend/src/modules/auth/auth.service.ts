import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { MenuService } from './menu.service';
import { FacultyService } from '../faculty/faculty.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly menuService: MenuService,
    private readonly facultyService: FacultyService,
  ) {}

  async logout(userId: string): Promise<void> {
    // Example: Invalidate the user's token (if using a token blacklist)
    // You can implement token invalidation logic here, such as:
    // - Adding the token to a blacklist
    // - Removing the token from a database or cache
  }

  async createAccessToken(user: User & { _id: any }) {
    const { _id, email, role } = user;
    const payload = {
      id: _id,
      // email,
      // role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET') ?? 'defaultSecretKey+123',
        expiresIn: this.configService.get('JWT_EXPIRES_IN') ?? '1d',
      }),
    };
  }

  //local
  async validateUser(
    email: string, // username
    password: string,
  ): Promise<Partial<User>> {
    // return user with role and permissions
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await this.userService.comparePassword(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async getUserWithMenu(userId: string, facultyId?: string) {
    const user = await this.userService.findByIdWithRoleAndPermissions(userId);
    if (!user) return null;

    let faculty = null;

    if (facultyId) {
      faculty = await this.facultyService.findFacultyById(facultyId);
    }

    const permissions =
      user.role?.permissions?.map((p: any) => p._id.toString()) || [];

    const menu = this.menuService.generateMenu(permissions);

    return {
      user,
      menu,
      permissions,
      faculty,
    };
  }
}
