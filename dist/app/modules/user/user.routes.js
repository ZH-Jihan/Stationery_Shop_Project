"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router
    .route('/register')
    .post((0, validateRequestData_1.default)(user_validation_1.userZodSchema), user_controller_1.registerUser);
router
    .route('/profile/:profileEmail')
    .patch((0, auth_1.default)('admin', 'user'), user_controller_1.updateUserWonProfile);
exports.UserRoutes = router;
