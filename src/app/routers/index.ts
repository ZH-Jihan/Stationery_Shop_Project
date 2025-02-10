import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { ProductRouters } from '../modules/product/product.routes';
import { UserRoutes } from '../modules/user/user.routes';

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
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

allRoutersModel.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
