import { Request, Response } from 'express';
import ApiResponse from '../../utils/ApiResponse';
import { ProductService } from './product.services';

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (!product.name || !product.price) {
      res.status(400).json(new ApiResponse(400, null, 'Invalid product data'));
    }
    const createdProduct = await ProductService.createProductDB(product);

    res
      .status(200)
      .json(
        new ApiResponse(200, createdProduct, 'Product created successfully'),
      );
  } catch (error) {
    console.log(error);
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;

  try {
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
  } catch (error) {
    console.log(error);
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  try {
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { productId: id } = req.params;
  try {
    const deleted = await ProductService.deleteProductByIdDB(id);
    res
      .status(200)
      .json(new ApiResponse(200, deleted, 'Product deleted successfully'));
  } catch (error) {
    console.log(error);
  }
};

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
