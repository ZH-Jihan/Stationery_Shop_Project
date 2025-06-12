"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const auth_utils_1 = require("../modules/auth/auth.utils");
const user_model_1 = require("../modules/user/user.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const auth = (...roles) => {
    return (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const token = ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer '))
            ? req.headers.authorization.replace('Bearer ', '').trim()
            : null;
        if (!token) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid token');
        }
        const { exp, iat, email, role } = (0, auth_utils_1.verifyToken)(token, config_1.default.access_token_secret);
        // Check token is expired or not
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > exp) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Your Session has expired please login again');
        }
        const user = yield user_model_1.User.isUserExist(email);
        // Check the user is exist or not in database
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User doesn't exist");
        }
        // Check if user is blocked
        if (user.status === 'block') {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
        }
        // Check user role is valid or not to access the route
        if (roles.length && !roles.includes(role)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not allowed to access this route');
        }
        req.user = user;
        next();
    }));
};
exports.default = auth;
