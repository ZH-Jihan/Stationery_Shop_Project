import { Schema, Types, model } from 'mongoose';

export type TCartItem = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
};

export type TCart = {
  user: Types.ObjectId;
  items: TCartItem[];
};

const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Cart = model<TCart>('Cart', cartSchema);
