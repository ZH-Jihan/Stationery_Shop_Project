import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TUserRole } from '../auth/auth.interface';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get(
  '/admin',
  auth('admin' as TUserRole),
  DashboardController.getAdminDashboardStats,
);

router.get(
  '/user',
  auth('user' as TUserRole),
  DashboardController.getUserDashboardStats,
);

export const DashboardRoutes = router;
