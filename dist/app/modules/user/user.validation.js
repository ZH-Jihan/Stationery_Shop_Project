"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodSchema = void 0;
const zod_1 = require("zod");
exports.userZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name is required' }),
    email: zod_1.z.string().email({ message: 'Invalid email address' }),
    password: zod_1.z.string(),
    // .min(6, { message: 'Password must be at least 6 characters long' })
    // .regex(/[A-Z]/, {
    //   message: 'Password must contain at least one uppercase letter',
    // })
    // .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});
