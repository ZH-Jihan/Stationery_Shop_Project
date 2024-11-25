import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

router.route('/').get().post(OrderController.createOrderInDb);

export default router;
