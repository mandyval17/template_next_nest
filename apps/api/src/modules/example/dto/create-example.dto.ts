import { createExampleSchema } from '@omni-site/schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateExampleDto extends createZodDto(createExampleSchema) {}
