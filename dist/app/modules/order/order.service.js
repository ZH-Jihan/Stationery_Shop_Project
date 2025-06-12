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
exports.OrderServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const product_service_1 = require("../product/product.service");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const order_utils_1 = require("./order.utils");
const createOrderDB = (data, id, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    const { product: productId, quantity, totalPrice } = data;
    const getProduct = yield product_service_1.ProductService.getProductById(productId);
    const user = yield user_model_1.User.findById(id);
    if (!getProduct) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Produtc not found');
    }
    else if (getProduct.quantity < quantity) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, 'Order quantity is bigger than available quantity');
    }
    else {
        getProduct.quantity -= quantity;
        if (getProduct.quantity === 0) {
            getProduct.inStock = false;
        }
        yield getProduct.save();
        data.user = user === null || user === void 0 ? void 0 : user._id;
        const newOrder = yield order_model_1.Order.create(data);
        if ((user === null || user === void 0 ? void 0 : user.phone) === 'Unknown' ||
            (user === null || user === void 0 ? void 0 : user.address) === 'Unknown' ||
            (user === null || user === void 0 ? void 0 : user.city) === 'Unknown') {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please update your phone number and address');
        }
        const shurjopayPayload = {
            amount: totalPrice,
            order_id: newOrder._id,
            currency: 'USD',
            customer_name: user === null || user === void 0 ? void 0 : user.name,
            customer_email: user === null || user === void 0 ? void 0 : user.email,
            customer_city: user.city,
            customer_phone: user.phone,
            customer_address: user.address,
            client_ip,
        };
        const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
        if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
            const result = yield order_model_1.Order.findOneAndUpdate({ _id: newOrder._id }, {
                $set: {
                    'transaction.id': payment.sp_order_id,
                    'transaction.transactionStatus': payment.transactionStatus,
                },
            }, { new: true });
        }
        return payment.checkout_url;
    }
});
const verifyPaymentDB = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.Order.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            payment: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Failed'
                    : verifiedPayment[0].bank_status == 'Pending'
                        ? 'Pending'
                        : verifiedPayment[0].bank_status == 'Cancel'
                            ? 'Cancelled'
                            : 'Pending',
            status: 'Processing',
        });
    }
    return verifiedPayment;
});
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield order_model_1.Order.find();
    return data;
});
const getUserWonOrders = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield order_model_1.Order.find({ user: id })
        .populate('user')
        .populate('product');
    return data;
});
const orderRevenueCalculat = () => __awaiter(void 0, void 0, void 0, function* () {
    const calculateOrder = yield order_model_1.Order.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productInfo',
            },
        },
        {
            $unwind: '$productInfo',
        },
        {
            $addFields: {
                revenue: {
                    $multiply: ['$productInfo.price', '$quantity'],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$revenue' },
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
    ]);
    return calculateOrder;
});
exports.OrderServices = {
    createOrderDB,
    orderRevenueCalculat,
    verifyPaymentDB,
    getAllOrders,
    getUserWonOrders,
};
