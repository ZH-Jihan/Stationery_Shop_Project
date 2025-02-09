import { Router } from 'express';
import validateRequestData from '../../middlewares/validateRequestData';
import { ProductController } from './product.controller';
import ProductValidationSchema from './product.validation';

const routes = Router();

routes
  .route('/')
  .post(
    validateRequestData(ProductValidationSchema),
    ProductController.createProduct,
  )
  .get(ProductController.getAllProduct);

routes
  .route('/:productId')
  .get(ProductController.getSingleProduct)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export const ProductRouters = routes;
