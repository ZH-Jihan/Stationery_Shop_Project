import { Order } from './order.interface';
import { OrderModel } from './order.model';

const createOrderDB = async (data: Order) => {
  const newOrder = await OrderModel.create(data);
  return newOrder;
};

export const OrderServices = {
  createOrderDB,
};
