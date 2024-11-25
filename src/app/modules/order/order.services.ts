import ApiResponse from '../../utils/ApiResponse';
import { ProductService } from '../product/product.services';
import { Order } from './order.interface';
import { OrderModel } from './order.model';

const createOrderDB = async (data: Order) => {
  const { email, product: productId, quantity, totalPrice } = data;
  const getProduct = await ProductService.getProductById(productId);
  if (!getProduct) {
    return new ApiResponse(404, {}, 'Could not find product', false);
  } else if (getProduct.quantity < quantity) {
    return new ApiResponse(404, {}, 'Stock not available', false);
  } else {
    getProduct.quantity -= quantity;
    if (getProduct.quantity === 0) {
      getProduct.inStock = false;
    }
    await getProduct.save();

    const newOrder = await OrderModel.create(data);
    return new ApiResponse(200, newOrder, 'Order created successfully');
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
  console.log(calculateOrder);

  if (Array.isArray(calculateOrder) && calculateOrder.length === 1) {
    return new ApiResponse(
      200,
      calculateOrder,
      'Revenue calculated successfully',
    );
  } else {
    return new ApiResponse(
      404,
      {},
      'Do not have any data to calculated revenue',
      false,
    );
  }
};

export const OrderServices = {
  createOrderDB,
  orderRevenueCalculat,
};
