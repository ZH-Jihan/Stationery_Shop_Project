import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { OrderServices } from './order.service';
import { OrderValidationSchema } from './order.validation';

const createOrderInDb = asyncHandler(async (req, res) => {
  const data = req.body;
  const validateOrder = OrderValidationSchema.parse(data);
  const newOrder = await OrderServices.createOrderDB(validateOrder);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: newOrder,
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
};
