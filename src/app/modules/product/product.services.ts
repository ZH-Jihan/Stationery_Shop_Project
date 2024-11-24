import { Product } from './product.interface';
import { ProductModel } from './product.model';

const createProduct = async (product: Product) => {
  // Create new product
  const newProduct = await ProductModel.create(product);
  return newProduct;
};

export const ProductService = {
  createProduct,
};
