import { Request, Response } from 'express';
import ApiResponse from '../../utils/ApiResponse';
import { ProductService } from './product.services';

const creatProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (!product.name || !product.price) {
      res.status(400).json(new ApiResponse(400, null, 'Invalid product data'));
    }
    const createdProduct = await ProductService.createProduct(product);

    res
      .status(200)
      .json(
        new ApiResponse(200, createdProduct, 'Product created successfully'),
      );
  } catch (error) {
    console.log(error);
  }
};

export default creatProduct;
