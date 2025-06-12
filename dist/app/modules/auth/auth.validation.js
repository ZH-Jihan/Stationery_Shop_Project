"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAccessTokenZodSchema = exports.authZodSchema = void 0;
const zod_1 = require("zod");
exports.authZodSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20),
});
exports.genAccessTokenZodSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: 'Refresh token is required!',
    }),
});
