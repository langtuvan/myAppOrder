import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from './strategy/JwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MenuService } from './menu.service';
import { FacultyModule } from '../faculty/faculty.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        global: true,
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FacultyModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    JwtStrategy,
    JwtAuthGuard,
    MenuService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
