import QueryBuilder from '../../build/quaryBuilder';
import { uploadImgToCloudinary } from '../../middlewares/uploadImgToCloudinary';
import { Product } from './product.interface';
import { ProductModel } from './product.model';

const createProductDB = async (file: any, product: Product) => {
  if (file) {
    const fileName = `${product.name}-${product.category}`;
    const path = file?.path;

    const { secure_url } = await uploadImgToCloudinary(path, fileName);
    console.log(secure_url);
  }
  // const newProduct = await ProductModel.create(product);
  // return newProduct;
};

const getProductById = async (id: string) => {
  const singleProduct = await ProductModel.findById(id);
  return singleProduct;
};

const getAllProductDB = async (queryParam: Record<string, unknown>) => {
  const allProduct = new QueryBuilder(ProductModel.find(), queryParam)
    .search(['name', 'brand', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields();
  const metaData = await allProduct.metaData();
  const result = await allProduct.queryModel;

  return {
    metaData,
    result,
  };
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
  return deleteProduct2;
};

export const ProductService = {
  createProductDB,
  getAllProductDB,
  updateOneProductDB,
  getProductById,
  deleteProductByIdDB,
};
