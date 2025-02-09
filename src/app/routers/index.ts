import { Router } from 'express';
import { OrderRoutes } from '../modules/order/order.routes';
import { ProductRouters } from '../modules/product/product.routes';

const router = Router();

const allRoutersModel = [
  {
    path: '/products',
    route: ProductRouters,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

allRoutersModel.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
