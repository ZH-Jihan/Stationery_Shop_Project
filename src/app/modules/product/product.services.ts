import { Product } from './product.interface';
import { ProductModel } from './product.model';

const createProductDB = async (product: Product) => {
  const newProduct = await ProductModel.create(product);
  return newProduct;
};

const getProductBySearchTerm = async (queryParam: string) => {
  const searchQuery = {
    $or: [
      { name: queryParam },
      { brand: queryParam },
      { category: queryParam },
    ],
  };
  try {
    const searchingProduct = await ProductModel.find(searchQuery);
    return searchingProduct;
  } catch (error) {
    console.log(error);
  }
};

const getProductById = async (id: string) => {
  const singleProduct = await ProductModel.findById(id);
  return singleProduct;
};

const getAllProductDB = async () => {
  const allProduct = await ProductModel.find();
  return allProduct;
};

const updateOneProductDB = async (id: string, data: object) => {
  const updateProduct = await ProductModel.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true },
  );
  return updateProduct;
};

const deleteProductByIdDB = async (id: string) => {
  // This type of delete operation is not recommended for production level applications because data permanently delete from the database.
  // const deleteProduct = await ProductModel.findByIdAndDelete({ _id: id });

  // Best pactries to delete the data from the database
  const deleteProduct2 = await ProductModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
  );
  return {};
};

export const ProductService = {
  createProductDB,
  getAllProductDB,
  getProductBySearchTerm,
  updateOneProductDB,
  getProductById,
  deleteProductByIdDB,
};
