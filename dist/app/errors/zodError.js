"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const zodErrorHandler = (error) => {
    const errorSources = error.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    const statusCode = http_status_codes_1.StatusCodes.NOT_ACCEPTABLE;
    return {
        message: 'Validation Error. Request not accepted',
        statusCode,
        errorSource: errorSources,
    };
};
exports.default = zodErrorHandler;
