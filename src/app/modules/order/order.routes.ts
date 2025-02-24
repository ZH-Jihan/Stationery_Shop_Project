import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequestData from '../../middlewares/validateRequestData';
import { OrderController } from './order.controller';
import { OrderValidationSchema } from './order.validation';

const router = Router();

router
  .route('/')
  .get(auth('admin'), OrderController.geAllOrders)
  .post(
    auth('user'),
    validateRequestData(OrderValidationSchema),
    OrderController.createOrderInDb,
  );
router
  .route('/payment_verify')
  .get(auth('user'), OrderController.verifyPayment);

router.route('/won_order').get(auth('user'), OrderController.getUserWonOrder);

router.route('/revenue').get(OrderController.calculateOrderRevenue);
export const OrderRoutes = router;
