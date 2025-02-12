import { Router } from 'express';
import validateRequestData from '../../middlewares/validateRequestData';
import { genAccessToken, loginUser } from './auth.controller';
import { authZodSchema } from './auth.validation';

const router = Router();

router.route('/login').post(validateRequestData(authZodSchema), loginUser);

router.route('/create-accessToken').post(genAccessToken);

export const AuthRoutes = router;
