import { model, Schema } from 'mongoose';
import { Product } from './product.interface';

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
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
});

// productSchema.pre('find', function (req, res) {
//   this.find({isStock: {$ne : false}})
// })

export const ProductModel = model<Product>('Product', productSchema);
