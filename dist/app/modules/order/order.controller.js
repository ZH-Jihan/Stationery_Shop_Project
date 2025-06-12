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
exports.OrderController = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const order_service_1 = require("./order.service");
const createOrderInDb = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { _id: id } = req.user;
    const newOrder = yield order_service_1.OrderServices.createOrderDB(data, id, req.ip);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Order created successfully',
        data: newOrder,
    });
}));
// get all orders for the specified user and admin
const geAllOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_service_1.OrderServices.getAllOrders();
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All Orders fetched successfully',
        data: orders,
    });
}));
// get user won order
const getUserWonOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: id } = req.user;
    const orders = yield order_service_1.OrderServices.getUserWonOrders(id);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User orders fetched successfully',
        data: orders,
    });
}));
const verifyPayment = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.OrderServices.verifyPaymentDB(req.query.order_id);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User orders fetched successfully',
        data: order,
    });
}));
const calculateOrderRevenue = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.orderRevenueCalculat();
    if (Array.isArray(result) && result.length === 1) {
        (0, ApiResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Order revenue calculated successfully',
            data: result[0],
        });
    }
    else {
        res.json(new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Do not have any data to calculated revenue'));
    }
}));
exports.OrderController = {
    createOrderInDb,
    calculateOrderRevenue,
    geAllOrders,
    verifyPayment,
    getUserWonOrder,
};
