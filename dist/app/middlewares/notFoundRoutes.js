"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFoundRoute = (req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
        message: 'Api not found or invalid',
    });
};
exports.default = notFoundRoute;
