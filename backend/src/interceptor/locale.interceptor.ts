import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertObjectId, localizeDeep } from '../utils/localizeDeep';

// Helper function to convert Mongoose documents to plain objects
function toPlainObject(data: any): any {
  if (!data) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => toPlainObject(item));
  }

  // Handle Mongoose documents
  if (data.toObject && typeof data.toObject === 'function') {
    return data.toObject();
  }

  // Handle plain objects with nested Mongoose documents
  if (typeof data === 'object') {
    const plain: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        plain[key] = toPlainObject(data[key]);
      }
    }
    return plain;
  }

  return data;
}

@Injectable()
export class LocaleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: any): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Detect language from headers (priority order)
    const acceptLanguage = request.headers['accept-language'];
    const customLang =
      request.headers['x-locale'] || request.headers['x-language'];

    // Parse accept-language header (e.g., "en-US,en;q=0.9,vi;q=0.8")
    let locale = 'en'; // default



    if (customLang) {
      locale = customLang; //customLang.toLowerCase().split('-')[0];
    } else if (acceptLanguage) {
      const primaryLang = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase();
      locale = primaryLang;
    }

    // Validate supported languages
    const supportedLocales = ['en', 'vi'];
    if (!supportedLocales.includes(locale)) {
      locale = 'en';
    }

    // Attach to request object
    request.locale = locale;
    //return next.handle();
    return next.handle().pipe(
      map((data) => {
        // Convert Mongoose documents to plain objects first
        const plainData = toPlainObject(data);
        return localizeDeep(plainData, locale);
      }),
    );
  }
}
