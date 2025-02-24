import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequestData from '../../middlewares/validateRequestData';
import { registerUser, updateUserWonProfile } from './user.controller';
import { userZodSchema } from './user.validation';

const router = Router();

router
  .route('/register')
  .post(validateRequestData(userZodSchema), registerUser);

router
  .route('/profile/:profileEmail')
  .patch(auth('admin', 'user'), updateUserWonProfile);

export const UserRoutes = router;
