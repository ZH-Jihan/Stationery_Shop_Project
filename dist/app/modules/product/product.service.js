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
exports.ProductService = void 0;
const quaryBuilder_1 = __importDefault(require("../../build/quaryBuilder"));
const uploadImgToCloudinary_1 = require("../../middlewares/uploadImgToCloudinary");
const product_model_1 = require("./product.model");
const createProductDB = (file, product) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const fileName = `${product.name}-${product.category}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const { secure_url } = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(path, fileName);
        console.log(secure_url);
        product.image = secure_url;
    }
    const newProduct = yield product_model_1.ProductModel.create(product);
    return newProduct;
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const singleProduct = yield product_model_1.ProductModel.findById(id);
    return singleProduct;
});
const getAllProductDB = (queryParam) => __awaiter(void 0, void 0, void 0, function* () {
    const allProduct = new quaryBuilder_1.default(product_model_1.ProductModel.find(), queryParam)
        .search(['name', 'brand', 'category'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const metaData = yield allProduct.metaData();
    const result = yield allProduct.queryModel;
    return {
        metaData,
        result,
    };
});
const updateOneProductDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updateProduct = yield product_model_1.ProductModel.findByIdAndUpdate({ _id: id }, { $set: data }, { new: true });
    return;
});
const deleteProductByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // This type of delete operation is not recommended for production level applications because data permanently delete from the database.
    // const deleteProduct = await ProductModel.findByIdAndDelete({ _id: id });
    // Best pactries to delete the data from the database
    const deleteProduct2 = yield product_model_1.ProductModel.findByIdAndUpdate({ _id: id }, { isDeleted: true });
    return deleteProduct2;
});
exports.ProductService = {
    createProductDB,
    getAllProductDB,
    updateOneProductDB,
    getProductById,
    deleteProductByIdDB,
};
