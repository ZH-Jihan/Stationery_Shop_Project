import { model, Schema } from 'mongoose';
import { Product } from './product.interface';

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true},
    category: {
      type: String,
      enum: [
        'Electronics',
        'Fashion',
        'Home & Living',
        'Beauty',
        'Sports & Outdoors',
        "Books & Media",
        "Toys & Games",
        "Health & Wellness",
        "Automotive",
        "Pet Supplies",
        "Other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    inStock: { type: Boolean, required: true, default: true },
    discountPercentage: { type: Number, required: true, default: 0 },
    flashSale: { type: Boolean, required: true, default: false },
    flashSalePrice: { type: Number, required: true, default: 0 },
    flashSaleEndTime: { type: Date, required: true, default: Date.now() },
    isFeatured: { type: Boolean, required: true, default: false },
    isNew: { type: Boolean, required: true, default: false },
    keyFeatures: { type: [String], required: true },
    specifications: { type: [String], required: true },
    warranty: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

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

export const ProductModel = model<Product>('Product', productSchema);
