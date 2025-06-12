import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { ProductService } from './product.service';

const createProduct = asyncHandler(async (req, res) => {
  const createdProduct = await ProductService.createProductDB(
    req.file,
    req.body,
  );

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    data: createdProduct,
    message: 'Product created successfully',
  });
});

const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProductDB(req.query);

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    meta: result.metaData,
    data: result.result,
    message: 'Products retrieved successfully',
  });
});

const getSingleProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const singleProduct = await ProductService.getProductById(productId);
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
