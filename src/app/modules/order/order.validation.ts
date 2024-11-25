import { z } from 'zod';

export const OrderValidationSchema = z.object({
  email: z.string().email(),
  product: z.string().min(1),
  quantity: z.number().int().positive(),
  totalPrice: z.number().positive(),
});
