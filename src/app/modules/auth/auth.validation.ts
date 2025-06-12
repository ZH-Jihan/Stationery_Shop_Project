import { z } from 'zod';

export const authZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const genAccessTokenZodSchema = z.object({
  refreshToken: z.string({
    required_error: 'Refresh token is required!',
  }),
});
