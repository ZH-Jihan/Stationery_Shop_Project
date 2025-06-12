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
exports.ProductController = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const ApiResponse_1 = __importDefault(require("../../utils/ApiResponse"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const product_service_1 = require("./product.service");
const createProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdProduct = yield product_service_1.ProductService.createProductDB(req.file, req.body);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: createdProduct,
        message: 'Product created successfully',
    });
}));
const getAllProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getAllProductDB(req.query);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        meta: result.metaData,
        data: result.result,
        message: 'Products retrieved successfully',
    });
}));
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const singleProduct = yield product_service_1.ProductService.getProductById(productId);
    if (!singleProduct) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: singleProduct,
        message: 'Product retrieved successfully',
    });
});
const updateProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId: id } = req.params;
    const data = req.body;
    const product = yield product_service_1.ProductService.updateOneProductDB(id, data);
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: product,
        message: 'Product updated successfully',
    });
}));
const deleteProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId: id } = req.params;
    const deleted = yield product_service_1.ProductService.deleteProductByIdDB(id);
    if (!deleted) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    return (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: {},
        message: 'Product deleted successfully',
    });
}));
exports.ProductController = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
