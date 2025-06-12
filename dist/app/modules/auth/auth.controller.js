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
exports.loginUser = exports.genAccessToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUserIntoDB(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User logged in successfully',
        data: { accessToken },
    });
}));
exports.loginUser = loginUser;
const genAccessToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, 'Refresh token is required');
    }
    const result = yield auth_service_1.AuthServices.genAccessTokenWithRefreshToken(refreshToken);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Access token was created successfully',
        data: result,
    });
}));
exports.genAccessToken = genAccessToken;
