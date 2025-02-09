import { Router } from 'express';
import validateRequestData from '../../middlewares/validateRequestData';
import { OrderController } from './order.controller';
import { OrderValidationSchema } from './order.validation';

const router = Router();

router
  .route('/')
  .get()
  .post(
    validateRequestData(OrderValidationSchema),
    OrderController.createOrderInDb,
  );

router.route('/revenue').get(OrderController.calculateOrderRevenue);
export const OrderRoutes = router;
