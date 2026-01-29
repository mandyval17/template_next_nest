import { loginSchema } from '@omni-site/schemas';
import { createZodDto } from 'nestjs-zod';

export class LoginDto extends createZodDto(loginSchema) {}
