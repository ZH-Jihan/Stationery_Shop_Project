import { Request, Response } from 'express';
import ApiError from '../../utils/ApiError';
import { OrderServices } from './order.services';
import { OrderValidationSchema } from './order.validation';

const createOrderInDb = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const validateOrder = OrderValidationSchema.parse(data);
    const newOrder = await OrderServices.createOrderDB(validateOrder);
    res.json(newOrder);
  } catch (error) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

const calculateOrderRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.orderRevenueCalculat();
    res.json(result);
  } catch (error) {
    res
      .status(400)
      .json(new ApiError('Something went wrong', false, error, error?.stack));
  }
};

export const OrderController = {
  createOrderInDb,
  calculateOrderRevenue,
};
