import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ExampleModule } from './modules/example/example.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ExampleModule,
  ],
  providers: [
    // Global exception filter - catches all errors and returns consistent response
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // Zod validation pipe - validates request DTOs
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    // Wraps successful responses in { data, message } format
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
    // Serializes response DTOs using Zod schemas
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule { }
