import { z } from 'zod';

export const ProductValidationSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.enum([
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Health & Wellness',
    'Automotive',
    'Pet Supplies',
    'Other',
  ]),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be a positive number').default(0),
  inStock: z.boolean().default(true),
  discountPercentage: z.number().min(0).max(100).default(0),
  flashSale: z.boolean().default(false),
  flashSalePrice: z.number().min(0).default(0),
  flashSaleEndTime: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  keyFeatures: z
    .array(z.string())
    .min(1, 'At least one key feature is required'),
  specifications: z
    .array(z.string())
    .min(1, 'At least one specification is required'),
  warranty: z.string().min(1, 'Warranty information is required'),
  isDeleted: z.boolean().default(false),
});
