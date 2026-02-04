import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodSerializationException, ZodValidationException } from 'nestjs-zod';
import type { ZodError } from 'zod';

/**
 * Standardized API error response matching frontend ApiResponse type.
 * - `data`: always null for errors
 * - `message`: human-readable error message
 * - `errors`: field-level validation errors (only for validation failures)
 */
interface ApiErrorResponse {
  data: null;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Global exception filter that catches ALL exceptions and returns
 * a consistent JSON response to the frontend.
 *
 * Handles:
 * - ZodValidationException: returns field-level errors
 * - ZodSerializationException: response serialization failures
 * - HttpException: standard NestJS exceptions
 * - Any other Error: caught as 500 Internal Server Error
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { status, body } = this.buildResponse(exception);
    res.status(status).json(body);
  }

  private buildResponse(exception: unknown): {
    status: number;
    body: ApiErrorResponse;
  } {
    // Zod validation error (request body/query/params validation)
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as ZodError;
      const flattened = zodError.flatten();
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          data: null,
          message: 'Validation failed',
          errors: flattened.fieldErrors as Record<string, string[]>,
        },
      };
    }

    // Zod serialization error (response serialization failed)
    if (exception instanceof ZodSerializationException) {
      this.logger.error('Response serialization failed', exception.message);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          data: null,
          message: 'Response serialization failed',
        },
      };
    }

    // Standard NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message = this.extractMessage(payload);
      return {
        status,
        body: { data: null, message },
      };
    }

    // Unknown error - log and return 500
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: { data: null, message: exception.message },
      };
    }

    // Fallback for non-Error throws
    this.logger.error('Unknown exception', String(exception));
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { data: null, message: 'Internal server error' },
    };
  }

  private extractMessage(payload: string | object): string {
    if (typeof payload === 'string') return payload;
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const msg = (payload as { message: unknown }).message;
      if (Array.isArray(msg)) return msg[0] ?? 'An error occurred';
      if (typeof msg === 'string') return msg;
    }
    return 'An error occurred';
  }
}
