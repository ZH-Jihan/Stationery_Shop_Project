import { z } from 'zod';

const ProductValidationSchema = z.object({
  name: z.string().min(20, 'Name is required'),
  brand: z.string().min(20, 'Brand is required'),
  price: z.number().positive('Price must be a positive number'),
  category: z.enum(
    ['Writing', 'Office Supplies', 'Art Supplies', 'Educational', 'Technology'],
    {
      errorMap: (issue, _ctx) => {
        return {
          message: 'Category must be one of the predefined values',
        };
      },
    },
  ),
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative integer')
    .default(0),
  inStock: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default ProductValidationSchema;
