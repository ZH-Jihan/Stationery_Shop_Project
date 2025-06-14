import { z } from 'zod';

export const OrderValidationSchema = z.object({
  items: z.array(
    z.object({
      product: z.string().min(1),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    }),
  ),
  paymentMethod: z.enum(['cod', 'sslcommerz']),
  totalPrice: z.number().positive(),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});
