import { exampleResponseSchema } from '@omni-site/schemas';
import { createZodDto } from 'nestjs-zod';

export class ExampleResponseDto extends createZodDto(exampleResponseSchema) {}
