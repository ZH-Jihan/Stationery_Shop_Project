import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { OrderServices } from './order.service';

const createOrderInDb = asyncHandler(async (req, res) => {
  const data = req.body;
  const { _id: id } = req.user;
  const newOrder = await OrderServices.createOrderDB(data, id, req.ip!);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: newOrder,
  });
});

// get all orders for the specified user and admin
const geAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderServices.getAllOrders();
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'All Orders fetched successfully',
    data: orders,
  });
});

// get user won order
const getUserWonOrder = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  const orders = await OrderServices.getUserWonOrders(id);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User orders fetched successfully',
    data: orders,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const order = await OrderServices.verifyPaymentDB(
    req.query.order_id as string,
  );

  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User orders fetched successfully',
    data: order,
  });
});

const calculateOrderRevenue = asyncHandler(async (req, res) => {
  const result = await OrderServices.orderRevenueCalculat();
  if (Array.isArray(result) && result.length === 1) {
    ApiResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Order revenue calculated successfully',
      data: result[0],
    });
  } else {
    res.json(
      new ApiError(
        StatusCodes.NOT_FOUND,
        'Do not have any data to calculated revenue',
      ),
    );
  }
});

export const OrderController = {
  createOrderInDb,
  calculateOrderRevenue,
  geAllOrders,
  verifyPayment,
  getUserWonOrder,
};
