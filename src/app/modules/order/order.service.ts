import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { ProductService } from '../product/product.service';
import { Order } from './order.interface';
import { OrderModel } from './order.model';

const createOrderDB = async (data: Order) => {
  const { email, product: productId, quantity, totalPrice } = data;
  const getProduct = await ProductService.getProductById(productId);
  if (!getProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Produtc not found');
  } else if (getProduct.quantity < quantity) {
    return new ApiError(
      StatusCodes.SERVICE_UNAVAILABLE,
      'Product quantity is Unavailable',
    );
  } else {
    getProduct.quantity -= quantity;
    if (getProduct.quantity === 0) {
      getProduct.inStock = false;
    }
    await getProduct.save();

    const newOrder = await OrderModel.create(data);
    return newOrder;
  }
};

const orderRevenueCalculat = async () => {
  const calculateOrder = await OrderModel.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    {
      $unwind: '$productInfo',
    },
    {
      $addFields: {
        revenue: {
          $multiply: ['$productInfo.price', '$quantity'],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return calculateOrder;
};

export const OrderServices = {
  createOrderDB,
  orderRevenueCalculat,
};
