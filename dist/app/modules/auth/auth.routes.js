"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.route('/login').post((0, validateRequestData_1.default)(auth_validation_1.authZodSchema), auth_controller_1.loginUser);
router.route('/create-accessToken').post(auth_controller_1.genAccessToken);
exports.AuthRoutes = router;
