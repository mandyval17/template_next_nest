import { userSchema } from '@omni-site/schemas';
import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  type: z.enum(['access', 'refresh']),
});
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

export const authTokensResultSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  accessMaxAgeMs: z.number(),
  refreshMaxAgeMs: z.number(),
});
export type AuthTokensResult = z.infer<typeof authTokensResultSchema>;

export type { User } from '@omni-site/schemas';
