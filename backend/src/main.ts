import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { FacultyInterceptor } from './interceptor/facultyInterceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

const corsOptions: CorsOptions = {
  origin:
    process.env.CORS_ORIGIN?.split(';').map((origin) => origin.trim()) || '*',
  // origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  maxAge: 3600,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Serve static files
  app.useStaticAssets('client/upload', {
    prefix: '/upload',
  });

  // Enable CORS
  app.enableCors(corsOptions);
  // Cookie parser middleware
  app.use(cookieParser());

  // Apply locale interceptor globally
  //app.useGlobalInterceptors(new LocaleInterceptor());
  app.useGlobalInterceptors(new FacultyInterceptor());

  //validate Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('NestJS Booking Backend API with MongoDB')
    .setVersion('1.0')
    .addTag('categories', 'Category management operations')
    .addTag('products', 'Product management operations')
    .addTag('users', 'User management operations')
    .addTag('roles', 'Role management operations')
    .addTag('permissions', 'Permission management operations')
    .addTag('auth', 'Authentication operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  // console.log(
  //   `Swagger documentation available at: http://localhost:${port}/api/docs`,
  // );
}

bootstrap();
