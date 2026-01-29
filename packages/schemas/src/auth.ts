import { z } from 'zod';

/** User (id + email). Shared across auth flows. */
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;

/** Login request (email + password). */
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginFormData = LoginInput;

/** Register request. */
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormData = RegisterInput;

/** GET /auth/me, or user inside login/refresh responses. */
export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
export type MeResponse = z.infer<typeof meResponseSchema>;

/** POST /auth/login, POST /auth/refresh response. */
export const loginResponseSchema = z.object({ user: userSchema });
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshResponseSchema = z.object({ user: userSchema });
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

/** POST /auth/logout response. */
export const logoutResponseSchema = z.object({ ok: z.literal(true) });
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
