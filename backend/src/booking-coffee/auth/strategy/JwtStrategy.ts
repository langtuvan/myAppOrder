import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/schemas/user.schema';
import { Role } from '../../role/schemas/role.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'defaultSecretKey+123',
    });
  }
  async validate(payload: {
    _id?: string;
    id: string;
    email: string;
    role: Role;
  }): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }
    // return all user information createAccessToken signature
    //return payload as any;

    //find in database the user with the id from payload
    const userId = payload.id || payload._id;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
