import QueryBuilder from '../../build/quaryBuilder';
import { uploadImgToCloudinary } from '../../middlewares/uploadImgToCloudinary';
import { Product } from './product.interface';
import { ProductModel } from './product.model';

const createProductDB = async (
  files: Express.Multer.File[],
  product: Product,
) => {
  console.log(product);
  const uploadedImages: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const fileName = `${product.name}-${product.category}-${Date.now()}`;
      const path = file.path;
      const { secure_url } = await uploadImgToCloudinary(path, fileName);
      uploadedImages.push(secure_url as string);
    }
  }

  product.image = uploadedImages;
  const newProduct = await ProductModel.create(product);
  return newProduct;
};

const getAllProductDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(['name', 'brand', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.queryModel;
  const metaData = await productQuery.metaData();

  return {
    metaData,
    result,
  };
};

const getProductById = async (id: string) => {
  const result = await ProductModel.findById(id);
  return result;
};

const updateOneProductDB = async (
  id: string,
  files: Express.Multer.File[],
  data: Partial<Product>,
) => {
  const uploadedImages: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const fileName = `${data.name || 'product'}-${data.category || 'category'}-${Date.now()}`;
      const path = file.path;
      const { secure_url } = await uploadImgToCloudinary(path, fileName);
      uploadedImages.push(secure_url as string);
    }
  }

  // If there are existing images in the update data, add them to the array
  if (data.image && data.image.length > 0) {
    uploadedImages.push(...data.image);
  }

  if (uploadedImages.length > 0) {
    data.image = uploadedImages;
  }

  const updateProduct = await ProductModel.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true },
  );
  return updateProduct;
};

const deleteProductByIdDB = async (id: string) => {
  const result = await ProductModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ProductService = {
  createProductDB,
  getAllProductDB,
  getProductById,
  updateOneProductDB,
  deleteProductByIdDB,
};
