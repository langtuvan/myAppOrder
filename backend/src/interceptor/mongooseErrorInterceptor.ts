import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { MongooseError } from 'mongoose'; 

@Injectable()
export class MongooseErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
          switch (error.code) {
            case 11000: // Duplicate key error
              const field = Object.keys(error.keyPattern)[0];
              throw new BadRequestException({
                message: [
                  {
                    field,
                    message: `This ${field} is already taken`,
                  },
                ],
              });
            default:
              throw new BadRequestException({
                message: [
                  {
                    field: 'database',
                    message: 'Database operation failed',
                  },
                ],
              });
          }
        }

        if (error.name === 'ValidationError') {
          const errors = Object.keys(error.errors).map((field) => ({
            field,
            message: error.errors[field].message,
          }));
          throw new BadRequestException({ message: errors });
        }

        throw error;
      }),
    );
  }
}
