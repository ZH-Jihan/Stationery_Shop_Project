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
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const user_model_1 = require("./user.model");
const registerNewUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `User ${user.email} already exists`);
    }
    const newUser = yield user_model_1.User.create(payload);
    return newUser;
});
const updateUserWonProfileInDb = (email, profileEmail, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(email);
    if (user.email !== profileEmail) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `You are not allowed to update this profile`);
    }
    const updated = yield user_model_1.User.findOneAndUpdate({ email }, payload, {
        new: true,
    });
    return updated;
});
exports.UserServices = {
    registerNewUserIntoDb,
    updateUserWonProfileInDb,
};
