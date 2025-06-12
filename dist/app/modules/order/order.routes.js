"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = (0, express_1.Router)();
router
    .route('/')
    .get((0, auth_1.default)('admin'), order_controller_1.OrderController.geAllOrders)
    .post((0, auth_1.default)('user'), (0, validateRequestData_1.default)(order_validation_1.OrderValidationSchema), order_controller_1.OrderController.createOrderInDb);
router
    .route('/payment_verify')
    .get((0, auth_1.default)('user'), order_controller_1.OrderController.verifyPayment);
router.route('/won_order').get((0, auth_1.default)('user'), order_controller_1.OrderController.getUserWonOrder);
router.route('/revenue').get(order_controller_1.OrderController.calculateOrderRevenue);
exports.OrderRoutes = router;
