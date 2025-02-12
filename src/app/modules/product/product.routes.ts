import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequestData from '../../middlewares/validateRequestData';
import { ProductController } from './product.controller';
import ProductValidationSchema from './product.validation';

const routes = Router();

routes
  .route('/')
  .post(
    auth('user'),
    validateRequestData(ProductValidationSchema),
    ProductController.createProduct,
  )
  .get(auth('user', 'admin'), ProductController.getAllProduct);

routes
  .route('/:productId')
  .get(ProductController.getSingleProduct)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export const ProductRouters = routes;
