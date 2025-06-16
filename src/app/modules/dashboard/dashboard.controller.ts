import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { DashboardServices } from './dashboard.service';

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await DashboardServices.getAdminDashboardStats();
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Admin dashboard stats fetched successfully',
    data: stats,
  });
});

const getUserDashboardStats = asyncHandler(async (req, res) => {
  const stats = await DashboardServices.getUserDashboardStats(req.user._id);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User dashboard stats fetched successfully',
    data: stats,
  });
});

export const DashboardController = {
  getAdminDashboardStats,
  getUserDashboardStats,
};
