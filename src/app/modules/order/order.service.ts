import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import ApiError from '../../utils/ApiError';
import { ProductService } from '../product/product.service';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const store_id = config.sslcommerz_store_id;
const store_passwd = config.sslcommerz_api_key;
const is_live = false;

// Helper function to check product availability and update quantities
const checkAndUpdateProductQuantities = async (items: TOrder['items']) => {
  for (const item of items) {
    const product = await ProductService.getProductById(
      item.product.toString(),
    );
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }
    if (product.quantity < item.quantity) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Insufficient quantity for ${product.name}`,
      );
    }
    // Update product quantity
    product.quantity -= item.quantity;
    if (product.quantity === 0) {
      product.inStock = false;
    }
    await product.save();
  }
};

// Helper function to create order data
const createOrderData = (
  data: TOrder,
  paymentMethod: 'cod' | 'sslcommerz',
  user: JwtPayload,
) => {
  return {
    ...data,
    user: user._id,
    payment: {
      status: 'pending',
      method: paymentMethod,
      transaction: {
        id: new ObjectId().toHexString(),
        method: paymentMethod,
        amount: data.totalPrice,
        currency: 'BDT',
        status: 'pending',
        paidAt: null,
      },
    },
  };
};

// Handle Cash on Delivery order
const handleCODOrder = async (data: TOrder, user: JwtPayload) => {
  // Check product availability and update quantities
  await checkAndUpdateProductQuantities(data.items);

  // Create order data
  const orderData = createOrderData(data, 'cod', user);

  // Create and return the order
  const newOrder = await Order.create(orderData);
  return newOrder;
};

// Handle SSLCommerz payment
const handleSSLCommerzPayment = async (
  data: TOrder,
  user: JwtPayload,
  client_ip: string,
) => {
  // Check product availability and update quantities
  await checkAndUpdateProductQuantities(data.items);

  // Create order data
  const orderData = createOrderData(data, 'sslcommerz', user);

  // Create the order first
  const newOrder = await Order.create(orderData);

  // Prepare SSLCommerz payload
  const sslcommerzPayload = {
    total_amount: data.totalPrice,
    currency: 'BDT',
    tran_id: orderData.payment.transaction.id,
    success_url: `${config.ssl_redairect_url}/orders/success/${orderData.payment.transaction.id}`,
    fail_url: `${config.ssl_redairect_url}/payment/fail`,
    cancel_url: `${config.ssl_redairect_url}/payment/cancel`,
    ipn_url: `${config.ssl_redairect_url}/payment/ipn`,
    shipping_method: 'Pathao',
    product_name: 'E-Commerce Order',
    product_category: 'General',
    product_profile: 'general',
    cus_name: data.shippingAddress.fullName,
    cus_email: user.email,
    cus_add1: data.shippingAddress.address,
    cus_city: data.shippingAddress.city,
    cus_postcode: data.shippingAddress.postalCode,
    cus_country: data.shippingAddress.country,
    cus_phone: data.shippingAddress.phone,
    ship_name: data.shippingAddress.fullName,
    ship_add1: data.shippingAddress.address,
    ship_city: data.shippingAddress.city,
    ship_postcode: data.shippingAddress.postalCode,
    ship_country: data.shippingAddress.country,
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const payment = await sslcz.init(sslcommerzPayload);

    if (!payment?.GatewayPageURL) {
      // If payment initiation fails, delete the order
      await Order.findByIdAndDelete(newOrder._id);
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to initiate payment');
    }

    return { url: payment.GatewayPageURL };
  } catch (error) {
    // If payment initiation fails, delete the order
    await Order.findByIdAndDelete(newOrder._id);
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to initiate payment: ' + (error as Error).message,
    );
  }
};

const createOrderDB = async (
  data: TOrder,
  paymentMethod: 'cod' | 'sslcommerz',
  user: JwtPayload,
  client_ip: string,
) => {
  if (paymentMethod === 'cod') {
    return handleCODOrder(data, user);
  } else {
    return handleSSLCommerzPayment(data, user, client_ip);
  }
};

const verifyPaymentDB = async (tran_id: string) => {
  const order = await Order.findOne({ 'payment.transaction.id': tran_id });
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order) {
    order.payment.status = 'paid';
    order.payment.transaction = {
      id: tran_id,
      method: 'sslcommerz',
      amount: order.totalPrice,
      currency: 'BDT',
      status: 'completed',
      paidAt: new Date(),
    };
    const res = await order.save();
    return res;
  }
};

const getOrdersDB = async (userId: Types.ObjectId) => {
  const orders = await Order.find({ user: userId })
    .populate('items.product')
    .sort({ createdAt: -1 });
  return orders;
};

const getAllProducts = async () => {
  const orders = await Order.find()
    .populate('items.product')
    .populate('user')
    .sort({ createdAt: -1 });
  return orders;
};

const getOrderByIdDB = async (orderId: string, userId: Types.ObjectId) => {
  const order = await Order.findOne({
    'payment.transaction.id': orderId,
    user: userId,
  }).populate('items.product');
  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return order;
};

export const OrderServices = {
  createOrderDB,
  verifyPaymentDB,
  getAllProducts,
  getOrdersDB,
  getOrderByIdDB,
};
