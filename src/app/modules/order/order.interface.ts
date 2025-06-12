import { Types } from 'mongoose';
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
  product: Types.ObjectId;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  payment: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  quantity: number;
  totalPrice: number;
  transaction: TTransaction;
};
