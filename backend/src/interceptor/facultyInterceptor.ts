import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FacultyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Detect faculty from headers
    const facultyHeader = request.headers['x-faculty'];

    if (facultyHeader) {
      request.faculty = facultyHeader;
    }

    return next.handle();
  }
}
