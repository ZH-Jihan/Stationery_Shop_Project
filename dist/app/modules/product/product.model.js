"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: {
        type: String,
        enum: [
            'Writing',
            'Office Supplies',
            'Art Supplies',
            'Educational',
            'Technology',
        ],
        required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    inStock: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});
productSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
productSchema.pre('findOne', function (next) {
    this.findOne({ isDeleted: { $ne: true } });
    next();
});
productSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
