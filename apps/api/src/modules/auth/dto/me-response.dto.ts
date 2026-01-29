import { meResponseSchema } from '@omni-site/schemas';
import { createZodDto } from 'nestjs-zod';

export class MeResponseDto extends createZodDto(meResponseSchema) {}
