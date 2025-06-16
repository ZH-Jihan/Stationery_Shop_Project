import { Types } from 'mongoose';

export type TOrderItem = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
};

export type TTransaction = {
  id: string;
  transactionStatus: string;
  bank_status: string;
  sp_code: string;
  sp_message: string;
  method: string;
  date_time: string;
};

export type TOrder = {
  user: Types.ObjectId;
  items: TOrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment: {
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    method: 'cod' | 'sslcommerz';
    transaction?: {
      id: string;
      method: string;
      amount: number;
      currency: string;
      status: 'completed' | 'failed';
      paidAt: Date;
    };
  };
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  transaction: TTransaction;
  createdAt?: Date;
  updatedAt?: Date;
};
