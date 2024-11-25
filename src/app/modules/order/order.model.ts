import { model, Schema } from 'mongoose';
import { Order } from './order.interface';

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<Order>('Order', orderSchema);
