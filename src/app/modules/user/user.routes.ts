import { Router } from 'express';
import validateRequestData from '../../middlewares/validateRequestData';
import { registerUser } from './user.controller';
import { userZodSchema } from './user.validation';

const router = Router();

router
  .route('/register')
  .post(validateRequestData(userZodSchema), registerUser);

export const UserRoutes = router;
