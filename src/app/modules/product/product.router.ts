import { Router } from 'express';
import creatProduct from './product.controller';

const routes = Router();

routes.route('/').post(creatProduct).get();

export default routes;
