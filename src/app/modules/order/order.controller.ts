import { Request, Response } from 'express';
import ApiResponse from '../../utils/ApiResponse';
import { OrderServices } from './order.services';

const createOrderInDb = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const newOrder = await OrderServices.createOrderDB(data);
    res
      .status(200)
      .json(new ApiResponse(200, newOrder, 'Order created successfully'));
  } catch (error) {
    console.log(error);
  }
};

export const OrderController = {
  createOrderInDb,
};
