import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

router.route('/').get().post(OrderController.createOrderInDb);

router.route('/revenue').get(OrderController.calculateOrderRevenue);
export const OrderRoutes = router;
