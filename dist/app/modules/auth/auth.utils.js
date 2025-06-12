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
exports.verifyToken = exports.generateToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const user_model_1 = require("../user/user.model");
const generateToken = (email, secret, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
    };
    return jsonwebtoken_1.default.sign(jwtPayload, secret, {
        expiresIn: "10d",
    });
});
exports.generateToken = generateToken;
const verifyToken = (token, tokenSecret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
        return decoded;
    }
    catch (err) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, ' Token not valid');
    }
};
exports.verifyToken = verifyToken;
