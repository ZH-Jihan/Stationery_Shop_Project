"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success || true,
        statusCode: data.statusCode,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};
exports.default = ApiResponse;
