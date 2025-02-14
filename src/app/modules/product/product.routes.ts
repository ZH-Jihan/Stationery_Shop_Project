import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/uploadImgToCloudinary';
import validateRequestData from '../../middlewares/validateRequestData';
import { ProductController } from './product.controller';
import ProductValidationSchema from './product.validation';

const routes = Router();

routes
  .route('/')
  .post(
    auth('admin'),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body?.data);
      next();
    },
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
