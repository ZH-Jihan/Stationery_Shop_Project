import { Router } from 'express';
import { ProductController } from './product.controller';

const routes = Router();

routes
  .route('/')
  .post(ProductController.createProduct)
  .get(ProductController.getAllProduct);

routes
  .route('/:productId')
  .get(ProductController.getSingleProduct)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export const ProductRouters = routes;
