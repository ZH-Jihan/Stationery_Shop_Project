"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const zodError_1 = __importDefault(require("../errors/zodError"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const globalErrorHandler = (error, req, res, next) => {
    // console.log(error);
    let statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    let message = 'Something went wrong';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (error instanceof zod_1.ZodError) {
        const errorReponse = (0, zodError_1.default)(error);
        statusCode = errorReponse === null || errorReponse === void 0 ? void 0 : errorReponse.statusCode;
        message = errorReponse === null || errorReponse === void 0 ? void 0 : errorReponse.message;
        errorSources = errorReponse === null || errorReponse === void 0 ? void 0 : errorReponse.errorSource;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
        errorSources = [
            {
                path: 'Read Error Messages',
                message: error === null || error === void 0 ? void 0 : error.message,
            },
        ];
    }
    else if (error instanceof Error) {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        message = error === null || error === void 0 ? void 0 : error.message;
        errorSources = [
            {
                path: 'Read Error Messages',
                message: error === null || error === void 0 ? void 0 : error.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorSources,
        stack: error.stack,
    });
};
exports.default = globalErrorHandler;
