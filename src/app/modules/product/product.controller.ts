import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { ProductService } from './product.services';
import ProductValidationSchema from './product.validation';

const createProduct = asyncHandler(async (req, res) => {
  const product = req.body;
  const validateProduct = ProductValidationSchema.parse(product);

  const createdProduct = await ProductService.createProductDB(validateProduct);

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: createdProduct,
    message: 'Product created successfully',
  });
});

const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  let result;
  if (searchTerm) {
    result = await ProductService.getProductBySearchTerm(searchTerm as string);
  } else {
    result = await ProductService.getAllProductDB();
  }

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: result,
    message: 'Products retrieved successfully',
  });
});

const getSingleProduct = async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  const singleProduct = await ProductService.getProductById(id);
  if (!singleProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: singleProduct,
    message: 'Product retrieved successfully',
  });
};

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  const data = req.body;
  const product = await ProductService.updateOneProductDB(id, data);

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: product,
    message: 'Product updated successfully',
  });
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  const deleted = await ProductService.deleteProductByIdDB(id);
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: {},
    message: 'Product deleted successfully',
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
