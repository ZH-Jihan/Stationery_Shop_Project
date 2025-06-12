"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ProductValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name is required'),
    brand: zod_1.z.string().min(2, 'Brand is required'),
    price: zod_1.z.number().positive('Price must be a positive number'),
    category: zod_1.z.enum(['Writing', 'Office Supplies', 'Art Supplies', 'Educational', 'Technology'], {
        errorMap: (issue, _ctx) => {
            return {
                message: 'Category must be one of the predefined values',
            };
        },
    }),
    description: zod_1.z.string().min(1, 'Description is required'),
    quantity: zod_1.z
        .number()
        .int()
        .nonnegative('Quantity must be a non-negative integer')
        .default(0),
    inStock: zod_1.z.boolean().default(true),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.default = ProductValidationSchema;
