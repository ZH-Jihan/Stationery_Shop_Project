import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import ApiError from '../../utils/ApiError';
import { ProductService } from '../product/product.service';
import { User } from '../user/user.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import { orderUtils } from './order.utils';

const createOrderDB = async (
  data: TOrder,
  id: Types.ObjectId,
  client_ip: string,
) => {
  const { product: productId, quantity, totalPrice } = data;

  const getProduct = await ProductService.getProductById(productId);
  const user = await User.findById(id);
  if (!getProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Produtc not found');
  } else if (getProduct.quantity < quantity) {
    throw new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      'Order quantity is bigger than available quantity',
    );
  } else {
    getProduct.quantity -= quantity;
    if (getProduct.quantity === 0) {
      getProduct.inStock = false;
    }
    await getProduct.save();
    data.user = user?._id!;
    const newOrder = await Order.create(data);

    if (
      user?.phone === 'Unknown' ||
      user?.address === 'Unknown' ||
      user?.city === 'Unknown'
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please update your phone number and address',
      );
    }

    const shurjopayPayload = {
      amount: totalPrice,
      order_id: newOrder._id,
      currency: 'USD',
      customer_name: user?.name,
      customer_email: user?.email,
      customer_city: user!.city,
      customer_phone: user!.phone,
      customer_address: user!.address,
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      const result = await Order.findOneAndUpdate(
        { _id: newOrder._id },
        {
          $set: {
            'transaction.id': payment.sp_order_id,
            'transaction.transactionStatus': payment.transactionStatus,
          },
        },
        { new: true },
      );
    }

    return payment.checkout_url;
  }
};

const verifyPaymentDB = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        payment:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Failed'
              : verifiedPayment[0].bank_status == 'Pending'
                ? 'Pending'
                : verifiedPayment[0].bank_status == 'Cancel'
                  ? 'Cancelled'
                  : 'Pending',
        status: 'Processing',
      },
    );
  }

  return verifiedPayment;
};

const getAllOrders = async () => {
  const data = await Order.find();
  return data;
};

const getUserWonOrders = async (id: Types.ObjectId) => {
  const data = await Order.find({ user: id });
  return data;
};

const orderRevenueCalculat = async () => {
  const calculateOrder = await Order.aggregate([
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
  verifyPaymentDB,
  getAllOrders,
  getUserWonOrders,
};
