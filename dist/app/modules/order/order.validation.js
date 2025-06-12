"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationSchema = void 0;
const zod_1 = require("zod");
exports.OrderValidationSchema = zod_1.z.object({
    product: zod_1.z.string().min(1),
    quantity: zod_1.z.number().int().positive(),
    totalPrice: zod_1.z.number().positive(),
});
