import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Standardized API success response matching frontend ApiResponse type.
 */
interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

/**
 * Wraps all successful responses in { data, message } format.
 * Error responses are handled by AllExceptionsFilter.
 */
@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<unknown>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        message: 'Success',
      })),
    );
  }
}
