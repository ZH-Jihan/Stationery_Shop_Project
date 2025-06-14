import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';
import { OrderServices } from './order.service';

const createOrderInDb = asyncHandler(async (req, res) => {
  const { paymentMethod, ...data } = req.body;
  const newOrder = await OrderServices.createOrderDB(
    data,
    paymentMethod,
    req.user,
    req.ip!,
  );
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Order created successfully',
    data: newOrder,
  });
});

// get all orders for the specified user and admin
const geAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderServices.getAllProducts();
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'All Orders fetched successfully',
    data: orders,
  });
});

// get user won order
const getUserWonOrder = asyncHandler(async (req, res) => {
  const { _id: id } = req.user;
  const orders = await OrderServices.getOrdersDB(id);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User orders fetched successfully',
    data: orders,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { transId } = req.params;
  const order = await OrderServices.verifyPaymentDB(transId);

  if (order) {
    res.redirect(`http://localhost:3000/payment/success?tran_id=${transId}`);
  }
});

const verifyByID = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { transId } = req.params;
  const result = await OrderServices.getOrderByIdDB(transId, _id);
  return ApiResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User orders verify successfully',
    data: result,
  });
});

// const calculateOrderRevenue = asyncHandler(async (req, res) => {
//   const result = await OrderServices.orderRevenueCalculat();
//   if (Array.isArray(result) && result.length === 1) {
//     ApiResponse(res, {
//       statusCode: StatusCodes.OK,
//       message: 'Order revenue calculated successfully',
//       data: result[0],
//     });
//   } else {
//     res.json(
//       new ApiError(
//         StatusCodes.NOT_FOUND,
//         'Do not have any data to calculated revenue',
//       ),
//     );
//   }
// });

export const OrderController = {
  createOrderInDb,
  // calculateOrderRevenue,
  geAllOrders,
  verifyPayment,
  getUserWonOrder,
  verifyByID,
};
