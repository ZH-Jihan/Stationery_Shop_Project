import { Request, Response } from 'express';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import { ProductService } from './product.services';
import ProductValidationSchema from './product.validation';

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const validateProduct = ProductValidationSchema.parse(product);

    const createdProduct =
      await ProductService.createProductDB(validateProduct);

    res
      .status(200)
      .json(
        new ApiResponse(200, createdProduct, 'Product created successfully'),
      );
  } catch (error: any) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    let result;
    if (searchTerm) {
      result = await ProductService.getProductBySearchTerm(
        searchTerm as string,
      );
    } else {
      result = await ProductService.getAllProductDB();
    }
    res
      .status(200)
      .json(new ApiResponse(200, result, 'Product retrieved successfully'));
  } catch (error: any) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId: id } = req.params;
    const singleProduct = await ProductService.getProductById(id);
    if (!singleProduct) {
      res
        .status(404)
        .json(new ApiResponse(404, singleProduct, 'Product Not Found'));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, singleProduct, 'Product retrieved successfully'),
      );
  } catch (error: any) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  const data = req.body;
  try {
    const product = await ProductService.updateOneProductDB(id, data);
    res
      .status(200)
      .json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error: any) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  try {
    const deleted = await ProductService.deleteProductByIdDB(id);
    res.json(deleted);
  } catch (error: any) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
