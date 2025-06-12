"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const uploadImgToCloudinary_1 = require("../../middlewares/uploadImgToCloudinary");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = __importDefault(require("./product.validation"));
const routes = (0, express_1.Router)();
routes
    .route('/')
    .post((0, auth_1.default)('admin'), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, validateRequestData_1.default)(product_validation_1.default), product_controller_1.ProductController.createProduct)
    .get(product_controller_1.ProductController.getAllProduct);
routes
    .route('/:productId')
    .get(product_controller_1.ProductController.getSingleProduct)
    .put((0, auth_1.default)('admin'), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    console.log(req.body);
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, product_controller_1.ProductController.updateProduct)
    .delete(product_controller_1.ProductController.deleteProduct);
exports.ProductRouters = routes;
