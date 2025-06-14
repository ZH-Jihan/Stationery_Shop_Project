import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequestData from '../../middlewares/validateRequestData';
import {
  getUserProfile,
  registerUser,
  updateUserWonProfile,
} from './user.controller';
import { userZodSchema } from './user.validation';

const router = Router();

router
  .route('/register')
  .post(validateRequestData(userZodSchema), registerUser);

router
  .route('/profile/:profileEmail')
  .patch(auth('admin', 'user'), updateUserWonProfile);

router.route('/profile').get(auth('user', 'admin'), getUserProfile);

export const UserRoutes = router;
