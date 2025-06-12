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
exports.AuthServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    // Check user all types of conditions for login
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.status === 'block') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User has been blocked');
    }
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User has been deleted');
    }
    const isMatch = yield user_model_1.User.matchPassword(payload.password, user.password);
    if (!isMatch) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    // If all conditions are met, then create token
    const accessToken = yield (0, auth_utils_1.generateToken)(user.email, config_1.default.access_token_secret, config_1.default.access_token_expire);
    const refreshToken = yield (0, auth_utils_1.generateToken)(user.email, config_1.default.refresh_token_secret, config_1.default.refresh_token_expire);
    return {
        accessToken,
        refreshToken,
    };
});
const genAccessTokenWithRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.refresh_token_secret);
    if (!decoded) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
    }
    const { exp, email } = decoded;
    const user = yield user_model_1.User.isUserExist(email);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.status === 'block') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User has been blocked');
    }
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User has been deleted');
    }
    const accessToken = yield (0, auth_utils_1.generateToken)(email, config_1.default.access_token_secret, config_1.default.access_token_expire);
    return { accessToken };
});
exports.AuthServices = {
    loginUserIntoDB,
    genAccessTokenWithRefreshToken,
};
