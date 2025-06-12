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
exports.updateUserWonProfile = exports.registerUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const user_service_1 = require("./user.service");
const registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.registerNewUserIntoDb(req.body);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
        message: 'User registration successfully',
    });
}));
exports.registerUser = registerUser;
const updateUserWonProfile = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { profileEmail } = req.params;
    const result = yield user_service_1.UserServices.updateUserWonProfileInDb(email, profileEmail, req.body);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
        message: 'User won profile updated successfully',
    });
}));
exports.updateUserWonProfile = updateUserWonProfile;
