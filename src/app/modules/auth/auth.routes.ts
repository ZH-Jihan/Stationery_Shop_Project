import { Router } from 'express';
import validateRequestData from '../../middlewares/validateRequestData';
import { loginUser } from './auth.controller';
import { authZodSchema } from './auth.validation';

const router = Router();

router.route('/login').post(validateRequestData(authZodSchema), loginUser);

export const AuthRoutes = router;
